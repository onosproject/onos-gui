/*
 * Copyright 2019-present Open Networking Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Inject, Injectable} from '@angular/core';
import * as grpcWeb from 'grpc-web';
import {gNMIClient} from './github.com/openconfig/gnmi/proto/gnmi/gnmiServiceClientPb';
import {
    CapabilityRequest,
    CapabilityResponse,
    GetRequest,
    GetResponse,
    Path,
    SetRequest, SetResponse,
    Update
} from './github.com/openconfig/gnmi/proto/gnmi/gnmi_pb';
import {
    Extension,
    RegisteredExtension
} from './github.com/openconfig/gnmi/proto/gnmi_ext/gnmi_ext_pb';

type CapabilityCallback = (e: grpcWeb.Error, r: CapabilityResponse) => void;
type GnmiGetCallback = (e: grpcWeb.Error, r: GetResponse) => void;
type GnmiSetCallback = (e: grpcWeb.Error, r: SetResponse) => void;

@Injectable()
export class OnosConfigGnmiService {

    gnmiService: gNMIClient;

    constructor(@Inject('onosConfigUrl') private onosConfigUrl: string) {
        this.gnmiService = new gNMIClient(onosConfigUrl);
        console.log('gNMI Url', onosConfigUrl);
    }

    requestCapabilities(cb: CapabilityCallback): void {
        const capabilitiesRequest = new CapabilityRequest();
        console.log('capabilities Request sent to', this.onosConfigUrl);
        this.gnmiService.capabilities(capabilitiesRequest, {}, cb);
    }

    requestGetAllByDevice(deviceId: string, cb: GnmiGetCallback): void {
        const prefixPath = new Path();
        prefixPath.setTarget(deviceId);

        const wholeDeviceRequest = new GetRequest();
        wholeDeviceRequest.setPrefix(prefixPath);
        console.log('gNMI get Request sent to', this.onosConfigUrl, wholeDeviceRequest);
        this.gnmiService.get(wholeDeviceRequest, {}, cb);
    }

    requestPushConfigToServer(updates: Array<Update>, nwChangeName: string, cb: GnmiSetCallback, version?: string, deviceType?: string) {
        const gnmiSetRequest = new SetRequest();
        for (const u of updates) {
            gnmiSetRequest.addUpdate(u);
        }
        const nwChangeNameExt = this.generateExtension(nwChangeName, 100);
        gnmiSetRequest.getExtensionList().push(nwChangeNameExt);

        if (version) {
            const versionExt = this.generateExtension(version, 101);
            gnmiSetRequest.getExtensionList().push(versionExt);
        }
        if (deviceType) {
            const deviceTypeExt = this.generateExtension(deviceType, 102);
            gnmiSetRequest.getExtensionList().push(deviceTypeExt);
        }

        this.gnmiService.set(gnmiSetRequest, {}, cb);
    }

    private generateExtension(value: string, nbr: number): Extension {
        const ext = new Extension();
        const reg = new RegisteredExtension();
        reg.setId(nbr);
        const enc = new TextEncoder();
        reg.setMsg(enc.encode(value));
        ext.setRegisteredExt(reg);
        return ext;
    }
}

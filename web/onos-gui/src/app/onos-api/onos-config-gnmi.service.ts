/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {Inject, Injectable} from '@angular/core';
import * as grpcWeb from 'grpc-web';
import {gNMIClient} from './gnmi/GnmiServiceClientPb';
import {
    CapabilityRequest,
    CapabilityResponse,
    GetRequest,
    GetResponse,
    Path,
    SetRequest, SetResponse,
    Update
} from './gnmi/gnmi_pb';
import {
    Extension,
    RegisteredExtension
} from './gnmi_ext/gnmi_ext_pb';

type CapabilityCallback = (e: grpcWeb.Error, r: CapabilityResponse) => void;
type GnmiGetCallback = (e: grpcWeb.Error, r: GetResponse) => void;
type GnmiSetCallback = (e: grpcWeb.Error, r: SetResponse) => void;

@Injectable()
export class OnosConfigGnmiService {

    gnmiService: gNMIClient;

    constructor(
        private idToken: string,
        private onosConfigUrl: string
    ) {
        this.gnmiService = new gNMIClient(onosConfigUrl);
        console.log('gNMI Url', onosConfigUrl);
    }

    requestCapabilities(cb: CapabilityCallback): void {
        const capabilitiesRequest = new CapabilityRequest();
        console.log('capabilities Request sent to', this.onosConfigUrl);
        this.gnmiService.capabilities(capabilitiesRequest, {
            Authorization: 'Bearer ' + this.idToken,
        }, cb);
    }

    requestGetAllByDevice(deviceId: string, cb: GnmiGetCallback): void {
        const prefixPath = new Path();
        prefixPath.setTarget(deviceId);

        const wholeDeviceRequest = new GetRequest();
        wholeDeviceRequest.setPrefix(prefixPath);
        console.log('gNMI get Request sent to', this.onosConfigUrl, wholeDeviceRequest);
        this.gnmiService.get(wholeDeviceRequest, {
            Authorization: 'Bearer ' + this.idToken,
        }, cb);
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

        this.gnmiService.set(gnmiSetRequest, {
            Authorization: 'Bearer ' + this.idToken,
        }, cb);
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

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

import {Injectable} from '@angular/core';
import {
    Device,
    ListResponse,
    Protocol
} from './proto/github.com/onosproject/onos-topo/api/device/device_pb';
import * as grpcWeb from 'grpc-web';
import {Subscription} from 'rxjs';
import {OnosTopoDeviceService} from './proto/onos-topo-device.service';

@Injectable({
    providedIn: 'root'
})
export class TopoDeviceService {
    deviceList: Map<string, Device>; // Expect <dev-id:dev-ver> as key
    topoDevicesSub: Subscription;
    onosTopoDeviceService: OnosTopoDeviceService;

    constructor(
        onosTopoDeviceService: OnosTopoDeviceService
    ) {
        this.deviceList = new Map<string, Device>();
        this.onosTopoDeviceService = onosTopoDeviceService;
    }

    watchTopoDevices(errorCb: (e: grpcWeb.Error) => void, updateCb?: (type: ListResponse.Type, device: Device) => void) {
        this.topoDevicesSub = this.onosTopoDeviceService.requestListDevices(true).subscribe(
            (resp: ListResponse) => {
                const nameVersion = resp.getDevice().getId() + ':' + resp.getDevice().getVersion();
                console.log('List Topo Device response', resp.getType(), resp.getDevice().getId(), resp.getDevice().getVersion());
                if (!this.deviceList.has(nameVersion) &&
                    (resp.getType() === ListResponse.Type.ADDED || resp.getType() === ListResponse.Type.NONE)) {
                    const added = this.addTopoDevice(resp.getDevice());
                    if (added && updateCb !== undefined) {
                        updateCb(resp.getType(), resp.getDevice());
                    }
                } else if (this.deviceList.has(nameVersion) && resp.getType() === ListResponse.Type.REMOVED) {
                    const removed = this.removeDevice(resp.getDevice().getId(), resp.getDevice().getVersion());
                    if (removed && updateCb) {
                        updateCb(resp.getType(), resp.getDevice());
                    }
                } else if (resp.getType() === ListResponse.Type.UPDATED) {
                    const updated = resp.getDevice();
                    const protosHandled: Protocol[] = [];
                    this.deviceList.get(nameVersion).getProtocolsList().forEach((protocol) => {
                        protosHandled.push(protocol.getProtocol());
                        const newProtoState =
                            updated.getProtocolsList().find((p) => p.getProtocol() === protocol.getProtocol());
                        if (protocol.getChannelstate() !== newProtoState.getChannelstate() ||
                            protocol.getConnectivitystate() !== newProtoState.getConnectivitystate() ||
                            protocol.getServicestate() !== newProtoState.getServicestate()) {
                            this.deviceList.set(nameVersion, resp.getDevice());
                        }
                    });
                    // In case there are some in the new set that are not in the old - just push them
                    updated.getProtocolsList().filter((p) => !protosHandled.includes(p.getProtocol())).forEach((p) => {
                        this.deviceList.set(nameVersion, resp.getDevice());
                    });
                } else {
                    console.log('Unhandled Topo update', resp.getType(), resp.getDevice().getId(), resp.getDevice().getVersion());
                }
            },
            (error) => {
                console.log('Error on topo subscription', error);
                errorCb(error);
            }
        );
    }

    stopWatchingTopoDevices() {
        this.deviceList.clear();
        if (this.topoDevicesSub) {
            this.topoDevicesSub.unsubscribe();
        }
        console.log('Stopped watching topo devices');
    }

    addTopoDevice(device: Device): boolean {
        const nameVersion = device.getId() + ':' + device.getVersion();
        if (!this.deviceList.has(nameVersion)) {
            this.deviceList.set(nameVersion, device);
            return true;
        }
        return false;
    }

    removeDevice(deviceId: string, version: string): boolean {
        const nameVersion = deviceId + ':' + version;
        if (this.deviceList.has(nameVersion)) {
            this.deviceList.delete(nameVersion);
            return true;
        }
        return false;
    }
}

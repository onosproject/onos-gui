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
    ListResponse
} from '../onos-topo/proto/github.com/onosproject/onos-topo/api/device/device_pb';
import {OnosTopoDeviceService} from '../onos-topo/proto/onos-topo-device.service';
import {OnosConfigDiagsService} from './proto/onos-config-diags.service';
import {DeviceChange} from './proto/github.com/onosproject/onos-config/api/types/change/device/types_pb';
import {ListDeviceChangeResponse} from './proto/github.com/onosproject/onos-config/api/diags/diags_pb';

/**
 * DeviceService allows consistent tracking of all known devices from
 * both Network Changes and from Topo
 */
@Injectable({
    providedIn: 'root'
})
export class DeviceService {
    deviceList: Map<string, Device>;
    deviceChangeMap: Map<string, DeviceChange>;
    deviceChangeSubs: Map<string, string>;
    diags: OnosConfigDiagsService;

    constructor() {
        this.deviceList = new Map<string, Device>();
        this.deviceChangeSubs = new Map<string, string>();
        this.deviceChangeMap = new Map<string, DeviceChange>();
    }

    init(topoDeviceService: OnosTopoDeviceService, diags: OnosConfigDiagsService) {
        this.diags = diags;
        topoDeviceService.requestListDevices(true, (deviceListItem: ListResponse) => {
            console.debug('List devices response for', deviceListItem.getDevice().getId(), 'received');
            deviceListItem['id'] = deviceListItem.getDevice().getId();
            deviceListItem['version'] = deviceListItem.getDevice().getVersion();
            this.deviceList.set(deviceListItem.getDevice().getId(), deviceListItem.getDevice());
            this.addDeviceChangeListener(deviceListItem.getDevice().getId(), deviceListItem.getDevice().getVersion());
        });
    }

    addDeviceChangeListener(deviceId: string, version: string) {
        this.deviceChangeSubs.set(deviceId + ':' + version, deviceId + ':' + version);
        this.diags.requestDeviceChanges(deviceId, version, (devch: ListDeviceChangeResponse) => {
            const ch = devch.getChange();
            console.debug('List devices change for', ch.getId(), 'received');
            this.deviceChangeMap.set(ch.getId(), ch);
        });
    }

    addDevice(deviceId: string, deviceType: string, version: string): void {
        const newDevice = new Device();
        newDevice.setId(deviceId);
        newDevice.setType(deviceType);
        newDevice.setVersion(version);
        if (!this.deviceList.has(deviceId)) {
            this.deviceList.set(deviceId, newDevice);
        }
        if (!this.deviceChangeSubs.has(deviceId + ':' + version)) {
            this.deviceChangeSubs.set(deviceId + ':' + version, deviceId + ':' + version);
            this.addDeviceChangeListener(deviceId, version);
        }
    }
}

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
    ChannelState,
    ConnectivityState,
    Device,
    ListResponse,
    Protocol,
    ProtocolState
} from '../onos-topo/proto/github.com/onosproject/onos-topo/api/device/device_pb';
import {OnosTopoDeviceService} from '../onos-topo/proto/onos-topo-device.service';
import {OnosConfigDiagsService} from './proto/onos-config-diags.service';
import {DeviceChange} from './proto/github.com/onosproject/onos-config/api/types/change/device/types_pb';
import {ListDeviceChangeResponse} from './proto/github.com/onosproject/onos-config/api/diags/diags_pb';
import {asyncScheduler, from, Observable, Observer} from 'rxjs';
import {takeWhile} from 'rxjs/operators';
import {OnosConfigAdminService} from './proto/onos-config-admin.service';
import {Snapshot} from './proto/github.com/onosproject/onos-config/api/types/snapshot/device/types_pb';

/**
 * DeviceService allows consistent tracking of all known devices from
 * both Network Changes and from Topo
 */
@Injectable({
    providedIn: 'root'
})
export class DeviceService {
    deviceList: Map<string, Device>; // Expect <dev-id:dev-ver> as key
    deviceChangeMap: Map<string, DeviceChange>; // Expect <dev-id:dev-ver> as key
    deviceChangeSubs: Map<string, string>; // Expect <nw-ch:dev-id:dev-ver> as key
    deviceSnapshotMap: Map<string, Snapshot>; // Expect <dev-id:dev-ver> as key
    diags: OnosConfigDiagsService;
    admin: OnosConfigAdminService;
    deviceChangesObs: Observable<[string, DeviceChange]>;

    constructor(topoDeviceService: OnosTopoDeviceService,
                diags: OnosConfigDiagsService,
                admin: OnosConfigAdminService) {
        this.deviceList = new Map<string, Device>();
        this.deviceChangeSubs = new Map<string, string>();
        this.deviceChangeMap = new Map<string, DeviceChange>();
        this.deviceChangesObs = from(this.deviceChangeMap).pipe(takeWhile<[string, DeviceChange]>((dcId, dc) => true));
        this.deviceSnapshotMap = new Map<string, Snapshot>();

        this.diags = diags;
        this.admin = admin;
        topoDeviceService.requestListDevices(true, (deviceListItem: ListResponse) => {
            console.debug('List devices response for', deviceListItem.getDevice().getId(), 'received');
            deviceListItem['id'] = deviceListItem.getDevice().getId();
            deviceListItem['version'] = deviceListItem.getDevice().getVersion();
            const nameVersion = deviceListItem.getDevice().getId() + ':' + deviceListItem.getDevice().getVersion();
            this.deviceList.set(nameVersion, deviceListItem.getDevice());
            this.addDeviceChangeListener(deviceListItem.getDevice().getId(), deviceListItem.getDevice().getVersion());
        });

        this.admin.requestDeviceSnapshots((s: Snapshot) => {
            console.log('List Snapshots response for', s.getId(), s.getSnapshotId(), s.getValuesList().length);
            if (!this.deviceList.has(s.getId())) {
                this.addDevice(s.getDeviceId(), '?', s.getDeviceVersion());
            }
            this.deviceSnapshotMap.set(s.getId(), s);
        });
    }

    addDeviceChangeListener(deviceId: string, version: string) {
        const nameVersion = deviceId + ':' + version;
        this.deviceChangeSubs.set(nameVersion, nameVersion);
        this.diags.requestDeviceChanges(deviceId, version, (devch: ListDeviceChangeResponse) => {
            const ch = devch.getChange();
            console.debug('List devices change for', ch.getId(), 'received');
            this.deviceChangeMap.set(ch.getId(), ch);
        });
    }

    addDevice(deviceId: string, deviceType: string, version: string): void {
        const nameVersion = deviceId + ':' + version;
        if (!this.deviceList.has(nameVersion)) {
            const newDevice = new Device();
            newDevice.setId(deviceId);
            newDevice.setType(deviceType);
            newDevice.setVersion(version);
            this.deviceList.set(nameVersion, newDevice);
        }
        if (!this.deviceChangeSubs.has(deviceId + ':' + version)) {
            this.deviceChangeSubs.set(nameVersion, deviceId + ':' + version);
            this.addDeviceChangeListener(deviceId, version);
        }
    }

    deviceStatusStyles(deviceKey: string): string[] {
        const protocolList = this.deviceList.get(deviceKey).getProtocolsList();
        const stateStyles = new Array<string>();

        protocolList.forEach((value: ProtocolState) => {
            let protocol = '';
            switch (value.getProtocol()) {
                case Protocol.GNMI:
                    protocol = 'gnmi';
                    break;
                case Protocol.GNOI:
                    protocol = 'gnoi';
                    break;
                case Protocol.P4RUNTIME:
                    protocol = 'p4runtime';
                    break;
                default:
                    protocol = 'unknown';
            }
            let channel = '';
            switch (value.getChannelstate()) {
                case ChannelState.CONNECTED:
                    channel = 'connected';
                    break;
                case ChannelState.DISCONNECTED:
                    channel = 'disconnected';
                    break;
                default:
                    channel = 'unknown';
            }
            let connectivity = '';
            switch (value.getConnectivitystate()) {
                case ConnectivityState.REACHABLE:
                    connectivity = 'reachable';
                    break;
                case ConnectivityState.UNREACHABLE:
                    connectivity = 'unreachable';
                    break;
                default:
                    connectivity = 'unknown';
            }
            stateStyles.push(protocol + '_' + channel + '_' + connectivity);
        });

        return stateStyles;
    }
}

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
    Device, ListResponse,
    Protocol,
    ProtocolState,
    ServiceState
} from '../onos-topo/proto/github.com/onosproject/onos-topo/api/device/device_pb';
import {OnosConfigDiagsService} from './proto/onos-config-diags.service';
import {OnosTopoDeviceService} from '../onos-topo/proto/onos-topo-device.service';
import {DeviceChange} from './proto/github.com/onosproject/onos-config/api/types/change/device/types_pb';
import {ListDeviceChangeResponse} from './proto/github.com/onosproject/onos-config/api/diags/diags_pb';
import {from, Observable, Subscriber, Subscription} from 'rxjs';
import {takeWhile} from 'rxjs/operators';
import {OnosConfigAdminService} from './proto/onos-config-admin.service';
import {Snapshot} from './proto/github.com/onosproject/onos-config/api/types/snapshot/device/types_pb';
import {KeyValue} from '@angular/common';
import * as grpcWeb from 'grpc-web';

export enum DeviceSortCriterion {
    ALPHABETICAL,
    STATUS,
    TYPE,
    VERSION
}

export type ErrorCallback = (e: grpcWeb.Error) => void;

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
    deviceSnapshotMap: Map<string, Snapshot>; // Expect <dev-id:dev-ver> as key
    diags: OnosConfigDiagsService;
    admin: OnosConfigAdminService;
    deviceChangesObs: Observable<[string, DeviceChange]>;
    snapshotSub: Subscription;

    constructor(diags: OnosConfigDiagsService,
                admin: OnosConfigAdminService) {
        this.deviceList = new Map<string, Device>();
        this.deviceChangeMap = new Map<string, DeviceChange>();
        this.deviceChangesObs = from(this.deviceChangeMap).pipe(takeWhile<[string, DeviceChange]>((dcId, dc) => true));
        this.deviceSnapshotMap = new Map<string, Snapshot>();

        this.diags = diags;
        this.admin = admin;
    }

    static deviceSorterForwardAlpha(a: KeyValue<string, Device>, b: KeyValue<string, Device>): number {
        return a.key < b.key ? -1 : (a.key > b.key) ? 1 : 0;
    }

    static deviceSorterReverseAlpha(a: KeyValue<string, Device>, b: KeyValue<string, Device>): number {
        return a.key < b.key ? 1 : (a.key > b.key) ? -1 : 0;
    }

    static deviceSorterForwardType(a: KeyValue<string, Device>, b: KeyValue<string, Device>): number {
        const aTypeVersion = DeviceService.concatTypeOrVersion(a.key, a.value.getVersion(), a.value.getType());
        const bTypeVersion = DeviceService.concatTypeOrVersion(b.key, b.value.getVersion(), b.value.getType());
        return  aTypeVersion < bTypeVersion ? -1 : (aTypeVersion > bTypeVersion) ? 1 : 0;
    }

    static deviceSorterReverseType(a: KeyValue<string, Device>, b: KeyValue<string, Device>): number {
        const aTypeVersion = DeviceService.concatTypeOrVersion(a.key, a.value.getVersion(), a.value.getType());
        const bTypeVersion = DeviceService.concatTypeOrVersion(b.key, b.value.getVersion(), b.value.getType());
        return  aTypeVersion < bTypeVersion ? 1 : (aTypeVersion > bTypeVersion) ? -1 : 0;
    }

    static deviceSorterForwardVersion(a: KeyValue<string, Device>, b: KeyValue<string, Device>): number {
        const aVersionType = DeviceService.concatTypeOrVersion(a.key, a.value.getVersion(), a.value.getType(), true);
        const bVersionType = DeviceService.concatTypeOrVersion(b.key, b.value.getVersion(), b.value.getType(), true);
        return  aVersionType < bVersionType ? -1 : (aVersionType > bVersionType) ? 1 : 0;
    }

    static deviceSorterReverseVersion(a: KeyValue<string, Device>, b: KeyValue<string, Device>): number {
        const aVersionType = DeviceService.concatTypeOrVersion(a.key, a.value.getVersion(), a.value.getType(), true);
        const bVersionType = DeviceService.concatTypeOrVersion(b.key, b.value.getVersion(), b.value.getType(), true);
        return  aVersionType < bVersionType ? 1 : (aVersionType > bVersionType) ? -1 : 0;
    }

    static deviceSorterForwardStatus(a: KeyValue<string, Device>, b: KeyValue<string, Device>): number {
        const aStatus = DeviceService.calculateState(a.value.getProtocolsList());
        const bStatus = DeviceService.calculateState(b.value.getProtocolsList());
        return  aStatus < bStatus ? -1 : (aStatus > bStatus) ? 1 : 0;
    }

    static deviceSorterReverseStatus(a: KeyValue<string, Device>, b: KeyValue<string, Device>): number {
        const aStatus = DeviceService.calculateState(a.value.getProtocolsList());
        const bStatus = DeviceService.calculateState(b.value.getProtocolsList());
        return  aStatus < bStatus ? 1 : (aStatus > bStatus) ? -1 : 0;
    }

    private static concatTypeOrVersion(devid: string, version: string, type: string, forVersion?: boolean): string {
        if (forVersion) {
            return version + ':' + type + ':' + devid;
        }
        return type + ':' + version + ':' + devid;
    }

    private static calculateState(protocolList: Array<ProtocolState>): number {
        let stateAsNumber: number = 0;
        protocolList.forEach((p: ProtocolState) => {
            switch (p.getConnectivitystate()) {
                case ConnectivityState.REACHABLE:
                    stateAsNumber += 0x8;
                    break;
                case ConnectivityState.UNREACHABLE:
                    stateAsNumber -= 0x8;
                    break;
                default:
            }
            switch (p.getServicestate()) {
                case ServiceState.AVAILABLE:
                    stateAsNumber += 0x4;
                    break;
                case ServiceState.UNAVAILABLE:
                    stateAsNumber -= 0x4;
                    break;
                case ServiceState.CONNECTING:
                    stateAsNumber -= 0x2;
                    break;
                default:
            }
            switch (p.getChannelstate()) {
                case ChannelState.CONNECTED:
                    stateAsNumber += 0x1;
                    break;
                case ChannelState.DISCONNECTED:
                    stateAsNumber -= 0x1;
                    break;
                default:
            }
        });
        return stateAsNumber;
    }

    watchSnapshots(errorCb: ErrorCallback) {
        this.snapshotSub = this.admin.requestDeviceSnapshots().subscribe(
    (s: Snapshot) => {
            console.log('List Snapshots response for', s.getId(), s.getSnapshotId(), s.getValuesList().length);
            if (!this.deviceList.has(s.getId())) {
                this.addDevice(s.getDeviceId(), s.getDeviceType(), s.getDeviceVersion(), false, errorCb);
            }
            this.deviceSnapshotMap.set(s.getId(), s);
            },
    (error) => {
            console.log('Error on snapshot subscription', error);
            errorCb(error);
            }
        );
    }

    stopWatchingSnapshots() {
        if (this.snapshotSub) {
            this.snapshotSub.unsubscribe();
        }
        console.log('Stopped watching snapshots');
    }

    addTopoDevice(device: Device) {
        const nameVersion = device.getId() + ':' + device.getVersion();
        if (!this.deviceList.has(nameVersion)) {
            this.deviceList.set(nameVersion, device);
        }
    }

    addDevice(deviceId: string, deviceType: string, version: string, addDcSub: boolean, errCb: ErrorCallback): void {
        const nameVersion = deviceId + ':' + version;
        if (!this.deviceList.has(nameVersion)) {
            const newDevice = new Device();
            newDevice.setId(deviceId);
            newDevice.setType(deviceType);
            newDevice.setVersion(version);
            this.deviceList.set(nameVersion, newDevice);
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
            stateStyles.push(protocol + '_' + channel);
            stateStyles.push(protocol + '_' + connectivity);
        });

        return stateStyles;
    }
}

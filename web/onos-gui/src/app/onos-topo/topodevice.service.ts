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

import { Injectable } from '@angular/core';
import {
    Device,
    ListResponse,
    Protocol
} from './proto/github.com/onosproject/onos-topo/api/device/device_pb';
import * as grpcWeb from 'grpc-web';
import { Subscription } from 'rxjs';
import { OnosTopoDeviceService } from './proto/onos-topo-device.service';
import { KeyValue } from '@angular/common';

export enum TopoDeviceSortCriterion {
    ID,
    DISPLAY,
    TYPE,
    VERSION,
    ADDRESS,
    REVISION,
    TARGET,
    TIMEOUT
}

@Injectable({
    providedIn: 'root'
})
export class TopoDeviceService {
    deviceList: Map<string, Device>; // Expect <dev-id:dev-ver> as key
    topoDevicesSub: Subscription;
    onosTopoDeviceService: OnosTopoDeviceService;
    sortParams = {
        firstCol: TopoDeviceSortCriterion.ID,
        firstCriteria: TopoDeviceService.topoDeviceSorterForwardId,
        firstCriteriaDir: 0,
        secondCol: TopoDeviceSortCriterion.DISPLAY,
        secondCriteria: TopoDeviceService.topoDeviceSorterForwardDisplay,
        secondCriteriaDir: 0,
    };

    constructor(
        onosTopoDeviceService: OnosTopoDeviceService
    ) {
        this.deviceList = new Map<string, Device>();
        this.onosTopoDeviceService = onosTopoDeviceService;
    }


    static topoDeviceSorterForwardId(a: KeyValue<string, Device>, b: KeyValue<string, Device>): number {
        const aId = a.value.getId();
        const bId = b.value.getId();
        return aId < bId ? -1 : (aId > bId) ? 1 : 0;
    }

    static topoDeviceSorterReverseId(a: KeyValue<string, Device>, b: KeyValue<string, Device>): number {
        const aId = a.value.getId();
        const bId = b.value.getId();
        // console.log("aId " + aId + " bId " + bId);
        return aId < bId ? 1 : (aId > bId) ? -1 : 0;
    }

    static topoDeviceSorterForwardDisplay(a: KeyValue<string, Device>, b: KeyValue<string, Device>): number {
        const aDisplayname = a.value.getDisplayname();
        const bDisplayname = b.value.getDisplayname();
        // console.log("aType " + aType + " bType " + bType);
        return aDisplayname < bDisplayname ? -1 : (aDisplayname > bDisplayname) ? 1 : 0;
    }

    static topoDeviceSorterReverseDisplay(a: KeyValue<string, Device>, b: KeyValue<string, Device>): number {
        const aDisplayname = a.value.getDisplayname();
        const bDisplayname = b.value.getDisplayname();
        // console.log("aType " + aType + " bType " + bType);
        return aDisplayname < bDisplayname ? 1 : (aDisplayname > bDisplayname) ? -1 : 0;
    }

    static topoDeviceSorterForwardType(a: KeyValue<string, Device>, b: KeyValue<string, Device>): number {
        const aType = a.value.getType();
        const bType = b.value.getType();
        // console.log("aType " + aType + " bType " + bType);
        return aType < bType ? -1 : (aType > bType) ? 1 : 0;
    }

    static topoDeviceSorterReverseType(a: KeyValue<string, Device>, b: KeyValue<string, Device>): number {
        const aType = a.value.getType();
        const bType = b.value.getType();
        // console.log("aType " + aType + " bType " + bType);
        return aType < bType ? 1 : (aType > bType) ? -1 : 0;
    }

    static topoDeviceSorterForwardVersion(a: KeyValue<string, Device>, b: KeyValue<string, Device>): number {
        const aVersion = a.value.getVersion();
        const bVersion = b.value.getVersion();
        // console.log("aType " + aType + " bType " + bType);
        return aVersion < bVersion ? -1 : (aVersion > bVersion) ? 1 : 0;
    }

    static topoDeviceSorterReverseVersion(a: KeyValue<string, Device>, b: KeyValue<string, Device>): number {
        const aVersion = a.value.getVersion();
        const bVersion = b.value.getVersion();
        // console.log("aType " + aType + " bType " + bType);
        return aVersion < bVersion ? 1 : (aVersion > bVersion) ? -1 : 0;
    }

    static topoDeviceSorterForwardAddress(a: KeyValue<string, Device>, b: KeyValue<string, Device>): number {
        const aAddress = a.value.getAddress();
        const bAddress = b.value.getAddress();
        // console.log("aType " + aType + " bType " + bType);
        return aAddress < bAddress ? -1 : (aAddress > bAddress) ? 1 : 0;
    }

    static topoDeviceSorterReverseAddress(a: KeyValue<string, Device>, b: KeyValue<string, Device>): number {
        const aAddress = a.value.getAddress();
        const bAddress = b.value.getAddress();
        // console.log("aType " + aType + " bType " + bType);
        return aAddress < bAddress ? 1 : (aAddress > bAddress) ? -1 : 0;
    }

    static topoDeviceSorterForwardRevision(a: KeyValue<string, Device>, b: KeyValue<string, Device>): number {
        const aRevision = Number(a.value.getRevision());
        const bRevision = Number(b.value.getRevision());
        return aRevision < bRevision ? -1 : (aRevision > bRevision) ? 1 : 0;
    }

    static topoDeviceSorterReverseRevision(a: KeyValue<string, Device>, b: KeyValue<string, Device>): number {
        const aRevision = Number(a.value.getRevision());
        const bRevision = Number(b.value.getRevision());
        return aRevision < bRevision ? 1 : (aRevision > bRevision) ? -1 : 0;
    }

    static topoDeviceSorterForwardTarget(a: KeyValue<string, Device>, b: KeyValue<string, Device>): number {
        const aTarget = a.value.getTarget();
        const bTarget = b.value.getTarget();
        // console.log("aType " + aType + " bType " + bType);
        return aTarget < bTarget ? -1 : (aTarget > bTarget) ? 1 : 0;
    }

    static topoDeviceSorterReverseTarget(a: KeyValue<string, Device>, b: KeyValue<string, Device>): number {
        const aTarget = a.value.getTarget();
        const bTarget = b.value.getTarget();
        // console.log("aType " + aType + " bType " + bType);
        return aTarget < bTarget ? 1 : (aTarget > bTarget) ? -1 : 0;
    }

    static topoDeviceSorterForwardTimeout(a: KeyValue<string, Device>, b: KeyValue<string, Device>): number {
        const aTimeout = a.value.getTimeout();
        const bTimeout = b.value.getTimeout();
        // console.log("aType " + aType + " bType " + bType);
        return aTimeout < bTimeout ? -1 : (aTimeout > bTimeout) ? 1 : 0;
    }

    static topoDeviceSorterReverseTimeout(a: KeyValue<string, Device>, b: KeyValue<string, Device>): number {
        const aTimeout = a.value.getTimeout();
        const bTimeout = b.value.getTimeout();
        // console.log("aType " + aType + " bType " + bType);
        return aTimeout < bTimeout ? 1 : (aTimeout > bTimeout) ? -1 : 0;
    }

    sortParamsFirst(sortCriterion: TopoDeviceSortCriterion, sortDir: number) {
        switch (sortCriterion * 2 | Number(sortDir).valueOf()) {
            case TopoDeviceSortCriterion.ID * 2 | 1:
                console.log('in reverse id sort');
                this.sortParams.firstCriteria = TopoDeviceService.topoDeviceSorterReverseId;
                this.sortParams.firstCriteriaDir = 1;
                break;
            case TopoDeviceSortCriterion.ID * 2 | 0:
                console.log('in forward id sort');
                this.sortParams.firstCriteria = TopoDeviceService.topoDeviceSorterForwardId;
                this.sortParams.firstCriteriaDir = 0;
                break;
            case TopoDeviceSortCriterion.DISPLAY * 2 | 1:
                console.log('in reverse DISPLAY sort');
                this.sortParams.firstCriteria = TopoDeviceService.topoDeviceSorterForwardDisplay;
                this.sortParams.firstCriteriaDir = 1;
                break;
            case TopoDeviceSortCriterion.DISPLAY * 2 | 0:
                console.log('in forward DISPLAY sort');
                this.sortParams.firstCriteria = TopoDeviceService.topoDeviceSorterReverseDisplay;
                this.sortParams.firstCriteriaDir = 0;
                break;
            case TopoDeviceSortCriterion.TYPE * 2 | 1:
                console.log('in reverse type sort');
                this.sortParams.firstCriteria = TopoDeviceService.topoDeviceSorterForwardType;
                this.sortParams.firstCriteriaDir = 1;
                break;
            case TopoDeviceSortCriterion.TYPE * 2 | 0:
                console.log('in forward type sort');
                this.sortParams.firstCriteria = TopoDeviceService.topoDeviceSorterReverseType;
                this.sortParams.firstCriteriaDir = 0;
                break;
            case TopoDeviceSortCriterion.VERSION * 2 | 1:
                console.log('in reverse VERSION sort');
                this.sortParams.firstCriteria = TopoDeviceService.topoDeviceSorterForwardVersion;
                this.sortParams.firstCriteriaDir = 1;
                break;
            case TopoDeviceSortCriterion.VERSION * 2 | 0:
                console.log('in forward VERSION sort');
                this.sortParams.firstCriteria = TopoDeviceService.topoDeviceSorterReverseVersion;
                this.sortParams.firstCriteriaDir = 0;
                break;
            case TopoDeviceSortCriterion.ADDRESS * 2 | 1:
                console.log('in reverse ADDRESS sort');
                this.sortParams.firstCriteria = TopoDeviceService.topoDeviceSorterReverseAddress;
                this.sortParams.firstCriteriaDir = 1;
                break;
            case TopoDeviceSortCriterion.ADDRESS * 2 | 0:
                console.log('in forward ADDRESS sort');
                this.sortParams.firstCriteria = TopoDeviceService.topoDeviceSorterForwardAddress;
                this.sortParams.firstCriteriaDir = 0;
                break;
            case TopoDeviceSortCriterion.REVISION * 2 | 1:
                console.log('in reverse REVISION sort');
                this.sortParams.firstCriteria = TopoDeviceService.topoDeviceSorterForwardRevision;
                this.sortParams.firstCriteriaDir = 1;
                break;
            case TopoDeviceSortCriterion.REVISION * 2 | 0:
                console.log('in forward REVISION sort');
                this.sortParams.firstCriteria = TopoDeviceService.topoDeviceSorterReverseRevision;
                this.sortParams.firstCriteriaDir = 0;
                break;
            case TopoDeviceSortCriterion.TARGET * 2 | 1:
                console.log('in reverse TARGET sort');
                this.sortParams.firstCriteria = TopoDeviceService.topoDeviceSorterForwardTarget;
                this.sortParams.firstCriteriaDir = 1;
                break;
            case TopoDeviceSortCriterion.TARGET * 2 | 0:
                console.log('in forward TARGET sort');
                this.sortParams.firstCriteria = TopoDeviceService.topoDeviceSorterReverseTarget;
                this.sortParams.firstCriteriaDir = 0;
                break;
            case TopoDeviceSortCriterion.TIMEOUT * 2 | 1:
                console.log('in reverse TIMEOUT sort');
                this.sortParams.firstCriteria = TopoDeviceService.topoDeviceSorterForwardTimeout;
                this.sortParams.firstCriteriaDir = 1;
                break;
            case TopoDeviceSortCriterion.TIMEOUT * 2 | 0:
                console.log('in forward TIMEOUT sort');
                this.sortParams.firstCriteria = TopoDeviceService.topoDeviceSorterReverseTimeout;
                this.sortParams.firstCriteriaDir = 0;
                break;
            default:
        }
    }

    sortParamsSecond(sortCriterion: TopoDeviceSortCriterion, sortDir: number) {
        switch (sortCriterion * 2 | Number(sortDir).valueOf()) {
            case TopoDeviceSortCriterion.ID * 2 | 1:
                console.log('in reverse id sort');
                this.sortParams.secondCriteria = TopoDeviceService.topoDeviceSorterReverseId;
                this.sortParams.secondCriteriaDir = 1;
                break;
            case TopoDeviceSortCriterion.ID * 2 | 0:
                console.log('in forward id sort');
                this.sortParams.secondCriteria = TopoDeviceService.topoDeviceSorterForwardId;
                this.sortParams.secondCriteriaDir = 0;
                break;
            case TopoDeviceSortCriterion.DISPLAY * 2 | 1:
                console.log('in reverse DISPLAY sort');
                this.sortParams.secondCriteria = TopoDeviceService.topoDeviceSorterForwardDisplay;
                this.sortParams.secondCriteriaDir = 1;
                break;
            case TopoDeviceSortCriterion.DISPLAY * 2 | 0:
                console.log('in forward DISPLAY sort');
                this.sortParams.secondCriteria = TopoDeviceService.topoDeviceSorterReverseDisplay;
                this.sortParams.secondCriteriaDir = 0;
                break;
            case TopoDeviceSortCriterion.TYPE * 2 | 1:
                console.log('in reverse type sort');
                this.sortParams.secondCriteria = TopoDeviceService.topoDeviceSorterForwardType;
                this.sortParams.secondCriteriaDir = 1;
                break;
            case TopoDeviceSortCriterion.TYPE * 2 | 0:
                console.log('in forward type sort');
                this.sortParams.secondCriteria = TopoDeviceService.topoDeviceSorterReverseType;
                this.sortParams.secondCriteriaDir = 0;
                break;
            case TopoDeviceSortCriterion.VERSION * 2 | 1:
                console.log('in reverse VERSION sort');
                this.sortParams.secondCriteria = TopoDeviceService.topoDeviceSorterForwardVersion;
                this.sortParams.secondCriteriaDir = 1;
                break;
            case TopoDeviceSortCriterion.VERSION * 2 | 0:
                console.log('in forward VERSION sort');
                this.sortParams.secondCriteria = TopoDeviceService.topoDeviceSorterReverseVersion;
                this.sortParams.secondCriteriaDir = 0;
                break;
            case TopoDeviceSortCriterion.ADDRESS * 2 | 1:
                console.log('in reverse ADDRESS sort');
                this.sortParams.secondCriteria = TopoDeviceService.topoDeviceSorterReverseAddress;
                this.sortParams.secondCriteriaDir = 1;
                break;
            case TopoDeviceSortCriterion.ADDRESS * 2 | 0:
                console.log('in forward ADDRESS sort');
                this.sortParams.secondCriteria = TopoDeviceService.topoDeviceSorterForwardAddress;
                this.sortParams.secondCriteriaDir = 0;
                break;
            case TopoDeviceSortCriterion.REVISION * 2 | 1:
                console.log('in reverse REVISION sort');
                this.sortParams.secondCriteria = TopoDeviceService.topoDeviceSorterForwardRevision;
                this.sortParams.secondCriteriaDir = 1;
                break;
            case TopoDeviceSortCriterion.REVISION * 2 | 0:
                console.log('in forward REVISION sort');
                this.sortParams.secondCriteria = TopoDeviceService.topoDeviceSorterReverseRevision;
                this.sortParams.secondCriteriaDir = 0;
                break;
            case TopoDeviceSortCriterion.TARGET * 2 | 1:
                console.log('in reverse TARGET sort');
                this.sortParams.secondCriteria = TopoDeviceService.topoDeviceSorterForwardTarget;
                this.sortParams.secondCriteriaDir = 1;
                break;
            case TopoDeviceSortCriterion.TARGET * 2 | 0:
                console.log('in forward TARGET sort');
                this.sortParams.secondCriteria = TopoDeviceService.topoDeviceSorterReverseTarget;
                this.sortParams.secondCriteriaDir = 0;
                break;
            case TopoDeviceSortCriterion.TIMEOUT * 2 | 1:
                console.log('in reverse TIMEOUT sort');
                this.sortParams.secondCriteria = TopoDeviceService.topoDeviceSorterForwardTimeout;
                this.sortParams.secondCriteriaDir = 1;
                break;
            case TopoDeviceSortCriterion.TIMEOUT * 2 | 0:
                console.log('in forward TIMEOUT sort');
                this.sortParams.secondCriteria = TopoDeviceService.topoDeviceSorterReverseTimeout;
                this.sortParams.secondCriteriaDir = 0;
                break;
            default:
        }
    }

    switchSortCol(colNameCriteria: TopoDeviceSortCriterion, direction: number): void {
        if (this.sortParams.firstCol === colNameCriteria) {
            if (this.sortParams.firstCriteriaDir === 1) {
                this.sortParamsFirst(colNameCriteria, 0);
                return;
            } else {
                this.sortParamsFirst(colNameCriteria, 1);
                return;
            }
        } else {
            this.sortParamsSecond(this.sortParams.firstCol, this.sortParams.firstCriteriaDir);
            this.sortParamsFirst(colNameCriteria, direction);
        }

        console.log('Sort params', this.sortParams);
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


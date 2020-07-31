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
import { Entity, SubscribeResponse, Update, Object } from './proto/github.com/onosproject/onos-topo/api/topo/topo_pb';
import { filter } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class TopoDeviceService {
    deviceList: Map<string, Device>; // Expect <dev-id:dev-ver> as key
    topoDevicesSub: Subscription;
    topoEntitySub: Subscription;
    entityList: Map<string, Object>; // Expect <dev-id:dev-ver> as key
    onosTopoDeviceService: OnosTopoDeviceService;
    sortParams = {
        firstColName: 'id',
        firstCriteria: TopoDeviceService.topoDeviceSorterForwardId,
        firstCriteriaDir: 0
    };

    constructor(
        onosTopoDeviceService: OnosTopoDeviceService
    ) {
        this.deviceList = new Map<string, Device>();
        this.entityList = new Map<string, Entity>();
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
        return aId < bId ? 1 : (aId > bId) ? -1 : 0;
    }

    static topoDeviceSorterForwardDisplay(a: KeyValue<string, Device>, b: KeyValue<string, Device>): number {
        const aDisplayname = a.value.getDisplayname() + a.value.getId();
        const bDisplayname = b.value.getDisplayname() + b.value.getId();
        return aDisplayname < bDisplayname ? -1 : (aDisplayname > bDisplayname) ? 1 : 0;
    }

    static topoDeviceSorterReverseDisplay(a: KeyValue<string, Device>, b: KeyValue<string, Device>): number {
        const aDisplayname = a.value.getDisplayname() + a.value.getId();
        const bDisplayname = b.value.getDisplayname() + b.value.getId();
        return aDisplayname < bDisplayname ? 1 : (aDisplayname > bDisplayname) ? -1 : 0;
    }

    static topoDeviceSorterForwardType(a: KeyValue<string, Device>, b: KeyValue<string, Device>): number {
        const aType = a.value.getType() + a.value.getId();
        const bType = b.value.getType() + b.value.getId();
        return aType < bType ? -1 : (aType > bType) ? 1 : 0;
    }

    static topoDeviceSorterReverseType(a: KeyValue<string, Device>, b: KeyValue<string, Device>): number {
        const aType = a.value.getType() + a.value.getId();
        const bType = b.value.getType() + b.value.getId();
        return aType < bType ? 1 : (aType > bType) ? -1 : 0;
    }

    static topoDeviceSorterForwardVersion(a: KeyValue<string, Device>, b: KeyValue<string, Device>): number {
        const aVersion = a.value.getVersion() + a.value.getId();
        const bVersion = b.value.getVersion() + b.value.getId();
        return aVersion < bVersion ? -1 : (aVersion > bVersion) ? 1 : 0;
    }

    static topoDeviceSorterReverseVersion(a: KeyValue<string, Device>, b: KeyValue<string, Device>): number {
        const aVersion = a.value.getVersion() + a.value.getId();
        const bVersion = b.value.getVersion() + b.value.getId();
        return aVersion < bVersion ? 1 : (aVersion > bVersion) ? -1 : 0;
    }

    static topoDeviceSorterForwardAddress(a: KeyValue<string, Device>, b: KeyValue<string, Device>): number {
        const aAddress = a.value.getAddress() + a.value.getId();
        const bAddress = b.value.getAddress() + b.value.getId();
        return aAddress < bAddress ? -1 : (aAddress > bAddress) ? 1 : 0;
    }

    static topoDeviceSorterReverseAddress(a: KeyValue<string, Device>, b: KeyValue<string, Device>): number {
        const aAddress = a.value.getAddress() + a.value.getId();
        const bAddress = b.value.getAddress() + b.value.getId();
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
        const aTarget = a.value.getTarget() + a.value.getId();
        const bTarget = b.value.getTarget() + b.value.getId();
        return aTarget < bTarget ? -1 : (aTarget > bTarget) ? 1 : 0;
    }

    static topoDeviceSorterReverseTarget(a: KeyValue<string, Device>, b: KeyValue<string, Device>): number {
        const aTarget = a.value.getTarget() + a.value.getId();
        const bTarget = b.value.getTarget() + b.value.getId();
        return aTarget < bTarget ? 1 : (aTarget > bTarget) ? -1 : 0;
    }

    static topoDeviceSorterForwardTimeout(a: KeyValue<string, Device>, b: KeyValue<string, Device>): number {
        const aTimeout = a.value.getTimeout() + a.value.getId();
        const bTimeout = b.value.getTimeout() + b.value.getId();
        return aTimeout < bTimeout ? -1 : (aTimeout > bTimeout) ? 1 : 0;
    }

    static topoDeviceSorterReverseTimeout(a: KeyValue<string, Device>, b: KeyValue<string, Device>): number {
        const aTimeout = a.value.getTimeout() + a.value.getId();
        const bTimeout = b.value.getTimeout() + b.value.getId();
        return aTimeout < bTimeout ? 1 : (aTimeout > bTimeout) ? -1 : 0;
    }

    sortParamsFirst(sortCriterion: string, sortDir: number) {
        this.sortParams.firstCriteriaDir = sortDir;
        this.sortParams.firstColName = sortCriterion;
        if (sortDir === 1) {
            switch (sortCriterion) {
                case 'id':
                    this.sortParams.firstCriteria = TopoDeviceService.topoDeviceSorterReverseId;
                    break;
                case 'display':
                    this.sortParams.firstCriteria = TopoDeviceService.topoDeviceSorterReverseDisplay;
                    break;
                case 'type':
                    this.sortParams.firstCriteria = TopoDeviceService.topoDeviceSorterReverseType;
                    break;
                case 'version':
                    this.sortParams.firstCriteria = TopoDeviceService.topoDeviceSorterReverseVersion;
                    break;
                case 'address':
                    this.sortParams.firstCriteria = TopoDeviceService.topoDeviceSorterReverseAddress;
                    break;
                case 'revision':
                    this.sortParams.firstCriteria = TopoDeviceService.topoDeviceSorterReverseRevision;
                    break;
                case 'target':
                    this.sortParams.firstCriteria = TopoDeviceService.topoDeviceSorterReverseTarget;
                    break;
                case 'timeout':
                    this.sortParams.firstCriteria = TopoDeviceService.topoDeviceSorterReverseTimeout;
                    break;
                default:
            }
        } else {
            switch (sortCriterion) {
                case 'id':
                    this.sortParams.firstCriteria = TopoDeviceService.topoDeviceSorterForwardId;
                    break;
                case 'display':
                    this.sortParams.firstCriteria = TopoDeviceService.topoDeviceSorterForwardDisplay;
                    break;
                case 'type':
                    this.sortParams.firstCriteria = TopoDeviceService.topoDeviceSorterForwardType;
                    break;
                case 'version':
                    this.sortParams.firstCriteria = TopoDeviceService.topoDeviceSorterForwardVersion;
                    break;
                case 'address':
                    this.sortParams.firstCriteria = TopoDeviceService.topoDeviceSorterForwardAddress;
                    break;
                case 'revision':
                    this.sortParams.firstCriteria = TopoDeviceService.topoDeviceSorterForwardRevision;
                    break;
                case 'target':
                    this.sortParams.firstCriteria = TopoDeviceService.topoDeviceSorterForwardTarget;
                    break;
                case 'timeout':
                    this.sortParams.firstCriteria = TopoDeviceService.topoDeviceSorterForwardTimeout;
                    break;
                default:
            }
        }
    }

    switchSortCol(colName: string, direction: number): void {
        if (this.sortParams.firstColName === colName) {
            if (this.sortParams.firstCriteriaDir === 1) {
                return this.sortParamsFirst(colName, 0);
            } else {
                return this.sortParamsFirst(colName, 1);
            }
        } else {
            this.sortParamsFirst(colName, direction);
        }
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

    watchTopoEntity(errorCb: (e: grpcWeb.Error) => void, updateCb?: (type: Update.Type, entity: Object) => void) {
        this.topoEntitySub = this.onosTopoDeviceService.requestListTopo().pipe(
            filter(x => x.getUpdate().getObject().getType() === 1)
        ).subscribe(
            (resp: SubscribeResponse) => {
                const name = resp.getUpdate().getObject().getType() + ' ' + resp.getUpdate().getObject().getId();
                console.log('List Topo Entity response ', name);
                if (!this.entityList.has(name) &&
                    (resp.getUpdate().getType() === Update.Type.INSERT || resp.getUpdate().getType() === Update.Type.UNSPECIFIED)) {
                    const added = this.addTopoEntity(resp.getUpdate().getObject());
                    if (added && updateCb !== undefined) {
                        updateCb(resp.getUpdate().getType(), resp.getUpdate().getObject());
                    }
                } else if (this.entityList.has(name) && resp.getUpdate().getType() === Update.Type.DELETE) {
                    const removed = this.removeEntity(resp.getUpdate().getObject().getId());
                    if (removed && updateCb) {
                        updateCb(resp.getUpdate().getType(), resp.getUpdate().getObject());
                    }
                } else if (resp.getUpdate().getType() === Update.Type.MODIFY) {
                    const updated = resp.getUpdate().getObject();
                    this.entityList.set(name, updated);
                } else {
                    console.log('Unhandled Topo update', resp.getUpdate().getType(), resp.getUpdate().getObject().getId());
                }
            },
            (error) => {
                console.log('Error on topo entity subscription', error);
                errorCb(error);
            }
        );
    }

    removeEntity(name: string): boolean {
        if (this.entityList.has(name)) {
            this.entityList.delete(name);
            return true;
        }
        return false;
    }

    addTopoEntity(obj: Object): boolean  {
        const name = obj.getId();
        if (!this.deviceList.has(name)) {
            this.entityList.set(name, obj);
            return true;
        }
        return false;
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

    stopWatchingTopoDevices() {
        this.deviceList.clear();
        if (this.topoDevicesSub) {
            this.topoDevicesSub.unsubscribe();
        }
        console.log('Stopped watching topo devices');
    }

    stopWatchingTopoEntity() {
        this.entityList.clear();
        if (this.topoEntitySub) {
            this.topoEntitySub.unsubscribe();
        }
        console.log('Stopped watching topo devices');
    }
}



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
    Entity,
    Object as EntityObject,
    Protocol,
    ProtocolState,
    ServiceState
} from '../onos-api/onos/topo/topo_pb';
import {OnosConfigDiagsService} from '../onos-api/onos-config-diags.service';
import {DeviceChange} from '../onos-api/onos/config/change/device/types_pb';
import {from, Observable, Subscription} from 'rxjs';
import {takeWhile} from 'rxjs/operators';
import {OnosConfigAdminService} from '../onos-api/onos-config-admin.service';
import {Snapshot} from '../onos-api/onos/config/snapshot/device/types_pb';
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
    entityList: Map<string, EntityObject>; // Expect <dev-id:dev-ver> as key
    deviceChangeMap: Map<string, DeviceChange>; // Expect <dev-id:dev-ver> as key
    deviceSnapshotMap: Map<string, Snapshot>; // Expect <dev-id:dev-ver> as key
    diags: OnosConfigDiagsService;
    admin: OnosConfigAdminService;
    deviceChangesObs: Observable<[string, DeviceChange]>;
    snapshotSub: Subscription;

    constructor(diags: OnosConfigDiagsService,
                admin: OnosConfigAdminService) {
        this.entityList = new Map<string, EntityObject>();
        this.deviceChangeMap = new Map<string, DeviceChange>();
        this.deviceChangesObs = from(this.deviceChangeMap).pipe(takeWhile<[string, DeviceChange]>((dcId, dc) => true));
        this.deviceSnapshotMap = new Map<string, Snapshot>();

        this.diags = diags;
        this.admin = admin;
    }

    static entitySorterForwardAlpha(a: KeyValue<string, EntityObject>, b: KeyValue<string, EntityObject>): number {
        return a.key < b.key ? -1 : (a.key > b.key) ? 1 : 0;
    }

    static entitySorterReverseAlpha(a: KeyValue<string, EntityObject>, b: KeyValue<string, EntityObject>): number {
        return a.key < b.key ? 1 : (a.key > b.key) ? -1 : 0;
    }

    static entitySorterForwardKind(a: KeyValue<string, EntityObject>, b: KeyValue<string, EntityObject>): number {
        const aKind = DeviceService.calculateKind(a.key, a.value.getEntity().getKindId());
        const bKind = DeviceService.calculateKind(b.key, b.value.getEntity().getKindId());
        return  aKind < bKind ? 1 : (aKind > bKind) ? -1 : 0;
    }

    static entitySorterReverseKind(a: KeyValue<string, EntityObject>, b: KeyValue<string, EntityObject>): number {
        const aKind = DeviceService.calculateKind(a.key, a.value.getEntity().getKindId());
        const bKind = DeviceService.calculateKind(b.key, b.value.getEntity().getKindId());
        return  aKind < bKind ? -1 : (aKind > bKind) ? 1 : 0;
    }

    static entitySorterForwardStatus(a: KeyValue<string, EntityObject>, b: KeyValue<string, EntityObject>): number {
        const aStatus = DeviceService.calculateState(a.value.getEntity().getProtocolsList());
        const bStatus = DeviceService.calculateState(b.value.getEntity().getProtocolsList());
        return  aStatus < bStatus ? -1 : (aStatus > bStatus) ? 1 : 0;
    }

    static entitySorterReverseStatus(a: KeyValue<string, EntityObject>, b: KeyValue<string, EntityObject>): number {
        const aStatus = DeviceService.calculateState(a.value.getEntity().getProtocolsList());
        const bStatus = DeviceService.calculateState(b.value.getEntity().getProtocolsList());
        return  aStatus < bStatus ? 1 : (aStatus > bStatus) ? -1 : 0;
    }

    private static calculateKind(devid: string, kind: string): string {
        return kind + devid;
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
        this.snapshotSub = this.admin.requestSnapshots('').subscribe(
    (s: Snapshot) => {
            console.log('List Snapshots response for', s.getId(), s.getSnapshotId(), s.getValuesList().length);
            if (!this.entityList.has(s.getId())) {
                this.addEntity(s.getDeviceId(), s.getDeviceType(), s.getDeviceVersion(), false, errorCb);
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

    addTopoEntity(entity: EntityObject) {
        const nameVersion = entity.getId() + ':' + entity.getAttributesMap().get('version');
        if (!this.entityList.has(nameVersion)) {
            if (entity.getType().valueOf() === 1) { // An entity - not Relationship or Kind
                this.entityList.set(nameVersion, entity);
                console.log('Adding topo entity', nameVersion, entity.getType());
            }
        }
    }

    addEntity(entityId: string, deviceType: string, version: string, addDcSub: boolean, errCb: ErrorCallback): void {
        const nameVersion = entityId + ':' + version;
        if (!this.entityList.has(nameVersion)) {
            const newEntityObject = new EntityObject();
            newEntityObject.setId(entityId);
            newEntityObject.setType(EntityObject.Type.ENTITY);
            newEntityObject.getAttributesMap().set('version', version);
            const newEntity = new Entity();
            newEntity.setKindId(deviceType);
            newEntityObject.setEntity(newEntity);
            this.entityList.set(nameVersion, newEntityObject);
            console.log('Adding config entity', nameVersion);
        }
    }


    deviceStatusStyles(entityKey: string): string[] {
        const entityObj = this.entityList.get(entityKey);
        if (entityObj === undefined || entityObj.getEntity() === undefined) {
            console.log('Could not find key', entityKey);
            return [];
        }
        const protocolList = entityObj.getEntity().getProtocolsList();
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

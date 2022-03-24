/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {KeyValue} from '@angular/common';
import {
    DeviceService,
    DeviceSortCriterion,
    ErrorCallback
} from '../device.service';
import {IconService} from 'gui2-fw-lib';
import {animate, state, style, transition, trigger} from '@angular/animations';
import * as grpcWeb from 'grpc-web';
import {ConnectivityService} from '../../connectivity.service';
import {Subscription} from 'rxjs';
import {TopoEntityService} from '../../onos-topo/topo-entity.service';
import {
    Change,
    ChangeValue, PathValue
} from '../../onos-api/onos/config/change/device/types_pb';
import {NetworkChange} from '../../onos-api/onos/config/change/network/types_pb';
import {OnosConfigDiagsService} from '../../onos-api/onos-config-diags.service';
import {OnosConfigAdminService} from '../../onos-api/onos-config-admin.service';
import {EventType, Object as EntityObject} from '../../onos-api/onos/topo/topo_pb';
import {ListNetworkChangeResponse} from '../../onos-api/onos/config/diags/diags_pb';
import {Phase, State} from '../../onos-api/onos/config/change/types_pb';

@Component({
    selector: 'onos-config-dashboard',
    templateUrl: './config-dashboard.component.html',
    styleUrls: ['./config-dashboard.component.css'],
    animations: [
        trigger('deviceBorderFlash', [
            state('true', style({
                'border': 'solid white 1px',
            })),
            transition('* => 1', animate('500ms ease-out')),
        ])
    ]
})
export class ConfigDashboardComponent implements OnInit, OnDestroy {
    selectedChange: Change; // The complete row - not just the selId
    selId: string;
    networkChanges: Map<string, NetworkChange>;
    sortReverse: boolean = false;
    sortCriterion: DeviceSortCriterion = DeviceSortCriterion.ALPHABETICAL;
    deviceSortCriterion = DeviceService.entitySorterForwardAlpha;
    retenionSecs: number = 86400;
    compactChangesMsg: string = undefined;
    compactChangesConfirmMsg: string = undefined;
    rollbackMsg: string = undefined;
    rollbackConfigMsg: string = undefined;
    rollbackNwChName: string = undefined;
    nwchangesSub: Subscription;

    constructor(
        private diags: OnosConfigDiagsService,
        private topoDeviceService: TopoEntityService,
        private admin: OnosConfigAdminService,
        public deviceService: DeviceService,
        private is: IconService,
        private cdr: ChangeDetectorRef,
        private connectivityService: ConnectivityService,
    ) {
        this.networkChanges = new Map<string, NetworkChange>();
        console.log('ConfigDashboardComponent constructed');
        this.is.loadIconDef('xClose');
    }

    ngOnInit() {
        this.connectivityService.hideVeil();

        this.topoDeviceService.watchTopoEntity((err: grpcWeb.Error) => {
            this.connectivityService.showVeil([
                'Topo Entity service gRPC error', String(err.code), err.message,
                'Please ensure onos-config is reachable',
                'Choose a different application from the menu']);
        },
            (type, entity) => {
            if (type === EventType.ADDED || type === EventType.NONE) {
                this.deviceService.addTopoEntity(entity);
            }
        });

        this.watchNetworkChanges((err: grpcWeb.Error) => {
            this.connectivityService.showVeil([
                'Network Changes service gRPC error', String(err.code), err.message,
                'Please ensure onos-config is reachable',
                'Choose a different application from the menu']);
        });

        this.deviceService.watchSnapshots((err: grpcWeb.Error) => {
            this.connectivityService.showVeil([
                'Device Snapshot service gRPC error', String(err.code), err.message,
                'Please ensure onos-config is reachable',
                'Choose a different application from the menu']);
        });
        console.log('ConfigDashboardComponent initialized');
    }

    ngOnDestroy(): void {
        this.topoDeviceService.stopWatchingTopoEntity();
        this.topoDeviceService.stopWatchingTopoRelations();
        this.deviceService.stopWatchingSnapshots();
        this.nwchangesSub.unsubscribe();
        console.log('Stopped watching NetworkChanges');
    }

    watchNetworkChanges(errCb: ErrorCallback) {
        this.nwchangesSub = this.diags.requestNetworkChanges().subscribe(
            (nwch: ListNetworkChangeResponse) => {
                const change = nwch.getChange();
                if (this.networkChanges.has(change.getId()) && change.getDeleted()) {
                    this.networkChanges.delete(change.getId());
                    console.log(change.getId(), 'deleted');
                } else if (!change.getDeleted()) {
                    this.networkChanges.set(change.getId(), change);
                    change.getChangesList().forEach((ch: Change) => {
                        this.deviceService.addEntity(ch.getDeviceId(), ch.getDeviceType(), ch.getDeviceVersion(), true, errCb);
                    });
                    console.log('Network Change', change.getId(), 'updated');
                }
            },
            (err: grpcWeb.Error) => {
                errCb(err);
            });
    }

    /*
     * Ensure that the list of network changes are ordered by increasing age
     */
    nwChangeIncreasingAge = (a: KeyValue<string, NetworkChange>, b: KeyValue<string, NetworkChange>): number => {
        return a.value.getCreated() < b.value.getCreated() ? 1 : (a.value.getCreated() > b.value.getCreated() ? -1 : 0);
    }

    nwChangeDecreasingIndex = (a: KeyValue<string, NetworkChange>, b: KeyValue<string, NetworkChange>): number => {
        return a.value.getIndex() < b.value.getIndex() ? 1 : (a.value.getIndex() > b.value.getIndex() ? -1 : 0);
    }

    deviceChangeSelected(deviceChange: Change, nwChangeId: string) {
        const deviceChangeId = nwChangeId + ':' + deviceChange.getDeviceId() + ':' + deviceChange.getDeviceVersion();
        console.log('Device change selected', deviceChange.getDeviceId(), deviceChange.getDeviceVersion());
        if (deviceChangeId === this.selId) {
            this.selId = '';
            this.selectedChange = undefined;
            return;
        }
        this.selId = deviceChangeId;
        this.selectedChange = deviceChange;
    }

    deviceSnapshotSelected(deviceSnapshotId: string) {
        console.log('Device snapshot selected', deviceSnapshotId);
        if (deviceSnapshotId === this.selId) {
            this.selId = '';
            this.selectedChange = undefined;
            return;
        }
        this.selId = deviceSnapshotId;
        const snapshot = this.deviceService.deviceSnapshotMap.get(deviceSnapshotId);
        // Fake the snapshot as a DeviceChange, so we can display the same way
        const fakeChange = new Change();
        fakeChange.setDeviceId(snapshot.getDeviceId());
        fakeChange.setDeviceVersion(snapshot.getDeviceVersion());
        const values = new Array<ChangeValue>();
        snapshot.getValuesList().forEach((pathValue: PathValue) => {
            const cv = new ChangeValue();
            cv.setPath(pathValue.getPath());
            cv.setValue(pathValue.getValue());
            values.push(cv);
        });
        fakeChange.setValuesList(values);
        this.selectedChange = fakeChange;
    }

    updateSort() {
        console.log('Sort order updated', this.sortCriterion, this.sortReverse, this.sortCriterion | Number(this.sortReverse).valueOf());
        switch (this.sortCriterion * 2 | Number(this.sortReverse).valueOf()) {
            case DeviceSortCriterion.VERSION * 2 | 1:
                this.deviceSortCriterion = DeviceService.entitySorterForwardKind;
                break;
            case DeviceSortCriterion.VERSION * 2 | 0:
                this.deviceSortCriterion = DeviceService.entitySorterReverseKind;
                break;
            case DeviceSortCriterion.STATUS * 2 | 1:
                this.deviceSortCriterion = DeviceService.entitySorterReverseStatus;
                break;
            case DeviceSortCriterion.STATUS * 2 | 0:
                this.deviceSortCriterion = DeviceService.entitySorterForwardStatus;
                break;
            case DeviceSortCriterion.ALPHABETICAL * 2 | 1:
                this.deviceSortCriterion = DeviceService.entitySorterReverseAlpha;
                break;
            case DeviceSortCriterion.ALPHABETICAL * 2 | 0:
            default:
                this.deviceSortCriterion = DeviceService.entitySorterForwardAlpha;
        }
        // Force a refresh by updating the data source
        this.deviceService.entityList.set('wakeup', new EntityObject());
        this.cdr.detectChanges();
        this.deviceService.entityList.delete('wakeup');
    }

    compactChangesDialog() {
        this.compactChangesMsg = 'Compact Network Changes?';
        const retensionStart = Date.now() - this.retenionSecs * 1000;
        this.compactChangesConfirmMsg = 'All changes before ' + new Date(retensionStart) + ' will be compacted. Cannot be undone.';
    }

    confirmedCompactChanges(chosen: boolean) {
        this.compactChangesMsg = undefined;
        this.compactChangesConfirmMsg = undefined;
        if (chosen) {
            const myObs = this.admin.requestCompactChanges(this.retenionSecs);
            myObs.subscribe((resp) => {
                console.log('Changes compacted!');
            }, error => {
                console.log('Changes compacting error', error);
            });
        }
    }

    /**
     * Get counts of every device change in the system
     * @param deviceId The column (device) that's being handled
     */
    countChangesStates(deviceId: string, ver: string): string {
        let pending = 0;
        let complete = 0;
        let failed = 0;
        let total = 0;
        let change = 0;
        let rollback = 0;

        this.networkChanges.forEach((nwCh) => {
            if (nwCh.getChangesList().findIndex(
                (ch) => ch.getDeviceId() === deviceId && ch.getDeviceVersion() === ver) !== -1) {
                total = total + 1;
                switch (nwCh.getStatus().getState()) {
                    case State.PENDING:
                        pending = pending + 1;
                        break;
                    case State.COMPLETE:
                        complete = complete + 1;
                        break;
                    case State.FAILED:
                        failed = failed + 1;
                }
                switch (nwCh.getStatus().getPhase()) {
                    case Phase.CHANGE:
                        change = change + 1;
                        break;
                    case Phase.ROLLBACK:
                        rollback = rollback + 1;
                }
            }
        });

        return pending + '/' + complete + '/' + failed + '/' + total + '\n' + change + '/' + rollback;
    }

    rollbackDialog(rolledback: boolean, nwChId: string): void {
        this.rollbackMsg = 'Rollback Network Change?';
        this.rollbackConfigMsg = 'Change ' + nwChId + ' will be rolled back. It\'s changes will be ignored. Cannot be undone.';
        this.rollbackNwChName = nwChId;
    }

    confirmedRollback(chosen: boolean) {
        this.rollbackMsg = undefined;
        this.rollbackConfigMsg = undefined;
        const nwChange = this.rollbackNwChName;
        this.rollbackNwChName = undefined;
        if (chosen) {
            const myObs = this.admin.requestRollback(nwChange);
            myObs.subscribe((resp) => {
                console.log('Change ', nwChange, 'rolled back!');
            }, error => {
                console.log('Rollback', nwChange, 'error', error);
            });
        }
    }
}

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

import {
    ChangeDetectorRef,
    Component, Host, OnDestroy,
    OnInit
} from '@angular/core';
import {KeyValue} from '@angular/common';
import {OnosConfigDiagsService} from '../proto/onos-config-diags.service';
import {NetworkChange} from '../proto/github.com/onosproject/onos-config/api/types/change/network/types_pb';
import {ListNetworkChangeResponse} from '../proto/github.com/onosproject/onos-config/api/diags/diags_pb';
import {OnosTopoDeviceService} from '../../onos-topo/proto/onos-topo-device.service';
import {
    DeviceService,
    DeviceSortCriterion,
    ErrorCallback
} from '../device.service';
import {
    Change,
    ChangeValue,
    DeviceChange,
    PathValue
} from '../proto/github.com/onosproject/onos-config/api/types/change/device/types_pb';
import {IconService, VeilComponent} from 'gui2-fw-lib';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {
    Phase,
    State,
    Status
} from '../proto/github.com/onosproject/onos-config/api/types/change/types_pb';
import {Device} from '../../onos-topo/proto/github.com/onosproject/onos-topo/api/device/device_pb';
import {OnosConfigAdminService} from '../proto/onos-config-admin.service';
import * as grpcWeb from 'grpc-web';
import {ConnectivityService} from '../../connectivity.service';
import {Subscription} from 'rxjs';

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
    selectedChange: DeviceChange; // The complete row - not just the selId
    selId: string;
    networkChanges: Map<string, NetworkChange>;
    sortReverse: boolean = false;
    sortCriterion: DeviceSortCriterion = DeviceSortCriterion.ALPHABETICAL;
    deviceSortCriterion = DeviceService.deviceSorterForwardAlpha;
    retenionSecs: number = 86400;
    compactChangesMsg: string = undefined;
    compactChangesConfirmMsg: string = undefined;
    nwchangesSub: Subscription;

    constructor(
        private diags: OnosConfigDiagsService,
        private topoDeviceService: OnosTopoDeviceService,
        private admin: OnosConfigAdminService,
        public deviceService: DeviceService,
        private is: IconService,
        private cdr: ChangeDetectorRef,
        private connectivityService: ConnectivityService
    ) {
        this.networkChanges = new Map<string, NetworkChange>();
        console.log('ConfigDashboardComponent constructed');
        this.is.loadIconDef('xClose');
    }

    ngOnInit() {
        this.deviceService.watchTopoDevices((err: grpcWeb.Error) => {
            this.connectivityService.showVeil([
                'Topo Devices gRPC error', String(err.code), err.message,
                'Please ensure onos-config is reachable']);
        });

        this.watchNetworkChanges((err: grpcWeb.Error) => {
            this.connectivityService.showVeil([
                'Network Changes gRPC error', String(err.code), err.message,
                'Please ensure onos-config is reachable']);
        });

        this.deviceService.watchSnapshots((err: grpcWeb.Error) => {
            this.connectivityService.showVeil([
                'Device Snapshot gRPC error', String(err.code), err.message,
                'Please ensure onos-config is reachable']);
        });
        console.log('ConfigDashboardComponent initialized');
    }

    ngOnDestroy(): void {
        this.deviceService.stopWatchingTopoDevices();
        this.deviceService.stopWatchingSnapshots();
        this.deviceService.closeAllDeviceChangeSubs();
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
                        this.deviceService.addDevice(ch.getDeviceId(), ch.getDeviceType(), ch.getDeviceVersion(), true, errCb);
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

    deviceChangeSelected(deviceChangeId: string, networkChange: NetworkChange) {
        console.log('Device change selected', deviceChangeId);
        if (deviceChangeId === this.selId) {
            this.selId = '';
            this.selectedChange = undefined;
            return;
        }
        this.selId = deviceChangeId;
        this.selectedChange = this.deviceService.deviceChangeMap.get(deviceChangeId);
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
        const fakeDc = new DeviceChange();
        fakeDc.setId(deviceSnapshotId);
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
        fakeDc.setChange(fakeChange);
        fakeDc.setIndex(snapshot.getChangeIndex());
        const status = new Status();
        status.setMessage('SNAPSHOT');
        status.setState(State.COMPLETE);
        status.setPhase(Phase.CHANGE);
        fakeDc.setStatus(status);
        this.selectedChange = fakeDc;
    }

    updateSort() {
        console.log('Sort order updated', this.sortCriterion, this.sortReverse, this.sortCriterion | Number(this.sortReverse).valueOf());
        switch (this.sortCriterion * 2 | Number(this.sortReverse).valueOf()) {
            case DeviceSortCriterion.TYPE * 2 | 1:
                this.deviceSortCriterion = DeviceService.deviceSorterReverseType;
                break;
            case DeviceSortCriterion.TYPE * 2 | 0:
                this.deviceSortCriterion = DeviceService.deviceSorterForwardType;
                break;
            case DeviceSortCriterion.VERSION * 2 | 1:
                this.deviceSortCriterion = DeviceService.deviceSorterReverseVersion;
                break;
            case DeviceSortCriterion.VERSION * 2 | 0:
                this.deviceSortCriterion = DeviceService.deviceSorterForwardVersion;
                break;
            case DeviceSortCriterion.STATUS * 2 | 1:
                this.deviceSortCriterion = DeviceService.deviceSorterReverseStatus;
                break;
            case DeviceSortCriterion.STATUS * 2 | 0:
                this.deviceSortCriterion = DeviceService.deviceSorterForwardStatus;
                break;
            case DeviceSortCriterion.ALPHABETICAL * 2 | 1:
                this.deviceSortCriterion = DeviceService.deviceSorterReverseAlpha;
                break;
            case DeviceSortCriterion.ALPHABETICAL * 2 | 0:
            default:
                this.deviceSortCriterion = DeviceService.deviceSorterForwardAlpha;
        }
        // Force a refresh by updating the data source
        this.deviceService.deviceList.set('wakeup', new Device());
        this.cdr.detectChanges();
        this.deviceService.deviceList.delete('wakeup');
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
}

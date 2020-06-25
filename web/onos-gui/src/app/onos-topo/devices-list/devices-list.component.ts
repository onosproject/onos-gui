/*
 * Copyright 2018-present Open Networking Foundation
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

import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import {
    Device,
} from '../proto/github.com/onosproject/onos-topo/api/device/device_pb';
import {
    FnService, IconService,
    LogService, SortDir, TableAnnots,
} from 'gui2-fw-lib';
import { ActivatedRoute, Router } from '@angular/router';
import * as grpcWeb from 'grpc-web';
import { TopoDeviceService, TopoDeviceSortCriterion } from '../topodevice.service';
import { ConnectivityService } from '../../connectivity.service';

@Component({
    selector: 'onos-devices-list',
    templateUrl: './devices-list.component.html',
    styleUrls: [
        './devices-list.component.css',
        '../../fw/widget/table.css',
        '../../fw/widget/table.theme.css'
    ]
})
export class DevicesListComponent implements OnInit, OnDestroy {
    selectedChange: Device;
    selId: string = undefined;
    public annots: TableAnnots;
    sortReverse: boolean = false;
    sortCriterion: TopoDeviceSortCriterion = TopoDeviceSortCriterion.ID;
    topoDeviceSortCriterion = TopoDeviceService.topoDeviceSorterForwardId;

    constructor(
        protected fs: FnService,
        protected log: LogService,
        protected as: ActivatedRoute,
        protected router: Router,
        private cdr: ChangeDetectorRef,
        protected is: IconService,
        public topoDeviceService: TopoDeviceService,
        private connectivityService: ConnectivityService
    ) {
        this.is.loadIconDef('switch');
        this.is.loadIconDef('xClose');

        this.annots = <TableAnnots>{
            noRowsMsg: 'No data found'
        };

        console.log('Constructed DevicesListComponent');
    }

    ngOnInit() {
        this.connectivityService.hideVeil();
        this.topoDeviceService.watchTopoDevices((err: grpcWeb.Error) => {
            this.connectivityService.showVeil([
                'Topo Devices service gRPC error', String(err.code), err.message,
                'Please ensure onos-topo is reachable',
                'Choose a different application from the menu']);
        });
    }

    ngOnDestroy(): void {
        this.topoDeviceService.stopWatchingTopoDevices();
    }

    selectCallback(event, devId: string, device: Device): void {
        this.selId = (this.selId === devId ? undefined : devId);
        this.selectedChange = device;
    }

    deselectRow(event): void {
        this.selectedChange = undefined;
        this.selId = undefined;
    }

    onSort(colName: string) {
        switch (colName) {
            case "id":
                this.sortCriterion = TopoDeviceSortCriterion.ID;
                this.updateSort();
                this.sortReverse == true ? this.sortReverse = false : this.sortReverse = true;
                break;
            case "type":
                this.sortCriterion = TopoDeviceSortCriterion.TYPE;
                this.updateSort();
                this.sortReverse == true ? this.sortReverse = false : this.sortReverse = true;
                break;
            default:
        }
    }

    updateSort() {
        console.log('Sort order updated', this.sortCriterion, this.sortReverse, this.sortCriterion | Number(this.sortReverse).valueOf());
        switch (this.sortCriterion | Number(this.sortReverse).valueOf()) {
            case TopoDeviceSortCriterion.ID | 1:
                console.log("in reverse id sort");
                this.topoDeviceSortCriterion = TopoDeviceService.topoDeviceSorterReverseId;
                break;
            case TopoDeviceSortCriterion.ID | 0:
                console.log("in forward id sort");
                this.topoDeviceSortCriterion = TopoDeviceService.topoDeviceSorterForwardId;
                break;
            case TopoDeviceSortCriterion.TYPE | 1:
                console.log("in reverse type sort");
                this.topoDeviceSortCriterion = TopoDeviceService.topoDeviceSorterForwardType;
                break;
            case TopoDeviceSortCriterion.TYPE | 0:
                console.log("in forward type sort");
                this.topoDeviceSortCriterion = TopoDeviceService.topoDeviceSorterReverseType;
                break;
            case TopoDeviceSortCriterion.DISPLAY | 1:
                console.log("in reverse DISPLAY sort");
                this.topoDeviceSortCriterion = TopoDeviceService.topoDeviceSorterForwardDisplay;
                break;
            case TopoDeviceSortCriterion.DISPLAY | 0:
                console.log("in forward DISPLAY sort");
                this.topoDeviceSortCriterion = TopoDeviceService.topoDeviceSorterReverseDisplay;
                break;
            case TopoDeviceSortCriterion.VERSION | 1:
                console.log("in reverse VERSION sort");
                this.topoDeviceSortCriterion = TopoDeviceService.topoDeviceSorterForwardVersion;
                break;
            case TopoDeviceSortCriterion.VERSION | 0:
                console.log("in forward VERSION sort");
                this.topoDeviceSortCriterion = TopoDeviceService.topoDeviceSorterReverseVersion;
                break;
            case TopoDeviceSortCriterion.ADDRESS | 1:
                console.log("in reverse ADDRESS sort");
                this.topoDeviceSortCriterion = TopoDeviceService.topoDeviceSorterReverseAddress;
                break;
            case TopoDeviceSortCriterion.ADDRESS | 0:
                console.log("in forward ADDRESS sort");
                this.topoDeviceSortCriterion = TopoDeviceService.topoDeviceSorterForwardAddress;
                break;
            case TopoDeviceSortCriterion.TYPE | 1:
                console.log("in reverse type sort");
                this.topoDeviceSortCriterion = TopoDeviceService.topoDeviceSorterForwardType;
                break;
            case TopoDeviceSortCriterion.TYPE | 0:
                console.log("in forward type sort");
                this.topoDeviceSortCriterion = TopoDeviceService.topoDeviceSorterReverseType;
                break;
            case TopoDeviceSortCriterion.DISPLAY | 1:
                console.log("in reverse DISPLAY sort");
                this.topoDeviceSortCriterion = TopoDeviceService.topoDeviceSorterForwardDisplay;
                break;
            case TopoDeviceSortCriterion.DISPLAY | 0:
                console.log("in forward DISPLAY sort");
                this.topoDeviceSortCriterion = TopoDeviceService.topoDeviceSorterReverseDisplay;
                break;
            case TopoDeviceSortCriterion.VERSION | 1:
                console.log("in reverse VERSION sort");
                this.topoDeviceSortCriterion = TopoDeviceService.topoDeviceSorterForwardVersion;
                break;
            case TopoDeviceSortCriterion.VERSION | 0:
                console.log("in forward VERSION sort");
                this.topoDeviceSortCriterion = TopoDeviceService.topoDeviceSorterReverseVersion;
                break;
            default:
        }
        // Force a refresh by updating the data source
        this.topoDeviceService.deviceList.set('wakeup', new Device());
        this.cdr.detectChanges();
        this.topoDeviceService.deviceList.delete('wakeup');
    }

    sortIcon(colname: string) {
        if(this.sortReverse == false) {
            return 'upArrow';
        } else {
            return 'downArrow';
        }
    }
}

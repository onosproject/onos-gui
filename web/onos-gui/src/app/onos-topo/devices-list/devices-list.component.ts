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

import {Component, OnDestroy, OnInit} from '@angular/core';
import {
    Device,
} from '../proto/github.com/onosproject/onos-topo/api/device/device_pb';
import {
    FnService, IconService,
    LogService, SortDir, TableAnnots,
} from 'gui2-fw-lib';
import {ActivatedRoute, Router} from '@angular/router';
import * as grpcWeb from 'grpc-web';
import {TopoDeviceService} from '../topodevice.service';
import {ConnectivityService} from '../../connectivity.service';

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

    constructor(
        protected fs: FnService,
        protected log: LogService,
        protected as: ActivatedRoute,
        protected router: Router,
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

    onSort(colname: string) {
        // not yet implemented
    }

    sortIcon(colname: string) {
        // not yet implemented
    }
}

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

import {Component, OnInit} from '@angular/core';
import {OnosTopoDeviceService} from '../proto/onos-topo-device.service';
import {
    Device,
    ListResponse
} from '../proto/github.com/onosproject/onos-topo/api/device/device_pb';
import {
    FnService, IconService,
    LogService, SortDir, TableAnnots,
    TableBaseImpl, TableFilter,
    WebSocketService
} from 'gui2-fw-lib';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'onos-devices-list',
    templateUrl: './devices-list.component.html',
    styleUrls: [
        './devices-list.component.css',
        '../../fw/widget/table.css',
        '../../fw/widget/table.theme.css'
    ]
})
export class DevicesListComponent extends TableBaseImpl implements OnInit {
    selectedChange: Device;

    constructor(
        protected fs: FnService,
        protected log: LogService,
        protected as: ActivatedRoute,
        protected router: Router,
        protected wss: WebSocketService,
        protected is: IconService,
        private onosTopoDeviceService: OnosTopoDeviceService
    ) {
        super(fs, log, wss, 'devices', 'id');

        this.is.loadIconDef('switch');
        this.is.loadIconDef('xClose');

        this.sortParams = {
            firstCol: 'id',
            firstDir: SortDir.asc,
            secondCol: 'version',
            secondDir: SortDir.desc,
        };

        this.tableDataFilter = <TableFilter>{ // This is here until table pipe bug is fixed
            queryStr: '',
            queryBy: 'id', // Default should be $ all fields
        };

        this.annots = <TableAnnots>{
            noRowsMsg: 'No data found'
        };

        console.log('Constructed DevicesListComponent');
    }

    ngOnInit() {
        this.tableData.length = 0;
        this.onosTopoDeviceService.requestListDevices(true, (deviceListItem: ListResponse) => {
            console.debug('List devices response for', deviceListItem.getDevice().getId(), 'received');
            deviceListItem['id'] = deviceListItem.getDevice().getId();
            deviceListItem['version'] = deviceListItem.getDevice().getVersion();
            this.tableData.push(deviceListItem);
        });
    }
}

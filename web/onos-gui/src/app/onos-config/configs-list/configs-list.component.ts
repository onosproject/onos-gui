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

import {Component, OnInit} from '@angular/core';
import {
    FnService, IconService,
    LogService, SortDir, TableAnnots,
    TableBaseImpl, TableFilter,
    WebSocketService
} from 'gui2-fw-lib';
import {ActivatedRoute, Router} from '@angular/router';
import {OnosConfigDiagsService} from '../proto/onos-config-diags.service';
import {Configuration} from '../proto/github.com/onosproject/onos-config/pkg/northbound/diags/diags_pb';

@Component({
    selector: 'onos-configs-list',
    templateUrl: './configs-list.component.html',
    styleUrls: [
        './configs-list.component.css',
        './configs-list.theme.css',
        '../../fw/widget/table.css',
        '../../fw/widget/table.theme.css'
    ]
})
export class ConfigsListComponent extends TableBaseImpl implements OnInit {

    selectedChange: Configuration;  // The complete row - not just the selId

    constructor(
        protected fs: FnService,
        protected log: LogService,
        protected as: ActivatedRoute,
        protected router: Router,
        protected wss: WebSocketService,
        protected is: IconService,
        private diags: OnosConfigDiagsService,
    ) {
        super(fs, log, wss, 'configs', 'name');

        this.sortParams = {
            firstCol: 'devicetype',
            firstDir: SortDir.asc,
            secondCol: 'version',
            secondDir: SortDir.desc,
        };

        this.annots = <TableAnnots>{
            noRowsMsg: 'No data found'
        };

        this.tableDataFilter = <TableFilter>{ // This is here until table pipe bug is fixed
            queryStr: '',
            queryBy: 'name', // Default should be $ all fields
        };

        this.parentSelCb = (event, selId) => {
            console.log('parent sel cb called', this.selId);
            if (this.selId) {
                this.router.navigate(['/config', 'configview', this.selId]);
            }
        };
        console.debug('Constructed ConfigsListComponent');
    }

    ngOnInit() {
        this.tableData.length = 0;
        this.diags.requestConfigurations([], (config: Configuration) => {
            console.debug('Configuration response for', config.getName(), 'received');
            config['name'] = config.getName(); // The key attribute for selection
            config['version'] = config.getVersion(); // Needed to search by version
            config['devicetype'] = config.getDeviceType(); // Needed to search by devicetype
            config['deviceid'] = config.getDeviceId(); // Needed to search by deviceid
            this.tableData.push(config);
        });
    }

    navto(path) {
        console.log('navigate to', path);

    }

    convertDate(str: string): number {
        return Number(str);
    }
}

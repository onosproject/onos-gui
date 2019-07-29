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

import {Component, OnInit, SimpleChanges} from '@angular/core';
import {OnosConfigAdminService} from '../proto/onos-config-admin.service';
import {NetChange} from '../proto/github.com/onosproject/onos-config/pkg/northbound/proto/admin_pb';
import {
    FnService, IconService,
    LogService, SortDir, TableAnnots,
    TableBaseImpl,
    WebSocketService
} from 'gui2-fw-lib';
import {ActivatedRoute, Router} from '@angular/router';

export interface NwChangeEntry {
    configId: string;
    changeId: string;
}

export interface NwChange {
    name: string;
    created: Date;
    user: string;
    configChanges: NwChangeEntry[];
}

@Component({
    selector: 'onos-network-changes',
    templateUrl: './network-changes.component.html',
    styleUrls: [
        './network-changes.component.css',
        './network-changes.theme.css',
        '../../fw/widget/table.css',
        '../../fw/widget/table.theme.css'
    ]
})
export class NetworkChangesComponent extends TableBaseImpl implements OnInit {

    rollbackTip: string = 'Rollback';
    selectedChange: NwChangeEntry;

    constructor(
        protected fs: FnService,
        protected log: LogService,
        protected as: ActivatedRoute,
        protected router: Router,
        protected wss: WebSocketService,
        protected is: IconService,
        private admin: OnosConfigAdminService,
    ) {
        super(fs, log, wss, 'nwchange', 'name');

        this.is.loadIconDef('switch');
        this.is.loadIconDef('xClose');

        this.sortParams = {
            firstCol: 'name',
            firstDir: SortDir.asc,
            secondCol: 'name',
            secondDir: SortDir.desc,
        };

        this.annots = <TableAnnots>{
            noRowsMsg: 'No data found'
        };
        console.debug('Constructed NetworkChangesComponent');
    }

    ngOnInit() {
        this.tableData.length = 0;
        this.admin.requestNetworkChanges((netChange: NetChange) => {
            const changes: NwChangeEntry[] = [];
            const changesAsMap = netChange.getChangesList();
            for (const nc of changesAsMap) {
                changes.push(<NwChangeEntry>{
                    configId: nc.getId(),
                    changeId: nc.getHash(),
                });
            }

            const nwChange = <NwChange>{
                name: netChange.getName(),
                created: <unknown>(netChange.getTime() * 1000),
                user: netChange.getUser(),
                configChanges: changes,
            };
            console.debug('NetworkChange response for', netChange.getName(), 'received');
            this.tableData.push(nwChange);
        });
    }

    navto(path) {
        this.log.debug('navigate');
        if (this.selId) {
            this.router.navigate([path], {queryParams: {devId: this.selId}});
        }
    }

    rollback() {
        console.warn('Rollback for network change not yet implemented');
    }

}

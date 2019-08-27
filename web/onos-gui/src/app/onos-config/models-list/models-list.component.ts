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
import {ModelService} from '../model.service';
import {
    FnService, IconService,
    LogService, SortDir, TableAnnots,
    TableBaseImpl, TableFilter,
    WebSocketService
} from 'gui2-fw-lib';
import {ActivatedRoute, Router} from '@angular/router';
import {ModelInfo} from '../proto/github.com/onosproject/onos-config/pkg/northbound/admin/admin_pb';
import {NameInputResult} from '../../utils/name-input/name-input.component';
import {PendingNetChangeService} from '../pending-net-change.service';

@Component({
    selector: 'onos-models-list',
    templateUrl: './models-list.component.html',
    styleUrls: [
        './models-list.component.css',
        './models-list.theme.css',
        '../../fw/widget/table.css',
        '../../fw/widget/table.theme.css'
    ]
})
export class ModelsListComponent extends TableBaseImpl implements OnInit {
    selectedChange: ModelInfo; // The complete row - not just the selId
    alertMsg: string;
    newConfigTitle: string = '';

    constructor(
        protected fs: FnService,
        protected log: LogService,
        protected as: ActivatedRoute,
        protected router: Router,
        protected wss: WebSocketService,
        protected is: IconService,
        public modelService: ModelService,
        public pending: PendingNetChangeService,
    ) {
        super(fs, log, wss, 'models', 'id');
        this.is.loadIconDef('plus');
        this.is.loadIconDef('xClose');

        this.sortParams = {
            firstCol: 'name',
            firstDir: SortDir.asc,
            secondCol: 'version',
            secondDir: SortDir.desc,
        };

        this.tableDataFilter = <TableFilter>{ // This is here until table pipe bug is fixed
            queryStr: '',
            queryBy: 'name', // Default should be $ all fields
        };

        this.annots = <TableAnnots>{
            noRowsMsg: 'No data found'
        };

        console.log('Constructed ModelListComponent');
    }

    ngOnInit() {
        this.selId = undefined;
        this.tableData = this.modelService.modelInfoList;
    }

    newConfig(modelInfo: ModelInfo) {
        if (this.selId !== undefined && this.pending.hasPendingChange && this.pending.pendingNewConfiguration === undefined) {
            this.newConfigTitle = 'Name for new ' + modelInfo.getName() + modelInfo.getVersion() + ' config?';
        }
    }

    newConfigCreate(chosen: NameInputResult): void {
        if (chosen.chosen === true) {
            const configName = this.pending.addNewConfig(chosen.name, this.selectedChange.getVersion(), this.selectedChange.getName());
            if (configName) {
                this.router.navigate(['/config', 'configview', configName]);
            }
        }
        this.newConfigTitle = '';
    }

}

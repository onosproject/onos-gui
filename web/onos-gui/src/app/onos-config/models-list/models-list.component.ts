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

import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModelService, ModelSortCriterion } from '../model.service';
import {
    FnService, IconService,
    LogService, NameInputResult, SortDir, TableAnnots,
    TableBaseImpl, TableFilter,
    WebSocketService
} from 'gui2-fw-lib';
import { ActivatedRoute, Router } from '@angular/router';
import { ModelInfo } from '../proto/github.com/onosproject/onos-config/api/admin/admin_pb';
import { ConnectivityService } from '../../connectivity.service';
import * as grpcWeb from 'grpc-web';
import { OrderPipe } from 'ngx-order-pipe';

@Component({
    selector: 'onos-models-list',
    templateUrl: './models-list.component.html',
    styleUrls: [
        './models-list.component.css',
        './models-list.theme.css',
        '../../fw/widget/table.css',
        '../../fw/widget/table.theme.css'
    ],
    // providers: [OrderPipe]
})
export class ModelsListComponent extends TableBaseImpl implements OnInit, OnDestroy {
    selectedChange: ModelInfo; // The complete row - not just the selId
    alertMsg: string;
    newConfigTitle: string = '';
    sortDirMap = new Map([
        ['name', 'upArrow'],
        ['version', 'upArrow'],
        ['module', 'upArrow'],
        ['numrwpaths', 'upArrow'],
        ['numropaths', 'upArrow'],
        ['numyangs', 'upArrow'],
    ]);

    constructor(
        protected fs: FnService,
        protected log: LogService,
        protected as: ActivatedRoute,
        protected router: Router,
        protected wss: WebSocketService,
        protected is: IconService,
        public modelService: ModelService,
        private orderPipe: OrderPipe,
        private cdr: ChangeDetectorRef,
        private connectivityService: ConnectivityService
        // public pending: PendingNetChangeService,
    ) {
        super(fs, log, wss, 'models', 'id');
        this.is.loadIconDef('plus');
        this.is.loadIconDef('xClose');


        this.sortParams = {
            firstCol: 'name',
            firstDir: SortDir.asc,
            secondCol: 'id',
            secondDir: SortDir.desc,
        };

        this.tableDataFilter = <TableFilter>{
            queryStr: '',
            queryBy: 'name',
        };

        this.annots = <TableAnnots>{
            noRowsMsg: 'No data found'
        };

        console.log('Constructed ModelListComponent');
    }

    ngOnInit() {
        this.connectivityService.hideVeil();
        this.selId = undefined;
        this.tableData = this.modelService.modelInfoList;
        this.modelService.loadModelList((err: grpcWeb.Error) => {
            this.connectivityService.showVeil([
                'Model list service gRPC error', String(err.code), err.message,
                'Please ensure onos-config is reachable',
                'Choose a different application from the menu']);
        });
    }

    ngOnDestroy(): void {
        this.modelService.close();
    }

    newConfig(modelInfo: ModelInfo) {
        // if (this.selId !== undefined && this.pending.hasPendingChange && this.pending.pendingNewConfiguration === undefined) {
        //     this.newConfigTitle = 'Name for new ' + modelInfo.getName() + modelInfo.getVersion() + ' config?';
        // }
    }

    newConfigCreate(chosen: NameInputResult): void {
        if (chosen.chosen === true) {
            // const configName = this.pending.addNewConfig(chosen.name, this.selectedChange.getVersion(), this.selectedChange.getName());
            // if (configName) {
            //     this.router.navigate(['/config', 'configview', configName]);
            // }
        }
        this.newConfigTitle = '';
    }

    onSortCol(colName: string): void {
        const oldDir = this.sortDirMap.get(colName) === 'upArrow' ? 0 : 1;
        const newDir = this.sortDirMap.get(colName) === 'upArrow' ? 'downArrow' : 'upArrow';
        this.sortDirMap.set(colName, newDir);
        switch (colName) {
            case 'name':
                this.modelService.switchSortCol(ModelSortCriterion.NAME, oldDir);
                break;
            case 'version':
                this.modelService.switchSortCol(ModelSortCriterion.VERSION, oldDir);
                break;
            case 'module':
                this.modelService.switchSortCol(ModelSortCriterion.MODULE, oldDir);
                break;
            case 'numrwpaths':
                this.modelService.switchSortCol(ModelSortCriterion.NUMRWPATHS, oldDir);
                break;
            case 'numropaths':
                this.modelService.switchSortCol(ModelSortCriterion.NUMROPATHS, oldDir);
                break;
            case 'numyangs':
                this.modelService.switchSortCol(ModelSortCriterion.NUMYANGS, oldDir);
                break;
            default:
        }
    }



    sortIcon(colName: string): string {
        return this.sortDirMap.get(colName);
        // if (this.sortParams.firstCol === column) {
        //     if (this.sortParams.firstDir === SortDir.asc) {
        //         return 'upArrow';
        //     } else {
        //         return 'downArrow';
        //     }
        // } else {
        //     return '';
        // }
    }
}

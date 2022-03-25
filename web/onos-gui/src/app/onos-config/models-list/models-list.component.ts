/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModelService } from '../model.service';
import {
    FnService, IconService,
    LogService, NameInputResult, TableAnnots,
    TableBaseImpl, TableFilter,
    WebSocketService
} from 'gui2-fw-lib';
import { ActivatedRoute, Router } from '@angular/router';
import { ModelInfo } from '../../onos-api/onos/config/admin/admin_pb';
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
})
export class ModelsListComponent extends TableBaseImpl implements OnInit, OnDestroy {
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
        private orderPipe: OrderPipe,
        private connectivityService: ConnectivityService
        // public pending: PendingNetChangeService,
    ) {
        super(fs, log, wss, 'models', 'id');
        this.is.loadIconDef('plus');
        this.is.loadIconDef('xClose');

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
        if (this.modelService.sortParams.firstColName === colName) {
            this.modelService.switchSortCol(colName.toLowerCase(), this.modelService.sortParams.firstCriteriaDir);
        } else {
            this.modelService.switchSortCol(colName.toLowerCase(), 1);
        }
        this.sortIcon(colName);
    }


    sortIcon(colName: string): string {
        if (colName === this.modelService.sortParams.firstColName) {
            if (this.modelService.sortParams.firstCriteriaDir === 0) {
                return 'downArrow';
            } else {
                return 'upArrow';
            }
        }
    }
}

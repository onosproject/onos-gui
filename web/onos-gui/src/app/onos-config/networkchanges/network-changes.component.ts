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
import {OnosConfigAdminService} from '../proto/onos-config-admin.service';
import {
    ConfigChange,
    NetChange,
    RollbackResponse
} from '../proto/github.com/onosproject/onos-config/pkg/northbound/admin/admin_pb';
import {
    FnService, IconService,
    LogService, SortDir, TableAnnots,
    TableBaseImpl, TableFilter,
    WebSocketService
} from 'gui2-fw-lib';
import {ActivatedRoute, Router} from '@angular/router';
import {PendingNetChangeService} from '../pending-net-change.service';
import {PENDING_U} from '../pending-net-change.service';
import {NameInputResult} from '../../utils/name-input/name-input.component';
import {OnosConfigGnmiService} from '../proto/onos-config-gnmi.service';
import * as grpcWeb from 'grpc-web';
import {SetResponse} from '../proto/github.com/openconfig/gnmi/proto/gnmi/gnmi_pb';

/**
 * Display the network changes from the onos-config server. This view is not
 * updated dynamically at present because the underlying gRPC service does
 * not have a watch option.
 */
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
    selectedChange: NetChange; // The complete row - not just the selId
    newNwchangeTitle: string = '';
    alertMsg: string;
    confirmMessage: string = '';
    titleMessage: string = '';
    warnMessage: string = '';
    pendingChange: NetChange;
    lastNwChange: string = undefined; // Only the last can be rolled back

    // Constants - have to declare a viable to hold a constant so it can be used in HTML (?!?!)
    public PENDING_U = PENDING_U;

    constructor(
        protected fs: FnService,
        protected log: LogService,
        protected as: ActivatedRoute,
        protected router: Router,
        protected wss: WebSocketService,
        protected is: IconService,
        private admin: OnosConfigAdminService,
        private gnmi: OnosConfigGnmiService,
        public pending: PendingNetChangeService,
    ) {
        super(fs, log, wss, 'nwchange', 'name');

        this.is.loadIconDef('switch');
        this.is.loadIconDef('xClose');

        this.sortParams = {
            firstCol: 'name',
            firstDir: SortDir.asc,
            secondCol: 'user',
            secondDir: SortDir.desc,
        };

        this.tableDataFilter = <TableFilter>{ // This is here until table pipe bug is fixed
            queryStr: '',
            queryBy: 'name', // Default should be $ all fields
        };

        this.annots = <TableAnnots>{
            noRowsMsg: 'No data found'
        };
        console.debug('Constructed NetworkChangesComponent');
    }

    ngOnInit() {
        this.selId = undefined;
        this.updateTable();
    }

    updateTable() {
        this.tableData.length = 0;
        this.admin.requestNetworkChanges((netChange: NetChange) => {
            console.debug('NetworkChange response for', netChange.getName(), 'received');
            netChange['name'] = netChange.getName();
            netChange['user'] = netChange.getUser();
            netChange['created'] = (new Date()).setTime(netChange.getTime().getSeconds() * 1000);
            netChange['changesList'] = netChange.getChangesList();
            this.tableData.push(netChange);
            this.lastNwChange = netChange.getName();
        });
        if (this.pending.hasPendingChange) {
            this.addPendingRow(this.pending.pendingNetChange.getName(), this.pending.pendingNetChange.getChangesList());
        }
    }

    addPendingRow(name: string, changesList: Array<ConfigChange>) {
        this.pendingChange = <NetChange>{};
        this.pendingChange['name'] = name;
        this.pendingChange['pending'] = true;
        this.pendingChange['user'] = 'onos';
        this.pendingChange['created'] = (new Date());
        this.pendingChange['changesList'] = changesList;
    }

    navto(path) {
        this.log.debug('navigate to', path);
        if (this.selId) {
            this.router.navigate([path], {queryParams: {devId: this.selId}});
        }
    }

    rollbackConfirm() {
        if (this.pending.hasPendingChange || this.selId !== this.lastNwChange) {
            return;
        }
        const numChanges = this.selectedChange.getChangesList().length;
        this.titleMessage = 'Rollback network change?';
        this.confirmMessage = 'Affects ' + numChanges + ' configuration(s)';
        this.warnMessage = 'Rollback ' + this.selId + '?';
    }

    rollback(selected: string): void {
        this.admin.requestRollback(selected, (e: grpcWeb.Error, r: RollbackResponse) => {
            if (e) {
                console.warn('Error on admin RequestRollback for', selected, e);
                return false;
            }
            console.warn('Rolled back network change', selected, r.getMessage());
            this.selId = undefined;
            this.selectedChange = undefined;
            this.updateTable();
        });
    }

    createPending(selected: string): void {
        if (this.pending.hasPendingChange) {
            return;
        }
        this.newNwchangeTitle = 'Name for new Network Change?';
    }

    discardPending(): void {
        this.pending.deletePendingChange();
        this.selId = undefined;
        this.pendingChange = undefined;
    }

    newNwchangeCreate(chosen: NameInputResult): void {
        if (chosen.chosen && chosen.name === '') {
            console.log('Empty name when creating network change rejected!');
        } else if (chosen.chosen === true && !this.pending.hasPendingChange) {
            console.log('New nwChange created:', chosen.name);
            this.pending.addPendingChange(chosen.name);
            this.addPendingRow(chosen.name, Array(0));
            this.alertMsg = 'New PENDING Network Changes layer \"' + chosen.name + '\" created';
        }
        this.newNwchangeTitle = '';
    }

    discardPendingConfirm() {
        if (!this.pending.hasPendingChange) {
            return;
        }
        const numConfigs = this.pending.pendingNetChange.getChangesList().length;

        this.titleMessage = 'Discard pending change?';
        if (numConfigs > 0) {
            this.confirmMessage = 'Discard changes to ' + numConfigs +
                ' configuration(s) on ' + this.pending.pendingNetChange.getName() + '?';
        } else {
            this.confirmMessage = this.pending.pendingNetChange.getName() + ' is empty';
        }
    }

    commitPendingConfirm() {
        if (!this.pending.hasPendingChange || this.selId !== this.pending.pendingNetChange.getName()) {
            return;
        }
        const numConfigs = this.pending.pendingNetChange.getChangesList().length;
        if (numConfigs === 0) {
            this.alertMsg = 'Not committing pending network change "' +
                this.pending.pendingNetChange.getName() +
                '". No changes present';
            return;
        }
        this.titleMessage = 'Commit pending change?';
        this.confirmMessage = 'Affects ' + numConfigs + ' configuration(s)';
        this.warnMessage = 'Commit ' + this.pending.pendingNetChange.getName() + '?';
    }

    handleConfirm(choice: boolean) {
        const title = this.titleMessage;
        this.titleMessage = '';
        this.confirmMessage = '';
        this.warnMessage = '';
        if (!choice) {
            return;
        }
        if (title.startsWith('Commit')) {
            this.commitPending();
        } else if (title.startsWith('Discard')) {
            this.discardPending();
        } else if (title.startsWith('Rollback')) {
            this.rollback(this.selId);
        }
    }

    commitPending(): boolean {
        const numConfigs = this.pending.pendingNetChange.getChangesList().length;
        if (numConfigs > 0) {
            const updates = this.pending.generateUpdates();
            console.log('Committing network change', this.pending.pendingNetChange.getName(),
                'to server for', numConfigs, 'configurations. Configs:', this.pending.pendingConfigValues.size,
                'Updates:', updates.length);
            this.gnmi.requestPushConfigToServer(updates, this.pending.pendingNetChange.getName(), (e: grpcWeb.Error, r: SetResponse) => {
                if (e) {
                    console.warn('Error on gnmi SetRequest', e);
                    return false;
                }
                console.log('gNMI set sent to onos-config', r.getMessage());
                this.pending.deletePendingChange();
                this.updateTable();
            });
            return true;
        }
        console.log('Not committing pending network change', this.pending.pendingNetChange.getName(),
            'No changes present');
    }

}

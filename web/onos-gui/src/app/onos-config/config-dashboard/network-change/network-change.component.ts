/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DeviceService} from '../../device.service';
import {StatusUtil} from '../../status.util';
import {formatDate, KeyValue} from '@angular/common';
import {NetworkChange} from '../../../onos-api/onos/config/change/network/types_pb';
import {Change} from '../../../onos-api/onos/config/change/device/types_pb';
import {Object as EntityObject} from '../../../onos-api/onos/topo/topo_pb';

@Component({
    selector: '[onos-network-change]',
    templateUrl: './network-change.component.html',
    styleUrls: ['./network-change.component.css', '../../status.styles.css']
})
export class NetworkChangeComponent implements OnInit {
    @Input() networkChange: NetworkChange;
    @Input() deviceSortCriterion: (a: KeyValue<string, EntityObject>, b: KeyValue<string, EntityObject>) => number
        = DeviceService.entitySorterForwardAlpha;
    @Output() dcSelected = new EventEmitter<Change>();
    @Input() canRollback: boolean = false;
    @Output() rollbackSelected = new EventEmitter<boolean>();
    created: number;

    constructor(
        public deviceService: DeviceService
    ) {
    }

    ngOnInit() {
        this.created = (new Date()).setTime(this.networkChange.getCreated().getSeconds() * 1000);
    }

    getChangeByName(name: string, version: string): Change {
        return this.networkChange.getChangesList().find((c) => c.getDeviceId() === name && c.getDeviceVersion() === version);
    }

    getStatusClass(): string[] {
        if (this.networkChange.getStatus() === undefined) {
            return ['undefined'];
        }
        return StatusUtil.statusToStrings(this.networkChange.getStatus());
    }

    getTooltip(): string {
        const created = (new Date()).setTime(this.networkChange.getCreated().getSeconds() * 1000);
        const updated = (new Date()).setTime(this.networkChange.getUpdated().getSeconds() * 1000);

        const tooltip = [
            'Created:' + formatDate(created, 'medium', 'en_US'),
            'Updated:' + formatDate(updated, 'medium', 'en_US'),
            'Status: ' + this.getStatusClass().join(','),
            'Index: ' + this.networkChange.getIndex(),
            'Revision: ' + this.networkChange.getRevision()
        ];

        return tooltip.join('\n');
    }

    itemSelected(nwChangeId: string, deviceId: string, version: string) {
        this.dcSelected.emit(this.getChangeByName(deviceId, version));
    }

    rollbackChange() {
        this.rollbackSelected.emit(true);
    }
}

/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DeviceService} from '../../device.service';
import {KeyValue} from '@angular/common';
import {OnosConfigAdminService} from '../../../onos-api/onos-config-admin.service';
import {Object as EntityObject} from '../../../onos-api/onos/topo/topo_pb';

@Component({
    selector: '[onos-network-snapshot]',
    templateUrl: './network-snapshot.component.html',
    styleUrls: ['./network-snapshot.component.css']
})
export class NetworkSnapshotComponent implements OnInit {
    @Input() deviceSortCriterion: (a: KeyValue<string, EntityObject>, b: KeyValue<string, EntityObject>) => number
        = DeviceService.entitySorterForwardAlpha;
    @Output() dsSelected = new EventEmitter<string>();

    constructor(
        public deviceService: DeviceService,
        public admin: OnosConfigAdminService
    ) {
    }

    ngOnInit() {
    }

    itemSelected(id: string) {
        this.dsSelected.emit(id);
    }
}

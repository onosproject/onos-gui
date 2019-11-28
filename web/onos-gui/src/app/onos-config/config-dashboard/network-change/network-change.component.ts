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

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NetworkChange} from '../../proto/github.com/onosproject/onos-config/api/types/change/network/types_pb';
import {DeviceService} from '../../device.service';
import {Change} from '../../proto/github.com/onosproject/onos-config/api/types/change/device/types_pb';
import {StatusUtil} from '../../status.util';
import {formatDate, KeyValue} from '@angular/common';
import {Device} from '../../../onos-topo/proto/github.com/onosproject/onos-topo/api/device/device_pb';

@Component({
    selector: '[onos-network-change]',
    templateUrl: './network-change.component.html',
    styleUrls: ['./network-change.component.css', '../../status.styles.css']
})
export class NetworkChangeComponent implements OnInit {
    @Input() networkChange: NetworkChange;
    @Input() deviceSortCriterion: (a: KeyValue<string, Device>, b: KeyValue<string, Device>) => number
        = DeviceService.deviceSorterForwardAlpha;
    @Output() dcSelected = new EventEmitter<string>();
    created: number;

    constructor(
        public deviceService: DeviceService
    ) {
    }

    ngOnInit() {
        this.created = (new Date()).setTime(this.networkChange.getCreated().getSeconds() * 1000);
    }

    hasChangeByName(name: string): boolean {
        this.networkChange.getChangesList().forEach((ch: Change) => {
            if (ch.getDeviceId() === name) {
                console.log('Returning true for', name, 'on', this.networkChange.getId());
                return true;
            }
        });
        return false;
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

        return 'Created:' + formatDate(created, 'medium', 'en_US') +
            '\nUpdated:' + formatDate(updated, 'medium', 'en_US') +
            '\nStatus: ' + this.getStatusClass().join(',') +
            '\nIndex: ' + this.networkChange.getIndex() +
            '\nRevision: ' + this.networkChange.getRevision();
    }

    itemSelected(nwChangeId: string, deviceId: string, version: string) {
        this.dcSelected.emit(nwChangeId  + ':' + deviceId + ':' + version);
    }
}

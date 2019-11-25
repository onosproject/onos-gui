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
import {KeyValue} from '@angular/common';
import {OnosConfigDiagsService} from '../proto/onos-config-diags.service';
import {NetworkChange} from '../proto/github.com/onosproject/onos-config/api/types/change/network/types_pb';
import {ListNetworkChangeResponse} from '../proto/github.com/onosproject/onos-config/api/diags/diags_pb';
import {OnosTopoDeviceService} from '../../onos-topo/proto/onos-topo-device.service';
import {DeviceService} from '../device.service';

@Component({
    selector: 'onos-config-dashboard',
    templateUrl: './config-dashboard.component.html',
    styleUrls: ['./config-dashboard.component.css']
})
export class ConfigDashboardComponent implements OnInit {
    networkChanges: Map<string, NetworkChange>;

    constructor(
        private diags: OnosConfigDiagsService,
        private topoDeviceService: OnosTopoDeviceService,
        public deviceService: DeviceService,
    ) {
        this.networkChanges = new Map<string, NetworkChange>();
        console.log('ConfigDashboardComponent constructed');
    }

    ngOnInit() {
        this.deviceService.init(this.topoDeviceService, this.diags);

        this.diags.requestNetworkChanges((nwch: ListNetworkChangeResponse) => {
            const change = nwch.getChange();
            if (this.networkChanges.has(change.getId()) && change.getDeleted()) {
                this.networkChanges.delete(change.getId());
                console.log(change.getId(), 'deleted');
            } else if (!change.getDeleted()) {
                this.networkChanges.set(change.getId(), change);
                console.log(change.getId(), 'updated');
            }
        });
        console.log('ConfigDashboardComponent initialized');
    }

    /*
     * Ensure that the list of network changes are ordered by increasing age
     */
    nwChangeIncreasingAge = (a: KeyValue<string, NetworkChange>, b: KeyValue<string, NetworkChange>): number => {
        return a.value.getCreated() < b.value.getCreated() ? 1 : (a.value.getCreated() > b.value.getCreated() ? -1 : 0);
    }
}

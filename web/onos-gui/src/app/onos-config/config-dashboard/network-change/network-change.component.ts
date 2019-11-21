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

import {Component, Input, OnInit} from '@angular/core';
import {NetworkChange} from '../../proto/github.com/onosproject/onos-config/api/types/change/network/types_pb';
import {DeviceService} from '../../device.service';
import {Change} from '../../proto/github.com/onosproject/onos-config/api/types/change/device/types_pb';

@Component({
    selector: '[onos-network-change]',
    templateUrl: './network-change.component.html',
    styleUrls: ['./network-change.component.css']
})
export class NetworkChangeComponent implements OnInit {
    @Input() networkChange: NetworkChange;
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

}

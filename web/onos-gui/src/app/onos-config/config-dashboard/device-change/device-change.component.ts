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

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DeviceService} from '../../device.service';
import {StatusUtil} from '../../status.util';
import {Change} from '../../proto/github.com/onosproject/onos-config/api/types/change/device/types_pb';
import {Status} from '../../proto/github.com/onosproject/onos-config/api/types/change/types_pb';

@Component({
    selector: '[onos-device-change]',
    templateUrl: './device-change.component.html',
    styleUrls: ['./device-change.component.css', '../../status.styles.css']
})
export class DeviceChangeComponent {
    @Input() deviceChangeId: string;
    @Input() deviceVersion: string;
    @Input() networkChangeId: string;
    @Input() change: Change;
    @Input() state: Status;
    @Output() selected  = new EventEmitter<boolean>();

    constructor(
        public deviceService: DeviceService
    ) {
    }

    public deviceChangeName(): string {
        return this.networkChangeId + ':' + this.deviceChangeId + ':' + this.deviceVersion;
    }

    getStatusClass(): string[] {
        return StatusUtil.statusToStrings(this.state);
    }

    getTooltip(): string[] {
        return [this.deviceChangeName()];
    }
}

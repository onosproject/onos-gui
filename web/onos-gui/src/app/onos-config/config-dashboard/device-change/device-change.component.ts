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
import {
    Phase,
    Reason,
    State
} from '../../proto/github.com/onosproject/onos-config/api/types/change/types_pb';
import {StatusUtil} from '../../status.util';

@Component({
    selector: '[onos-device-change]',
    templateUrl: './device-change.component.html',
    styleUrls: ['./device-change.component.css', '../../status.styles.css']
})
export class DeviceChangeComponent {
    @Input() deviceChangeId: string;
    @Input() deviceVersion: string;
    @Input() networkChangeId: string;
    @Output() selected  = new EventEmitter<boolean>();

    constructor(
        public deviceService: DeviceService
    ) {
    }

    public deviceChangeName(): string {
        return this.networkChangeId + ':' + this.deviceChangeId + ':' + this.deviceVersion;
    }

    getStatusClass(): string[] {
        const deviceChange = this.deviceService.deviceChangeMap.get(this.deviceChangeName());
        if (deviceChange === undefined) {
            return ['undefined'];
        }
        return StatusUtil.statusToStrings(deviceChange.getStatus());
    }

    getTooltip(): string[] {
        const deviceChange = this.deviceService.deviceChangeMap.get(this.deviceChangeName());
        if (deviceChange !== undefined) {
            return StatusUtil.statusToStrings(deviceChange.getStatus());
        }
    }
}

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

import {Component, Input} from '@angular/core';
import {DeviceService} from '../../device.service';
import {
    Phase,
    Reason,
    State
} from '../../proto/github.com/onosproject/onos-config/api/types/change/types_pb';

@Component({
    selector: '[onos-device-change]',
    templateUrl: './device-change.component.html',
    styleUrls: ['./device-change.component.css']
})
export class DeviceChangeComponent {
    @Input() deviceChangeId: string;
    @Input() deviceVersion: string;
    @Input() networkChangeId: string;

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
        let status = '';
        let phase = '';
        let reason = '';

        switch (deviceChange.getStatus().getState()) {
            case State.RUNNING:
                status = 'running';
                break;
            case State.PENDING:
                status = 'pending';
                break;
            case State.COMPLETE:
                status = 'complete';
                break;
            case State.FAILED:
                status = 'failed';
                break;
        }

        switch (deviceChange.getStatus().getPhase()) {
            case Phase.CHANGE:
                phase = 'change';
                break;
            case Phase.ROLLBACK:
                phase = 'rollback';
                break;
        }

        switch (deviceChange.getStatus().getReason()) {
            case Reason.ERROR:
                reason = 'error';
                break;
            case Reason.NONE:
                break;
        }

        return [status, phase, reason];
    }
}

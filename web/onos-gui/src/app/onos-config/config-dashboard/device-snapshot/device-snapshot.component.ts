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

@Component({
    selector: '[onos-device-snapshot]',
    templateUrl: './device-snapshot.component.html',
    styleUrls: ['./device-snapshot.component.css']
})
export class DeviceSnapshotComponent {
    @Input() deviceSnapshotId: string;
    @Input() deviceVersion: string;
    @Input() networkSnapshotId: string;

    constructor(
        public deviceService: DeviceService
    ) {
    }

    public deviceSnapshotName(): string {
        return this.networkSnapshotId + ':' + this.deviceSnapshotId + ':' + this.deviceVersion;
    }
}

/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DeviceService} from '../../device.service';
import {Snapshot} from '../../../onos-api/onos/config/snapshot/device/types_pb';

@Component({
    selector: '[onos-device-snapshot]',
    templateUrl: './device-snapshot.component.html',
    styleUrls: ['./device-snapshot.component.css']
})
export class DeviceSnapshotComponent {
    @Input() deviceSnapshot: Snapshot;
    @Output() selected  = new EventEmitter<boolean>();

    constructor(
        public deviceService: DeviceService
    ) {
    }
}

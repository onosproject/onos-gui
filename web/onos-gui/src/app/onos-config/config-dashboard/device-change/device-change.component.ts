/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DeviceService} from '../../device.service';
import {StatusUtil} from '../../status.util';
import {Change} from '../../../onos-api/onos/config/change/device/types_pb';
import {Status} from '../../../onos-api/onos/config/change/types_pb';

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

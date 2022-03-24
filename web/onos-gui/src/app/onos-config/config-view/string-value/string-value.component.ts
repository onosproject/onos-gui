/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output, SimpleChanges
} from '@angular/core';
import {ReadWritePath} from '../../../onos-api/onos/config/admin/admin_pb';
import {ChangeValueUtil} from '../../change-value.util';
import {TypedValue} from '../../../onos-api/onos/config/change/device/types_pb';

@Component({
    selector: 'onos-string-value',
    templateUrl: './string-value.component.html',
    styleUrls: ['./string-value.component.css']
})
export class StringValueComponent implements OnChanges {
    @Input() valueDetails: TypedValue = undefined;
    @Input() readWritePath: ReadWritePath = undefined;
    @Input() disabled: boolean = true;
    @Output() valueEdited = new EventEmitter<Uint8Array>();
    stringValue: string;
    originalValue: string;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['valueDetails']) {
            const allLines = ChangeValueUtil.transform(this.valueDetails, 0);
            if (allLines.length >= 1) {
                this.originalValue = allLines[0];
                this.stringValue = allLines[0];
            } else {
                this.originalValue = '';
                this.stringValue = '';
            }
        }
    }

    makeChange(newValue: string) {
        const enc = new TextEncoder(); // always utf-8
        this.valueEdited.emit(enc.encode(newValue));
        this.originalValue = newValue;
    }
}

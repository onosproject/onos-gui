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

import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output, SimpleChanges
} from '@angular/core';
import {ReadWritePath} from '../../proto/github.com/onosproject/onos-config/api/admin/admin_pb';
import {ChangeValueUtil} from '../../change-value.util';
import {TypedValue} from '../../proto/github.com/onosproject/onos-config/api/types/change/device/types_pb';

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

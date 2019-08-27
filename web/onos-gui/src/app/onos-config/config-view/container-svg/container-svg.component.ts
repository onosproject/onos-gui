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
    Input, OnChanges,
    Output,
    SimpleChanges
} from '@angular/core';
import {
    ChangeValueType,
    ReadWritePath
} from '../../proto/github.com/onosproject/onos-config/pkg/northbound/admin/admin_pb';

@Component({
    selector: '[onos-container-svg]',
    templateUrl: './container-svg.component.html',
    styleUrls: ['./container-svg.component.css']
})
export class ContainerSvgComponent implements OnChanges {
    @Input() relpath: string;
    @Input() abspath: string;
    @Input() parentpath: string;
    @Input() containerX: number = 0;
    @Input() containerY: number = 0;
    @Input() containerScale: number = 1.0;
    @Input() value: Uint8Array | string;
    @Input() valueType: ChangeValueType;
    @Input() valueTypeOpts: Array<number>;
    @Input() classes: string[] = ['config'];
    @Output() containerEditRequested = new EventEmitter<string>();

    boxHeight: number = 20;
    displayPath: string;
    textEncoder: TextEncoder;

    constructor() {
        this.textEncoder = new TextEncoder();
    }

    // the change name can be changes any time
    ngOnChanges(changes: SimpleChanges) {
        if (changes['relpath']) {
            this.displayPath = this.relpath;
            if (this.relpath.endsWith(']')) {
                const wholeKey = this.relpath.substr(this.relpath.indexOf('['));
                const keyNameList = wholeKey.substr(1, wholeKey.length - 2);
                this.value = this.textEncoder.encode(keyNameList);
                this.valueType = ChangeValueType.LEAFLIST_STRING;
                this.displayPath = this.relpath.substr(0, this.relpath.indexOf('['));
            }
            this.boxHeight = 20 + (this.value === undefined ? 0 : 15);
        }
    }

    requestEdit(abspath: string): void {
        this.containerEditRequested.emit(abspath);
    }
}

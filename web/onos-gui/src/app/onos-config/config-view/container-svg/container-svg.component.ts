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
    ChangeValueType
} from '../../proto/github.com/onosproject/onos-config/pkg/northbound/admin/admin_pb';
import {ChangeValueUtil, ValueDetails} from '../../change-value.util';
import {HierarchyNode} from '../hierarchy-layout.service';

@Component({
    selector: '[onos-container-svg]',
    templateUrl: './container-svg.component.html',
    styleUrls: ['./container-svg.component.css']
})
export class ContainerSvgComponent implements OnChanges {
    @Input() relpath: string;
    @Input() abspath: string;
    @Input() containerX: number = 0;
    @Input() containerY: number = 0;
    @Input() hn: HierarchyNode; // For debugging
    @Input() containerScale: number = 1.0;
    @Input() value: ValueDetails;
    @Input() classes: string[] = ['config'];
    @Output() containerEditRequested = new EventEmitter<string>();

    boxHeight: number = 20;
    displayPath: string;
    textEncoder: TextEncoder;
    strvalue: string[];

    constructor() {
        this.textEncoder = new TextEncoder();
    }

    // the change name can be changes any time
    ngOnChanges(changes: SimpleChanges) {
        if (changes['relpath']) {
            this.displayPath = this.relpath;
            if (this.relpath && this.relpath.endsWith(']')) {
                const wholeKey = this.relpath.substr(this.relpath.indexOf('['));
                const keyNameList = wholeKey.substr(1, wholeKey.length - 2);
                this.value = <ValueDetails>{
                    value: this.textEncoder.encode(keyNameList),
                    valueType: ChangeValueType.LEAFLIST_STRING
                };
                if (this.value) {
                    this.strvalue = ChangeValueUtil.transform(this.value, 15);
                }
                this.displayPath = this.relpath.substr(0, this.relpath.indexOf('['));
            }
            this.boxHeight = 20 + (this.value === undefined ? 0 : 15);
        }
    }

    requestEdit(abspath: string): void {
        if (this.classes.includes('config') || this.classes.includes('rwpaths')) {
            this.containerEditRequested.emit(abspath);
        }
    }
}

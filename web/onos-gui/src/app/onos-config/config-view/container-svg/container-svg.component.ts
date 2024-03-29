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
    Output,
    SimpleChanges
} from '@angular/core';

import {ChangeValueUtil} from '../../change-value.util';
import {HierarchyNode} from '../hierarchy-layout.service';
import {
    TypedValue,
    ValueType
} from '../../../onos-api/onos/config/change/device/types_pb';

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
    @Input() value: TypedValue;
    @Input() removed: boolean = false;
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
                this.value = new TypedValue();
                this.value.setBytes(this.textEncoder.encode(keyNameList));
                this.value.setType(ValueType.LEAFLIST_STRING);
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

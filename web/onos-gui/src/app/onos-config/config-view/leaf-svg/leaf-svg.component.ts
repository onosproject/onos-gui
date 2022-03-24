/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: '[onos-leaf-svg]',
    templateUrl: './leaf-svg.component.html',
    styleUrls: ['./leaf-svg.component.css']
})
export class LeafSvgComponent implements OnInit {
    @Input() leafName: string;
    @Input() value: string;
    @Input() leafX: number = 0;
    @Input() leafY: number = 0;
    @Input() leafScale: number = 1.0;
    @Output() leafEditRequested = new EventEmitter<string>();

    constructor() {
    }

    ngOnInit() {
    }

    requestEdit(leaf: string): void {
        this.leafEditRequested.emit(leaf);
    }
}

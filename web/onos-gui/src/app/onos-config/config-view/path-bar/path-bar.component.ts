/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'onos-path-bar',
    templateUrl: './path-bar.component.html',
    styleUrls: ['./path-bar.component.css']
})
export class PathBarComponent implements OnInit {
    @Input() path: string = undefined;

    constructor() {
    }

    ngOnInit() {
    }

}

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

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: '[onos-container-svg]',
    templateUrl: './container-svg.component.html',
    styleUrls: ['./container-svg.component.css']
})
export class ContainerSvgComponent implements OnInit {
    @Input() path: string;
    @Input() containerX: number = 0;
    @Input() containerY: number = 0;
    @Input() containerScale: number = 1.0;
    @Output() containerEditRequested = new EventEmitter<string>();

    constructor() {
    }

    ngOnInit() {
    }

    requestEdit(container: string): void {
        this.containerEditRequested.emit(container);
    }
}

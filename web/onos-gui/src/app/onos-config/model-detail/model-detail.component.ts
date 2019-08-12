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
    Input,
    OnChanges,
    OnInit,
    SimpleChanges
} from '@angular/core';
import {
    DetailsPanelBaseImpl, FnService,
    IconService,
    LogService,
    WebSocketService
} from 'gui2-fw-lib';
import {ModelInfo} from '../proto/github.com/onosproject/onos-config/pkg/northbound/admin/admin_pb';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
    selector: 'onos-model-detail',
    templateUrl: './model-detail.component.html',
    styleUrls: [
        './model-detail.component.css',
        '../../fw/widget/panel.css',
        '../../fw/widget/panel-theme.css'
    ],
    animations: [
        trigger('modelDetailState', [
            state('true', style({
                transform: 'translateX(-100%)',
                opacity: '100'
            })),
            state('false', style({
                transform: 'translateX(0%)',
                opacity: '0'
            })),
            transition('0 => 1', animate('100ms ease-in')),
            transition('1 => 0', animate('100ms ease-out'))
        ])
    ]
})
export class ModelDetailComponent extends DetailsPanelBaseImpl implements OnInit, OnChanges {
    @Input() id: string; // Has to be repeated from base class
    // Output closeEvent is inherited
    @Input() modelInfo: ModelInfo;

    constructor(
        protected fs: FnService,
        protected log: LogService,
        protected wss: WebSocketService,
        protected is: IconService,
    ) {
        super(fs, log, wss, 'model');
    }

    ngOnInit() {
        this.init();
        console.debug('Model Detail Component initialized:', this.id);
    }

    // the config name can be changes any time
    ngOnChanges(changes: SimpleChanges) {
        if (changes['id']) {
            this.detailsData = this.modelInfo;
        }
    }
}

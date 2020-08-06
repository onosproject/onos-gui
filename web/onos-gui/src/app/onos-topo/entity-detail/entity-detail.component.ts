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
    DetailsPanelBaseImpl,
    FnService, IconService,
    LogService,
    WebSocketService
} from 'gui2-fw-lib';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Object } from '../proto/github.com/onosproject/onos-topo/api/topo/topo_pb';

@Component({
    selector: 'onos-entity-detail',
    templateUrl: './entity-detail.component.html',
    styleUrls: [
        './entity-detail.component.css',
        '../../fw/widget/panel.css',
        '../../fw/widget/panel-theme.css'
    ],
    animations: [
        trigger('entityDetailState', [
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
export class EntityDetailComponent extends DetailsPanelBaseImpl implements OnInit, OnChanges {
    @Input() id: string; // Has to be repeated from base class
    // Output closeEvent is inherited
    @Input() entity: Object;
    displayname: string;

    constructor(
        protected fs: FnService,
        protected log: LogService,
        protected wss: WebSocketService,
        protected is: IconService,
    ) {
        super(fs, log, wss, 'entity');
    }

    ngOnInit() {
        this.init();
        console.debug('entity Detail Component initialized:', this.id);
    }

    // the config name can be changed any time
    ngOnChanges(changes: SimpleChanges) {
        if (changes['id']) {
            this.detailsData = this.entity;
            if (this.id === '' || this.id === undefined) {
                this.closed = false;
            }
            if (this.detailsData !== undefined) {
                const attributes = JSON.parse(JSON.stringify(this.detailsData?.getAttributesMap()));
                const attributes_map = JSON.parse(JSON.stringify(attributes['map_']));
                this.displayname = attributes_map['displayname'].value;
            }
        }
    }

    hasId(): string {
        if (this.detailsData !== undefined) {
            if (this.detailsData?.getId() !== undefined && this.displayname !== undefined) {
                return this.displayname;
            } else {
                return this.detailsData?.getId();
            }
        }
        return '';
    }

    displayId(): string {
        if (this.detailsData !== undefined) {
            if (this.displayname === undefined) {
                return this.detailsData?.getId();
            } else {
                return '';
            }
         }
        return '';
    }
}


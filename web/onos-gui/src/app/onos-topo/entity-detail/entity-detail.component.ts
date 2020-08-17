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
    SimpleChanges,
    Output,
    EventEmitter
} from '@angular/core';
import {
    DetailsPanelBaseImpl,
    FnService, IconService,
    LogService,
    WebSocketService
} from 'gui2-fw-lib';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Object } from '../proto/github.com/onosproject/onos-topo/api/topo/topo_pb';
import * as grpcWeb from 'grpc-web';
import { TopoDeviceService } from '../topodevice.service';
import { ConnectivityService } from 'src/app/connectivity.service';

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
    @Output() selectedEntity = new EventEmitter<string>();

    constructor(
        protected fs: FnService,
        protected log: LogService,
        protected wss: WebSocketService,
        protected is: IconService,
        public topoDeviceService: TopoDeviceService,
        private connectivityService: ConnectivityService
    ) {
        super(fs, log, wss, 'entity');
    }

    ngOnInit() {
        this.init();
        console.debug('entity Detail Component initialized:', this.id);
        this.connectivityService.hideVeil();
        this.topoDeviceService.watchTopoEntity((err: grpcWeb.Error) => {
            this.connectivityService.showVeil([
                'Topo Entity service gRPC error', String(err.code), err.message,
                'Please ensure onos-topo is reachable',
                'Choose a different application from the menu']);
        });
    }

    changeEntity(id: string) {
        this.selectedEntity.emit(id);
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
                if (attributes_map['displayname'] !== undefined) {
                    this.displayname = attributes_map['displayname'].value;
                } else {
                    this.displayname = undefined;
                }
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
            if (this.displayname !== undefined) {
                return this.detailsData?.getId();
            } else {
                return '';
            }
        }
        return '';
    }

    printMapValue(attribute: string): string {
        if (this.detailsData !== undefined) {
            const map = this.detailsData.getAttributesMap();
            if (map !== undefined) {
                const attributes = JSON.parse(JSON.stringify(map));
                const attributes_map = JSON.parse(JSON.stringify(attributes['map_']));
                if (attributes_map[attribute] !== undefined) {
                    return attributes_map[attribute].value;
                }
            }
            return '';
        }
        return '';
    }

}



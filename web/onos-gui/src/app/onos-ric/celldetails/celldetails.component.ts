/*
 * Copyright 2020-present Open Networking Foundation
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
    Component, EventEmitter,
    Input,
    OnChanges,
    OnInit, Output,
    SimpleChanges
} from '@angular/core';
import {OnosGuiRicService} from '../proto/onos-gui-ric.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {
    DetailsPanelBaseImpl,
    FnService, IconService,
    LogService,
    WebSocketService
} from 'gui2-fw-lib';
import {
    ECGI,
    StationInfo,
    StationLinkInfo
} from '../proto/github.com/onosproject/onos-ric/api/nb/c1-interface_pb';

const cellId = 'cellId';

@Component({
    selector: 'onos-celldetails',
    templateUrl: './celldetails.component.html',
    styleUrls: [
        './celldetails.component.css',
        '../../fw/widget/panel.css',
        '../../fw/widget/panel-theme.css'
    ],
    animations: [
        trigger('cellDetailState', [
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
export class CellDetailsComponent extends DetailsPanelBaseImpl implements OnInit, OnChanges {
    @Input() cellId: string;
    @Input() station: StationInfo;
    @Output() selectedEvent = new EventEmitter<ECGI>();
    stationLinkInfo: StationLinkInfo;

    constructor(
        protected fs: FnService,
        protected log: LogService,
        protected wss: WebSocketService,
        protected is: IconService,
        private onosGuiRicService: OnosGuiRicService,
    ) {
        super(fs, log, wss, cellId);
    }

    ngOnInit() {
        this.init();
        console.log('Device Detail Component initialized:', this.id);
    }

    // the cell ID can be changed any time
    ngOnChanges(changes: SimpleChanges) {
        if (changes[cellId]) {
            // this.detailsData = this.device;
            if (this.cellId !== '' && this.cellId !== undefined) {
                this.closed = false;
            } else {
                return;
            }
            console.log('Change detected', this.cellId);
            this.getStationLinks(this.station.getEcgi());
        }
    }

    getStationLinks(ecgi: ECGI) {
        this.onosGuiRicService.requestListStationLinks(ecgi).subscribe(
            (slink: StationLinkInfo) => {
                if (slink.getEcgi().getPlmnid() === ecgi.getPlmnid() && slink.getEcgi().getEcid() === ecgi.getEcid()) {
                    this.stationLinkInfo = slink;
                }
            }
        );
    }

    alternateSelected(ecgi: ECGI) {
        this.selectedEvent.emit(ecgi);
    }
}

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
    FnService,
    IconService,
    LogService, WebSocketService
} from 'gui2-fw-lib';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Configuration} from '../proto/github.com/onosproject/onos-config/pkg/northbound/diags/diags_pb';
import {OnosConfigDiagsService} from '../proto/onos-config-diags.service';
import {PendingNetChangeService} from '../pending-net-change.service';
import {NetChange} from '../proto/github.com/onosproject/onos-config/pkg/northbound/admin/admin_pb';

@Component({
    selector: 'onos-network-change-detail',
    templateUrl: './network-change-detail.component.html',
    styleUrls: [
        './network-change-detail.component.css',
        '../../fw/widget/panel.css',
        '../../fw/widget/panel-theme.css'
    ],
    animations: [
        trigger('nwchangeDetailsState', [
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
export class NetworkChangeDetailComponent extends DetailsPanelBaseImpl implements OnInit, OnChanges {
    @Input() id: string; // Has to be repeated from base class
    // Output closeEvent is inherited
    @Input() nwChangeDetail: NetChange;

    otherConfigs: string[] = [];

    constructor(protected fs: FnService,
                protected log: LogService,
                protected wss: WebSocketService,
                protected is: IconService,
                private diags: OnosConfigDiagsService,
                private pending: PendingNetChangeService,
    ) {
        super(fs, log, wss, 'nwchange');
    }

    ngOnInit() {
        this.init();
        console.debug('Device Details Component initialized:', this.id);
    }

    // the config name can be changes any time
    ngOnChanges(changes: SimpleChanges) {
        if (changes['id']) {
            const id = changes['id'].currentValue;
            this.detailsData = this.nwChangeDetail;
            this.closed = false;
            // Get the list of other configs so they can be added
            this.otherConfigs.length = 0;
            if (id !== undefined && this.nwChangeDetail && this.nwChangeDetail['pending']) {
                this.diags.requestConfigurations([], (config: Configuration) => {
                    const configName = config.getDeviceId() + '-' + config.getVersion();
                    const idx = this.nwChangeDetail['changesList'].findIndex((ch) => ch.getId() === configName);
                    if (idx < 0) {
                        this.otherConfigs.push(configName);
                    }
                    console.log('Configuration response for ', configName, 'received', idx);
                });
            }
        }
    }
}

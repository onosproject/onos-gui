/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
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
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ConfigModel, ConfigModule} from '../../onos-api/onos/configmodel/registry_pb';

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
    @Input() configModel: ConfigModel;

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
            this.closed = false;
            this.detailsData = this.configModel;
        }
    }
}

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
    OnChanges, OnDestroy,
    OnInit, SimpleChange,
    SimpleChanges
} from '@angular/core';
import {OnosConfigDiagsService} from '../proto/onos-config-diags.service';
import {Configuration} from '../proto/github.com/onosproject/onos-config/pkg/northbound/diags/diags_pb';
import {ActivatedRoute} from '@angular/router';
import {IconService} from 'gui2-fw-lib';
import {SelectedLayer} from '../config-layers-panel/config-layers-panel.component';
import {PENDING, PendingNetChangeService} from '../pending-net-change.service';
import {TreeLayoutService} from '../tree-layout.service';

export const OPSTATE = 'opstate';
export const MEDIUM = 'medium';
export const ACTIVE = 'active';
export const INACTIVE = 'inactive';
export const CONFIGNAME = 'configName';

@Component({
    selector: 'onos-config-view',
    templateUrl: './config-view.component.html',
    styleUrls: ['./config-view.component.css'],
    providers: [
        {
            provide: TreeLayoutService,
            useValue: new TreeLayoutService()
        }
    ]
})
export class ConfigViewComponent implements OnInit, OnChanges, OnDestroy {
    @Input() configName: string;
    device: string;
    version: string;
    type: string;
    updated: number = 0;
    changeIds: string[] = [];
    changeIdsVisible = new Map<string, boolean>();
    hasOpStateData: boolean = true;
    create_pending: string = '';
    create_pending_confirm: string = '';

    // Constants - have to declare a viable to hold a constant so it can be used in HTML(?!?!)
    public OPSTATE = OPSTATE;

    constructor(
        private diags: OnosConfigDiagsService,
        private pending: PendingNetChangeService,
        private tree: TreeLayoutService,
        protected ar: ActivatedRoute,
        protected is: IconService,
    ) {
        this.is.loadIconDef('checkMark');
        this.is.loadIconDef('xMark');
        this.is.loadIconDef('plus');
        if (this.hasOpStateData) {
            this.changeIdsVisible.set(OPSTATE, false);
        }
        console.log('Constructed ConfigViewComponent');
    }

    ngOnInit(): void {
        this.ar.params.subscribe(params => {
            const cn: string = params['configName'];
            // this is a temporary hack to change the configName to a device name
            // until the diags.proto can be fixed in onos-config
            const deviceName = cn.substr(0, cn.lastIndexOf('-'));
            console.log('ConfigViewComponent param: configView', cn, deviceName);
            this.configName = deviceName;
            this.ngOnChanges({
                'configName': // Don't replace with constant
                    new SimpleChange({}, this.configName, true)
            });
        });
    }

    ngOnDestroy(): void {
        this.tree.resetAll();
        console.log('ConfigViewComponent destroyed and Tree Service reset');
    }

    // the config name can be changed any time
    ngOnChanges(changes: SimpleChanges) {
        if (changes[CONFIGNAME]) {
            const cfgName = changes[CONFIGNAME].currentValue;
            this.changeIds.length = 0;
            this.diags.requestConfigurations([cfgName], (config: Configuration) => {
                this.device = config.getDeviceId();
                this.version = config.getVersion();
                this.type = config.getDeviceType();
                this.updated = Number(config.getUpdated()) * 1000;
                for (const cid of config.getChangeIdsList()) {
                    this.changeIds.push(cid);
                    this.changeIdsVisible.set(cid, true);
                }
                console.log('Configuration response for ', config, 'received');
            });
            // Because the response above is async, the below happens first
            if (this.pending.hasPendingChange) {
                this.changeIds.push(PENDING);
                this.changeIdsVisible.set(PENDING, true);
            }
        }
    }

    visibilityChanged(event: SelectedLayer) {
        this.changeIdsVisible.set(event.layerName, event.madeVisible);
    }

    activatePendingLayer(configName: string, path: string): void {
        if (!this.pending.hasPendingChange) {
            this.create_pending = 'Network Change';
            this.create_pending_confirm = 'Create a Pending (new) Network Change?';
        } else {
            this.pending.addToPendingChange(this.configName + '-' + this.version, 'new');
        }
    }

    confirmedCreatePending(confirmed: boolean): void {
        if (confirmed) {
            this.pending.addToPendingChange(this.configName + '-' + this.version, 'new');
            this.changeIds.push(PENDING);
            this.changeIdsVisible.set(PENDING, true);
        } else {
            console.log('Create pending cancelled');
        }
        this.create_pending = '';
        this.create_pending_confirm = '';
    }
}

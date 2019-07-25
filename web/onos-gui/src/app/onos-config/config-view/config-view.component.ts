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
    OnInit, SimpleChange,
    SimpleChanges
} from '@angular/core';
import {OnosConfigDiagsService} from '../proto/onos-config-diags.service';
import {Configuration} from '../proto/github.com/onosproject/onos-config/pkg/northbound/proto/diags_pb';
import {ActivatedRoute} from '@angular/router';
import {IconService} from 'gui2-fw-lib';
import {SelectedLayer} from '../config-layers-panel/config-layers-panel.component';

@Component({
    selector: 'onos-config-view',
    templateUrl: './config-view.component.html',
    styleUrls: ['./config-view.component.css']
})
export class ConfigViewComponent implements OnInit, OnChanges {
    @Input() configName: string;
    device: string;
    version: string;
    type: string;
    updated: number = 0;
    changeIds: string[] = [];
    changeIdsVisible: Map<string, boolean>;
    hasStateData: boolean = true;
    hasOpData: boolean;

    constructor(
        private diags: OnosConfigDiagsService,
        protected ar: ActivatedRoute,
        protected is: IconService,
    ) {
        this.is.loadIconDef('checkMark');
        this.is.loadIconDef('xMark');
        this.changeIdsVisible = new Map();
        if (this.hasStateData) {
            this.changeIdsVisible['state'] = false;
        }
        if (this.hasOpData) {
            this.changeIdsVisible['operational'] = false;
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
                'configName':
                    new SimpleChange({}, this.configName, true)
            });
        });
    }

    // the config name can be changes any time
    ngOnChanges(changes: SimpleChanges) {
        if (changes['configName']) {
            const cfgName = changes['configName'].currentValue;
            this.diags.requestConfigurations([cfgName], (config: Configuration) => {
                this.device = config.getDeviceid();
                this.version = config.getVersion();
                this.type = config.getDevicetype();
                this.updated = Number(config.getUpdated()) * 1000;
                this.changeIds.length = 0;
                for (const cid of config.getChangeidsList()) {
                    this.changeIds.push(cid);
                    this.changeIdsVisible[cid] = true;
                }
                console.log('Configuration response for ', config, 'received');
            });
        }
    }

    visibilityChanged(event: SelectedLayer) {
        this.changeIdsVisible[event.layerName] = event.madeVisible;
    }
}

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

import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ACTIVE, SNAPSHOT, INACTIVE, MEDIUM, OPSTATE, RWPATHS} from '../config-view/config-view.component';
import {DeviceChange} from '../proto/github.com/onosproject/onos-config/api/types/change/device/types_pb';
import {LayerType} from '../config-view/layer-svg/layer-svg.component';

export interface SelectedLayer {
    layerName: string;
    layerType: LayerType;
    madeVisible: boolean;
}

@Component({
    selector: 'onos-config-layers-panel',
    templateUrl: './config-layers-panel.component.html',
    styleUrls: ['./config-layers-panel.component.css'],
    animations: [
        trigger('layersPanelState', [
            state('true', style({
                transform: 'translateX(0%)',
            })),
            state('false', style({
                transform: 'translateX(-100%)',
            })),
            transition('0 => 1', animate('100ms ease-in')),
            transition('1 => 0', animate('100ms ease-out'))
        ])
    ]
})
export class ConfigLayersPanelComponent implements OnChanges {
    @Input() layerMap: Map<string, DeviceChange>;
    @Input() on: boolean = true;
    @Input() configName: string; // Must be the same as the constant CONFIGNAME
    @Input() deviceName: string;
    @Input() type: string;
    @Input() version: string;
    @Input() hasOpState: boolean;
    // @Input() hasPending: boolean;
    @Output() visibilityChange = new EventEmitter<SelectedLayer>();

    hiddenLayers: string[] = [];
    toggledOn: boolean = true;

    // Constants - have to declare a variable to hold a constant so it can be used in HTML(?!?!)
    public OPSTATE = OPSTATE;
    public RWPATHS = RWPATHS;
    public SNAPSHOT = SNAPSHOT;
    public MEDIUM = MEDIUM;
    public ACTIVE = ACTIVE;
    public INACTIVE = INACTIVE;

    constructor() {
        this.hiddenLayers.push(RWPATHS);
        this.hiddenLayers.push(OPSTATE);
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log('Change happened in config-layers-panel');
        if (changes['type']) { // It's only when the 'type' is updated that we see the update

        }

        // if (changes['hasPending']) {
        //     this.hiddenLayers.set('pending', changes['hasPending'].currentValue);
        // }
    }

    toggleDisplay(changeId: string, layerType: LayerType) {
        let madeVisible = false;
        if (this.hiddenLayers.includes(changeId)) {
            const layerIdx = this.hiddenLayers.indexOf(changeId);
            this.hiddenLayers.splice(layerIdx, 1);
            madeVisible = true;
        } else {
            this.hiddenLayers.push(changeId);
        }
        this.visibilityChange.emit(<SelectedLayer>{
            layerName: changeId,
            layerType: layerType,
            madeVisible: madeVisible,
        });
    }

    toggleAll(on: boolean) {
        this.toggledOn = on;

        this.layerMap.forEach((dc: DeviceChange, l: string) => {
            if (this.hiddenLayers.includes(l) && on) {
                const layerIdx = this.hiddenLayers.indexOf(l);
                this.hiddenLayers.splice(layerIdx, 1);
            } else if (!this.hiddenLayers.includes(l) && !on) {
                this.hiddenLayers.push(l);
            }
            this.visibilityChange.emit(<SelectedLayer>{
                layerName: l,
                // layerType: LayerType.LAYERTYPE_CONFIG,
                madeVisible: on,
            });
        });
    }

    // formatChangeNameTooltip(hash: string, changeName: ChangeName): string {
    //     const tooltip = Array<String>(1).fill('ID:' + hash);
    //     if (changeName !== undefined) {
    //         tooltip.push('Date:' + changeName.time.toLocaleString());
    //         tooltip.push('Num changes:' + changeName.changes.toString());
    //     }
    //     return tooltip.join('\n');
    // }
}

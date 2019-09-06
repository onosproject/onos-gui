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
import {ACTIVE, CONFIGNAME, INACTIVE, MEDIUM, OPSTATE, RWPATHS} from '../config-view/config-view.component';
import {ChangeName, LayerType} from '../config-view/layer-svg/layer-svg.component';

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
                height: '30px'
            })),
            state('false', style({
                height: '510px'
            })),
            transition('0 => 1', animate('100ms ease-in')),
            transition('1 => 0', animate('100ms ease-out'))
        ])
    ]
})
export class ConfigLayersPanelComponent implements OnChanges {
    @Input() layerList: string[];
    @Input() on: boolean = true;
    @Input() configName: string; // Must be the same as the constant CONFIGNAME
    @Input() deviceName: string;
    @Input() type: string;
    @Input() version: string;
    @Input() updated: Date;
    @Input() hasOpState: boolean;
    @Input() hasPending: boolean;
    @Input() changeNamesCache: Map<string, ChangeName>;
    @Output() visibilityChange = new EventEmitter<SelectedLayer>();

    layerVisibility = new Map<string, boolean>();
    toggledOn: boolean = true;
    rolledUp: boolean = false;

    // Constants - have to declare a viable to hold a constant so it can be used in HTML(?!?!)
    public OPSTATE = OPSTATE;
    public RWPATHS = RWPATHS;
    public MEDIUM = MEDIUM;
    public ACTIVE = ACTIVE;
    public INACTIVE = INACTIVE;

    constructor() {
        this.changeNamesCache = new Map<string, ChangeName>();
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log('Change happened in config-layers-panel');
        if (changes[CONFIGNAME]) {
            this.layerVisibility.clear();
            for (const l of this.layerList) {
                this.layerVisibility.set(l, true);
            }
        }

        if (changes['hasPending']) {
            this.layerVisibility.set('pending', changes['hasPending'].currentValue);
        }
    }

    toggleDisplay(changeId: string, layerType: LayerType) {
        this.layerVisibility.set(changeId, !this.layerVisibility.get(changeId));
        this.visibilityChange.emit(<SelectedLayer>{
            layerName: changeId,
            layerType: layerType,
            madeVisible: this.layerVisibility.get(changeId),
        });
    }

    toggleAll(on: boolean) {
        this.toggledOn = on;
        for (const l of this.layerList) {
            this.layerVisibility.set(l, on);
            this.visibilityChange.emit(<SelectedLayer>{
                layerName: l,
                layerType: LayerType.LAYERTYPE_CONFIG,
                madeVisible: on,
            });
        }
    }

    toggleRollup() {
        this.rolledUp = !this.rolledUp;
    }

    formatChangeNameTooltip(hash: string, changeName: ChangeName): string {
        const tooltip = Array<String>(1).fill('ID:' + hash);
        if (changeName !== undefined) {
            tooltip.push('Date:' + changeName.time.toLocaleString());
            tooltip.push('Num changes:' + changeName.changes.toString());
        }
        return tooltip.join('\n');
    }
}

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
    AfterViewInit,
    Component,
    EventEmitter,
    Input, OnChanges,
    OnDestroy,
    OnInit,
    Output, SimpleChanges
} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

export interface SelectedLayer {
    layerName: string;
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
                opacity: '1.0'
            })),
            state('false', style({
                transform: 'translateX(100%)',
                opacity: '0'
            })),
            transition('0 => 1', animate('100ms ease-in')),
            transition('1 => 0', animate('100ms ease-out'))
        ])
    ]
})
export class ConfigLayersPanelComponent implements OnChanges {
    @Input() layerList: string[];
    @Input() on: boolean = true;
    @Input() configName: string;
    @Input() deviceName: string;
    @Input() type: string;
    @Input() version: string;
    @Input() updated: Date;
    @Input() hasState: boolean;
    @Input() hasOperational: boolean;
    @Output() visibilityChange = new EventEmitter<SelectedLayer>();

    layerVisibility: Map<string, boolean>;
    toggledOn: boolean = true;

    constructor() {
        this.layerVisibility = new Map();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['configName']) {
            this.layerVisibility.clear();
            for (const l of this.layerList) {
                this.layerVisibility[l] = true;
            }
        }
    }

    toggleDisplay(changeId: string) {
        this.layerVisibility[changeId] = !this.layerVisibility[changeId];
        this.visibilityChange.emit(<SelectedLayer>{
            layerName: changeId,
            madeVisible: this.layerVisibility[changeId],
        });
    }

    toggleAll(on: boolean) {
        this.toggledOn = on;
        for (const l of this.layerList) {
            this.layerVisibility[l] = on;
            this.visibilityChange.emit(<SelectedLayer>{
                layerName: l,
                madeVisible: on,
            });
        }
    }
}

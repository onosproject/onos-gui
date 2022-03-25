/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ACTIVE, SNAPSHOT, INACTIVE, MEDIUM, OPSTATE, RWPATHS} from '../config-view/config-view.component';
import {LayerType} from '../config-view/layer-svg/layer-svg.component';
import {formatDate, KeyValue} from '@angular/common';
import {StatusUtil} from '../status.util';
import {DeviceChange} from '../../onos-api/onos/config/change/device/types_pb';

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
    @Input() configName: string; // Must be the same as the constant CONFIGNAME
    @Input() deviceName: string;
    @Input() type: string;
    @Input() version: string;
    @Input() hasOpState: boolean;
    // @Input() hasPending: boolean;
    @Output() visibilityChange = new EventEmitter<SelectedLayer>();

    on: boolean = true;
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

    devChangeDecreasingIndex = (a: KeyValue<string, DeviceChange>, b: KeyValue<string, DeviceChange>): number => {
        return a.value.getIndex() < b.value.getIndex() ? 1 : (a.value.getIndex() > b.value.getIndex() ? -1 : 0);
    }

    getTooltip(change: DeviceChange): string {

        const created = (new Date()).setTime(change.getCreated().getSeconds() * 1000);
        const updated = (new Date()).setTime(change.getUpdated().getSeconds() * 1000);

        const tooltip = [
            'Index: ' + change.getIndex(),
            'Created: ' + formatDate(created, 'medium', 'en_US'),
            'Updated: ' + formatDate(updated, 'medium', 'en_US'),
            'Revision: ' + change.getRevision(),
            'Status: ' + StatusUtil.statusToStrings(change.getStatus()).join(','),
            'NWChange: ' + change.getNetworkChange().getId(),
            '# changes: ' + change.getChange().getValuesList().length
        ];

        return tooltip.join('\n');
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

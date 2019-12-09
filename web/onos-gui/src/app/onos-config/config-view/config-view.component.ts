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
    OnDestroy,
    OnInit,
    SimpleChange,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {OnosConfigDiagsService} from '../proto/onos-config-diags.service';
import {ModelTempIndexService} from './model-temp-index.service';
import {HierarchyLayoutService} from './hierarchy-layout.service';
import {ActivatedRoute} from '@angular/router';
import {IconService, TopoZoomPrefs, ZoomableDirective} from 'gui2-fw-lib';
import {DeviceService} from '../device.service';
import {
    DeviceChange,
    TypedValue
} from '../proto/github.com/onosproject/onos-config/api/types/change/device/types_pb';
import {SelectedLayer} from '../config-layers-panel/config-layers-panel.component';
import {LayerType, PathDetails} from './layer-svg/layer-svg.component';
import {ReadWritePath} from '../proto/github.com/onosproject/onos-config/api/admin/admin_pb';

export const OPSTATE = 'opstate';
export const RWPATHS = 'rwpaths';
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
            provide: ModelTempIndexService,
            useValue: new ModelTempIndexService()
        },
        {
            provide: HierarchyLayoutService,
            useValue: new HierarchyLayoutService()
        }
    ]
})
export class ConfigViewComponent implements OnInit, OnChanges, OnDestroy {
    @Input() configName: string;

    @ViewChild(ZoomableDirective, {static: false}) zoomDirective: ZoomableDirective;

    device: string;
    version: string;
    type: string;
    // changeIds: string[] = [];
    changeIdsVisible: string[] = [];
    rwPathVisible: boolean;
    // pendingVisible: boolean = false;
    opstateVisible = false;
    hasOpStateData: boolean = true;
    // hasPending: boolean = false;
    // pendingUdpateTime: Date;
    create_pending: string = '';
    create_pending_confirm: string = '';
    selectedPath = '/';
    selectedValue: TypedValue = undefined;
    selectedRwPath: ReadWritePath;
    deviceChanges: Map<string, DeviceChange>;

    // Constants - have to declare a variable to hold a constant so it can be used in HTML(?!?!)
    public OPSTATE = OPSTATE;
    public RWPATHS = RWPATHS;

    constructor(
        private diags: OnosConfigDiagsService,
        //     private pending: PendingNetChangeService,
        protected ar: ActivatedRoute,
        protected is: IconService,
        private deviceService: DeviceService,
        private modelTmpIndex: ModelTempIndexService,
        private hierarchy: HierarchyLayoutService
    ) {
        this.is.loadIconDef('checkMark');
        this.is.loadIconDef('xMark');
        this.is.loadIconDef('plus');
        this.deviceChanges = new Map<string, DeviceChange>();
        this.hierarchy.setResizeCallback((h) => {
            const currentZoom = this.zoomDirective.zoomCached.sc;
            const zoomLevel = <TopoZoomPrefs>{sc: 3 / h, tx: 0, ty: 0};
            // Only change the pan location if zoom has changed
            if (currentZoom !== zoomLevel.sc) {
                this.zoomDirective.changeZoomLevel(zoomLevel);
                console.log('resize cb called', h, 'Zooming to', zoomLevel, 'Old level', currentZoom);
            }
        });
        console.log('Constructed ConfigViewComponent');
    }

    ngOnInit(): void {
        this.ar.params.subscribe(params => {
            const cn: string = params['configName'];

            console.log('ConfigViewComponent param: configView', cn);
            this.configName = cn;
            this.ngOnChanges({
                'configName': // Don't replace with constant
                    new SimpleChange({}, cn, true)
            });
        });
        //
        // this.deviceService.deviceChangesObs.subscribe(
        //     value => {
        //         console.log('Sub worked!', value);
        //     },
        //     err => {
        //         console.warn('Sub Error', err);
        //     },
        //     () => console.log('Sub Completed')
        // );
    }

    ngOnDestroy(): void {
        this.modelTmpIndex.clearAll();
        this.hierarchy.clearAll();
        console.log('ConfigViewComponent destroyed and Tree Service reset');
    }

    // the config name can be changed any time
    ngOnChanges(changes: SimpleChanges) {
        if (changes[CONFIGNAME]) {
            const cfgName = changes[CONFIGNAME].currentValue;
            // this.changeIds.length = 0;
            this.changeIdsVisible.length = 0;
            console.log('Configuration view changed to', cfgName);
            const device = this.deviceService.deviceList.get(cfgName);
            if (device === undefined) {
                console.warn('No config', cfgName, 'found');
                return;
            }
            this.device = device.getId();
            this.version = device.getVersion();
            this.type = device.getType();

            // Check to see if this is a pending configuration first
            //         if (this.pending.pendingNewConfiguration && this.pending.pendingNewConfiguration.getName() === cfgName) {
            //             this.device = this.pending.pendingNewConfiguration.getDeviceId();
            //             this.version = this.pending.pendingNewConfiguration.getVersion();
            //             this.type = this.pending.pendingNewConfiguration.getDeviceType();
            //             this.updated = Number(this.pending.pendingNewConfiguration.getUpdated()) * 1000;
            //             for (const cid of this.pending.pendingNewConfiguration.getChangeIdsList()) {
            //                 this.changeIdsVisible.push(cid);
            //             }
            //             return;
            //         }

            this.deviceService.deviceChangeMap.forEach((deviceChange: DeviceChange, dcName: string) => {
                if (dcName.endsWith(cfgName)) {
                    this.deviceChanges.set(dcName, deviceChange);
                    this.changeIdsVisible.push(dcName);
                }
            });

            //         this.hasPending = this.pending
            //             .pendingNetChange
            //             .getChangesList()
            //             .findIndex((cfg) => cfg.getId() === this.configName) > -1;
            //         if (this.hasPending) {
            //             this.changeIdsVisible.push('pending');
            //         }
        }
    }

    visibilityChanged(event: SelectedLayer) {
        if (event.layerType === LayerType.LAYERTYPE_PENDING) {
            //         this.pendingVisible = event.madeVisible;
        } else if (event.layerType === LayerType.LAYERTYPE_OPSTATE) {
            this.opstateVisible = event.madeVisible;
        } else if (event.layerType === LayerType.LAYERTYPE_RWPATHS) {
            this.rwPathVisible = event.madeVisible;

        } else if (event.madeVisible && !this.changeIdsVisible.includes(event.layerName)) {
            this.changeIdsVisible.push(event.layerName);

        } else if (!event.madeVisible && this.changeIdsVisible.includes(event.layerName)) {
            const idx = this.changeIdsVisible.indexOf(event.layerName);
            this.changeIdsVisible.splice(idx, 1);
        }

        //     if (!event.madeVisible) {
        //         let layerName = event.layerName;
        //         if (layerName === 'rwpaths') {
        //             layerName = this.type + this.version;
        //         } else if (layerName === 'opstate') {
        //             layerName = this.device;
        //         }
        //         this.hierarchy.removeLayer(layerName);
        //     }
    }

    pathSelected(pathDetails: PathDetails) {
        this.selectedPath = pathDetails.abspath;
        this.selectedValue = pathDetails.value;
        this.selectedRwPath = pathDetails.readWritePath;
    }

    // activatePendingLayer(configName: string, path: string): void {
    //     this.selectedPath = path;
    //     if (!this.pending.hasPendingChange) {
    //         this.create_pending = 'Network Change';
    //         this.create_pending_confirm = 'Create a Pending (new) Network Change?';
    //     } else {
    //         this.pending.addToPendingChange(this.configName + '-' + this.version, undefined);
    //     }
    // }

    confirmedCreatePending(confirmed: boolean): void {
        if (confirmed) {
            //         this.pending.addToPendingChange(this.configName + '-' + this.version, undefined);
            //         this.changeIdsVisible.push(PENDING);
        } else {
            console.log('Create pending cancelled');
        }
        this.create_pending = '';
        this.create_pending_confirm = '';
    }

    // addToEditedValues(absPath: string, oldValue: ValueDetails, newValue: Uint8Array) {
    //     console.log('Value has been edited', absPath);
    //     const newChangeValue = new ChangeValue();
    //     newChangeValue.setPath(absPath);
    //     newChangeValue.setValue(newValue);
    //     newChangeValue.setValueType(oldValue.valueType);
    //     newChangeValue.setTypeOptsList(oldValue.valueTypeOpts);
    //
    //     const added = this.pending.addToPendingChange(this.configName, newChangeValue);
    //     const now = new Date();
    //     now.setTime(Date.now());
    //     this.pendingUdpateTime = now;
    //     if (added) {
    //         this.visibilityChanged(<SelectedLayer>{
    //             layerName: 'pending',
    //             layerType: LayerType.LAYERTYPE_PENDING,
    //             madeVisible: true,
    //         });
    //         this.hasPending = true;
    //     }
    // }
}

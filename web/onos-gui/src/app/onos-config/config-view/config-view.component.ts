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
import {OnosConfigDiagsService} from '../../onos-api/onos-config-diags.service';
import {ModelTempIndexService} from './model-temp-index.service';
import {HierarchyLayoutService} from './hierarchy-layout.service';
import {ActivatedRoute} from '@angular/router';
import {IconService, TopoZoomPrefs, ZoomableDirective} from 'gui2-fw-lib';
import {ErrorCallback} from '../device.service';
import {
    Change,
    ChangeValue,
    DeviceChange,
    TypedValue
} from '../../onos-api/onos/config/change/device/types_pb';
import {SelectedLayer} from '../config-layers-panel/config-layers-panel.component';
import {
    LayerSvgComponent,
    LayerType,
    PathDetails
} from './layer-svg/layer-svg.component';
import {ReadWritePath} from '../../onos-api/onos/config/admin/admin_pb';
import {Subscription} from 'rxjs';
import {
    ListDeviceChangeResponse,
    OpStateResponse,
    Type
} from '../../onos-api/onos/config/diags/diags_pb';
import * as grpcWeb from 'grpc-web';
import {ConnectivityService} from '../../connectivity.service';
import {ModelService} from '../model.service';
import {OnosConfigAdminService} from '../../onos-api/onos-config-admin.service';
import {Snapshot} from '../../onos-api/onos/config/snapshot/device/types_pb';
import {Phase} from '../../onos-api/onos/config/change/types_pb';

export const OPSTATE = 'opstate';
export const RWPATHS = 'rwpaths';
export const SNAPSHOT = 'snapshot';
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
    @ViewChild('opStateLayer', {static: false}) opStateLayer: LayerSvgComponent;
    @ViewChild('snapshotLayer', {static: false}) snapshotLayer: LayerSvgComponent;

    device: string;
    version: string;
    type: string;
    // changeIds: string[] = [];
    changeIdsVisible: string[] = [];
    rwPathVisible: boolean;
    // pendingVisible: boolean = false;
    opstateVisible = false;
    snapshotVisible = true;
    hasOpStateData: boolean = true;
    // hasPending: boolean = false;
    // pendingUdpateTime: Date;
    create_pending: string = '';
    create_pending_confirm: string = '';
    selectedPath = '/';
    selectedValue: TypedValue = undefined;
    selectedRwPath: ReadWritePath;
    deviceChanges: Map<string, DeviceChange>;
    deviceChangeSub: Subscription;
    opStateSub: Subscription;
    opStateCache: ChangeValue[] = [];
    snapshotSub: Subscription;
    snapshotChangeValues: ChangeValue[] = [];

    // Constants - have to declare a variable to hold a constant so it can be used in HTML(?!?!)
    public OPSTATE = OPSTATE;
    public RWPATHS = RWPATHS;

    constructor(
        private diags: OnosConfigDiagsService,
        private admin: OnosConfigAdminService,
        //     private pending: PendingNetChangeService,
        protected ar: ActivatedRoute,
        protected is: IconService,
        private modelTmpIndex: ModelTempIndexService,
        private hierarchy: HierarchyLayoutService,
        private connectivityService: ConnectivityService,
        private models: ModelService,
    ) {
        this.is.loadIconDef('checkMark');
        this.is.loadIconDef('xMark');
        this.is.loadIconDef('plus');
        this.deviceChanges = new Map<string, DeviceChange>();
        this.hierarchy.setResizeCallback((h) => {
            const currentZoom = this.zoomDirective.zoomCached.sc;
            const zoomLevel = <TopoZoomPrefs>{sc: 3 / h, tx: 20, ty: 0};
            // Only change the pan location if zoom has changed
            if (currentZoom !== zoomLevel.sc) {
                this.zoomDirective.changeZoomLevel(zoomLevel);
                console.log('resize cb called', h, 'Zooming to', zoomLevel, 'Old level', currentZoom);
            }
        });
        console.log('Constructed ConfigViewComponent');
    }

    ngOnInit(): void {
        this.connectivityService.hideVeil();
        this.ar.params.subscribe(params => {
            const cn: string = params['configName'];

            console.log('ConfigViewComponent param: configView', cn);
            this.configName = cn;
            this.ngOnChanges({
                'configName': // Don't replace with constant
                    new SimpleChange({}, cn, true)
            });
        });
        this.models.loadModelList((err: grpcWeb.Error) => {
            this.connectivityService.showVeil([
                'Device Changes gRPC error', String(err.code), err.message,
                'Please ensure onos-config is reachable',
                'Choose a different application from the menu']);
        });
    }

    ngOnDestroy(): void {
        this.modelTmpIndex.clearAll();
        this.hierarchy.clearAll();
        this.deviceChangeSub.unsubscribe();
        this.deviceChanges.clear();
        if (this.opStateSub) {
            this.opStateSub.unsubscribe();
        }
        this.snapshotSub.unsubscribe();
        this.snapshotChangeValues.length = 0;
        this.opStateCache.length = 0;
        this.models.close();
        this.changeIdsVisible.length = 0;
        console.log('ConfigViewComponent destroyed and Tree Service reset');
    }

    // the config name can be changed any time
    ngOnChanges(changes: SimpleChanges) {
        if (changes[CONFIGNAME]) {
            const cfgName: string = changes[CONFIGNAME].currentValue;
            const sepIdx = cfgName.lastIndexOf(':');
            this.device = cfgName.slice(0, sepIdx);
            this.version = cfgName.slice(sepIdx + 1);
            console.log('Configuration view changed to', cfgName, this.device, this.version);
            this.changeIdsVisible.length = 0;
            this.deviceChanges.clear();
            if (this.deviceChangeSub) {
                this.deviceChangeSub.unsubscribe();
            }

            this.watchDeviceChanges(this.device, this.version, (err: grpcWeb.Error) => {
                this.connectivityService.showVeil([
                    'Device Changes gRPC error', String(err.code), err.message,
                    'Please ensure onos-config is reachable',
                    'Choose a different application from the menu']);
            });
            this.watchSnapshot(this.device, this.version, (err: grpcWeb.Error) => {
                this.connectivityService.showVeil([
                    'Snapshot gRPC error', String(err.code), err.message,
                    'Please ensure onos-config is reachable',
                    'Choose a different application from the menu']);
            });
        }
    }

    watchDeviceChanges(deviceId: string, version: string, errCb: ErrorCallback) {
        this.deviceChangeSub = this.diags.requestDeviceChanges(deviceId, version).subscribe(
            (devCh: ListDeviceChangeResponse) => {
                const change = devCh.getChange();
                if (this.deviceChanges.has(change.getId()) && devCh.getType() === Type.REMOVED) {
                    const idx = this.changeIdsVisible.indexOf(change.getId());
                    this.changeIdsVisible.splice(idx, 1);
                    this.hierarchy.removeLayer(change.getId());
                    this.deviceChanges.delete(change.getId());
                    this.hierarchy.recalculate();
                    console.log(change.getId(), 'deleted');
                } else if (devCh.getType() !== Type.REMOVED) {
                    this.deviceChanges.set(change.getId(), change);
                    this.updateHierarchy(change.getId(), change.getChange());
                    this.changeIdsVisible.push(change.getId());
                    this.type = change.getChange().getDeviceType(); // All changes should have same type - take whatever comes
                    console.log('Device Change', change.getId(), 'updated');
                }
            },
            (err: grpcWeb.Error) => {
                errCb(err);
            }
        );
    }

    watchSnapshot(deviceId: string, version: string, errCb: ErrorCallback) {
        this.snapshotSub = this.admin.requestSnapshots(deviceId + ':' + version).subscribe(
            (snapshot: Snapshot) => {
                const oldChanges: ChangeValue[] = [];
                this.snapshotChangeValues.forEach((o) => {
                    oldChanges.push(o);
                });
                this.snapshotChangeValues.length = 0;
                snapshot.getValuesList().forEach((v) => {
                    const changeValue = new ChangeValue();
                    changeValue.setPath(v.getPath());
                    changeValue.setValue(v.getValue());
                    this.hierarchy.ensureNode(v.getPath(), 'snapshot');
                    this.snapshotChangeValues.push(changeValue);
                });
                // Should not have to call this child layer directly, but these changes
                // come too late in the cycle and are not detected by the usual bindings
                this.snapshotLayer.ngOnChanges({
                    'changeValues':
                        new SimpleChange(oldChanges, this.snapshotChangeValues, oldChanges.length === 0)
                });
                console.log('Snapshot for', deviceId, version, 'updated. #Values:', this.snapshotChangeValues.length);
                this.hierarchy.recalculate();
            },
            (err: grpcWeb.Error) => {
                errCb(err);
            }
        );
    }

    /**
     * The hierarchy has to be updated from here because they are used to drive an *ngFor in the layer component
     * Updating hierarchy from inside the Layer component causes the dreaded ExpressionChangedAfterItHasBeenCheckedError
     * @param deviceChangeId the layer ID (aka the device change id)
     * @param change (the change, with paths and values)
     */
    updateHierarchy(deviceChangeId: string, change: Change): void {
        change.getValuesList().forEach((cv) => {
            this.hierarchy.ensureNode(cv.getPath(), deviceChangeId);
            this.hierarchy.recalculate();
        });
    }

    visibilityChanged(event: SelectedLayer) {
        if (event.layerType === LayerType.LAYERTYPE_PENDING) {
            //         this.pendingVisible = event.madeVisible;
        } else if (event.layerType === LayerType.LAYERTYPE_OPSTATE) {
            if (event.madeVisible) {
                this.watchOpState(this.device, (err: grpcWeb.Error) => {
                    this.connectivityService.showVeil([
                        'OpState gRPC error', String(err.code), err.message,
                        'Please ensure onos-config is reachable',
                        'Choose a different application from the menu']);
                });
            } else {
                this.hierarchy.removeLayer(this.device);
                this.hierarchy.recalculate();
                this.stopOpStateSub();
            }
            this.opstateVisible = event.madeVisible;
        } else if (event.layerType === LayerType.LAYERTYPE_SNAPSHOTS) {
            if (event.madeVisible) {
                this.watchSnapshot(this.device, this.version, (err: grpcWeb.Error) => {
                    this.connectivityService.showVeil([
                        'OpState gRPC error', String(err.code), err.message,
                        'Please ensure onos-config is reachable',
                        'Choose a different application from the menu']);
                });
            } else {
                this.hierarchy.removeLayer(SNAPSHOT);
                this.hierarchy.recalculate();
                this.snapshotSub.unsubscribe();
            }
        } else if (event.layerType === LayerType.LAYERTYPE_RWPATHS) {
            const model = this.models.modelInfoList
                .find((m) => m.getName() === this.type && m.getVersion() === this.version);
            if (model && event.madeVisible) {
                model.getReadWritePathList().forEach((rw) => {
                    this.hierarchy.ensureNode(rw.getPath(), this.type + ':' + this.version);
                });
                this.hierarchy.recalculate();
            } else if (!event.madeVisible) {
                this.hierarchy.removeLayer(this.type + ':' + this.version);
                this.hierarchy.recalculate();
            } else {
                console.warn('No model', this.type, this.version, 'found');
            }
            this.rwPathVisible = event.madeVisible;
        } else if (event.madeVisible && !this.changeIdsVisible.includes(event.layerName)) {
            // For regular "Network Change" layers
            // Update the hierarchy with newly visible nodes
            this.updateHierarchy(event.layerName, this.deviceChanges.get(event.layerName).getChange());
            this.changeIdsVisible.push(event.layerName);
        } else if (!event.madeVisible && this.changeIdsVisible.includes(event.layerName)) {
            this.hierarchy.removeLayer(event.layerName);
            this.hierarchy.recalculate();
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

    watchOpState(deviceName: string, errCb: ErrorCallback) {
        console.log('Listening to OpState for', deviceName);
        this.opStateSub = this.diags.requestOpStateCache(deviceName, true).subscribe(
            (opState: OpStateResponse) => {
                const p = opState.getPathvalue().getPath();
                const value = new TypedValue(); // Convert from PathValue to TypedValue
                value.setBytes(opState.getPathvalue().getValue().getBytes_asU8());
                value.setType(opState.getPathvalue().getValue().getType());
                value.setTypeOptsList(opState.getPathvalue().getValue().getTypeOptsList());
                const cv = new ChangeValue();
                cv.setPath(p);
                cv.setValue(value);
                cv.setRemoved(false);
                const oldChanges: ChangeValue[] = [];
                this.opStateCache.forEach((o) => {
                    oldChanges.push(o);
                });
                this.opStateCache.push(cv);
                // Should not have to call this child layer directly, but these changes
                // come too late in the cycle and are not detected by the usual bindings
                this.opStateLayer.ngOnChanges({
                    'changeValues':
                        new SimpleChange(oldChanges, this.opStateCache, oldChanges.length === 0)
                });
                this.hierarchy.ensureNode(p, deviceName);
                this.hierarchy.recalculate(); // Has to happen after each response
                console.log('Change response for ', deviceName, 'received', p, this.opStateCache.length);
            },
            (err: grpcWeb.Error) => {
                errCb(err);
            }
        );
    }

    stopOpStateSub() {
        this.opStateSub.unsubscribe();
        this.opStateCache.length = 0;
        console.log('Stopped listening to OpState for', this.device);
    }

    isRolledBack(deviceChange: DeviceChange): boolean {
        if (deviceChange.getStatus().getPhase() === Phase.ROLLBACK) {
            return true;
        }
    }
}

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
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges
} from '@angular/core';
import {OnosConfigDiagsService} from '../../proto/onos-config-diags.service';
import {
    Change,
    ChangeValue,
    ChangeValueType,
    ReadWritePath
} from '../../proto/github.com/onosproject/onos-config/pkg/northbound/admin/admin_pb';
import {OpStateResponse} from '../../proto/github.com/onosproject/onos-config/pkg/northbound/diags/diags_pb';
import {ModelService} from '../../model.service';
import {ValueDetails} from '../../change-value.util';
import {PendingNetChangeService} from '../../pending-net-change.service';
import {ModelTempIndexService} from '../model-temp-index.service';
import {ConfigLink, HierarchyLayoutService} from '../hierarchy-layout.service';
import {PathUtil} from '../../path.util';

export interface ChangeValueObj {
    relPath: string;
    value: ValueDetails;
    removed: boolean;
    parentPath: string;
    rwPath: ReadWritePath;
}

export enum LayerType {
    LAYERTYPE_CONFIG,
    LAYERTYPE_OPSTATE,
    LAYERTYPE_PENDING,
    LAYERTYPE_RWPATHS,
    LAYERTYPE_ROPATHS,
}

const ControlPointX = -40;

export interface PathDetails {
    abspath: string;
    value: ValueDetails;
    readWritePath: ReadWritePath;
}

/**
 * This component is repeated may times in the config view:
 * 1) for each change in the configuration
 * 2) Once for the pending change (if present)
 * 3) Once for the Opstate list
 * 4) Once for the Read Write paths (not yet done)
 * 5) Once for the Read Only Paths (not yet done)
 *
 * The positioning is done through the tree layout service as the items in each
 * layer have to overlay those on the layer below them
 */
@Component({
    selector: '[onos-layer-svg]',
    templateUrl: './layer-svg.component.html',
    styleUrls: ['./layer-svg.component.css']
})
export class LayerSvgComponent implements OnChanges {
    @Input() layerId: string = undefined;
    @Input() layerType: LayerType = LayerType.LAYERTYPE_CONFIG;
    @Input() classes: string[] = ['config'];
    @Input() updated: Date;
    @Output() editRequestedLayer = new EventEmitter<PathDetails>();
    description: string;
    changeTime: number = 0;
    nodelist: Map<string, ChangeValueObj>;
    offset: number = Math.random() * 200;

    constructor(
        private diags: OnosConfigDiagsService,
        private models: ModelService,
        private pending: PendingNetChangeService,
        private modelTempIdx: ModelTempIndexService,
        public hierarchy: HierarchyLayoutService,
    ) {
        this.nodelist = new Map<string, ChangeValueObj>();
        this.updated = new Date(); // now
        console.log('Constructed LayerSvgComponent');
    }

    public reinitialize() {
        this.nodelist.clear();
        const cvRoot = <ChangeValueObj>{
            relPath: '/',
            value: <ValueDetails>{}
        };
        this.nodelist.set('/', cvRoot);
    }

    // the change name can be changes any time
    ngOnChanges(changes: SimpleChanges) {
        if (changes['layerId']) {
            const layerIdNew = changes['layerId'].currentValue;
            this.reinitialize();

            if (this.layerType === LayerType.LAYERTYPE_PENDING && this.pending.pendingConfigValues !== undefined) {
                const pendingChanges = this.pending.pendingConfigValues.get(layerIdNew);
                console.log('Pending changes layer for', layerIdNew, pendingChanges);
                if (pendingChanges && pendingChanges.length > 0) {
                    this.updatePending(pendingChanges, layerIdNew);
                }
            } else if (this.layerType === LayerType.LAYERTYPE_RWPATHS) {
                for (const model of this.models.modelInfoList) {
                    if (model['id'] === layerIdNew) {
                        console.log('Getting RW paths for', layerIdNew);
                        for (const path of model.getReadWritePathList()) {
                            this.addRwPath(path);
                        }
                        this.modelTempIdx.addModelInfo(model);
                        this.modelTempIdx.calculateExtraPaths().forEach((ep) => {
                            this.addRwPath(ep);
                        });
                    }
                }
            } else if (this.layerType === LayerType.LAYERTYPE_ROPATHS) {
                console.log('Display of Read Only Paths not yet supported');
            } else if (this.layerType === LayerType.LAYERTYPE_OPSTATE) {
                console.log('Getting opstate changes from service:', layerIdNew);
                this.diags.requestOpStateCache(layerIdNew, true, (opState: OpStateResponse) => {
                    this.description = 'OpState';
                    this.changeTime = (new Date()).getMilliseconds();
                    const p = opState.getPathvalue().getPath();
                    this.hierarchy.ensureNode(p, layerIdNew);
                    const [parentPath, relPath] = PathUtil.strPathToParentChild(p);
                    const cv = <ChangeValueObj>{
                        relPath: relPath,
                        parentPath: parentPath,
                        value: <ValueDetails>{
                            value: opState.getPathvalue().getValue(),
                            valueType: opState.getPathvalue().getValueType(),
                            valueTypeOpts: opState.getPathvalue().getTypeOptsList(),
                        },
                    };
                    this.nodelist.set(p, cv);

                    this.checkParentExists(p, parentPath);
                    console.log('Change response for ', layerIdNew, 'received', p);
                });
                console.log('Finished with subscribe to OpStateCache on', layerIdNew);
            } else {
                this.diags.requestChanges([layerIdNew], (change: Change) => {
                    // We're only expecting the 1 change as we only asked for 1
                    this.description = change.getDesc();
                    this.changeTime = Number(change.getTime()) * 1000;
                    for (const c of change.getChangeValuesList()) {
                        this.hierarchy.ensureNode(c.getPath(), layerIdNew);
                        const [parentPath, relPath] = PathUtil.strPathToParentChild(c.getPath());
                        const cv = <ChangeValueObj>{
                            relPath: relPath,
                            value: <ValueDetails>{
                                value: c.getValue(),
                                valueType: c.getValueType(),
                                valueTypeOpts: c.getTypeOptsList(),
                            },
                            removed: c.getRemoved(),
                            parentPath: parentPath
                        };
                        this.nodelist.set(c.getPath(), cv);
                        this.checkParentExists(c.getPath(), parentPath);
                        if (c.getPath().indexOf('[') > -1) {
                            this.modelTempIdx.addIndex(c.getPath());
                        }
                    }
                    console.log('Change response for ', layerIdNew, 'received', this.nodelist);
                    // The response from the server can be delayed by any amount
                    // need to update after each one
                    this.hierarchy.recalculate();
                });
            }
        }

        if (changes['updated']) {
            if (this.layerType === LayerType.LAYERTYPE_PENDING && this.pending.pendingConfigValues !== undefined) {
                const pendingChanges = this.pending.pendingConfigValues.get(this.layerId);
                console.log('Pending changes layer for', this.layerId, pendingChanges);
                if (pendingChanges && pendingChanges.length > 0) {
                    this.updatePending(pendingChanges, this.layerId);
                }
            }
        }
        this.hierarchy.recalculate();
    }

    private addRwPath(path: ReadWritePath) {
        this.hierarchy.ensureNode(path.getPath(), this.layerId);
        const [parentPath, relPath] = PathUtil.strPathToParentChild(path.getPath());
        const cv = <ChangeValueObj>{
            relPath: relPath,
            parentPath: parentPath,
            value: <ValueDetails>{
                value: new Uint8Array(),
                valueType: ChangeValueType.EMPTY,
                valueTypeOpts: {},
            },
            rwPath: path
        };
        this.nodelist.set(path.getPath(), cv);
        this.checkParentExists(path.getPath(), parentPath);
    }

    private updatePending(pendingChanges: Array<ChangeValue>, configName: string) {
        console.log('Getting changes Pending from service:', configName);
        for (const c of pendingChanges) {
            console.log('Handling', c.getPath(), 'of', configName);
            this.hierarchy.ensureNode(c.getPath(), this.layerId);
            const [parentPath, relPath] = PathUtil.strPathToParentChild(c.getPath());
            const cv = <ChangeValueObj>{
                relPath: relPath,
                value: <ValueDetails>{
                    value: c.getValue(),
                    valueType: c.getValueType(),
                    valueTypeOpts: c.getTypeOptsList(),
                },
                removed: c.getRemoved(),
                parentPath: parentPath,
            };
            this.nodelist.set(c.getPath(), cv);

            this.checkParentExists(c.getPath(), parentPath);
        }
    }

    // recursive function to add parent to the list with a link if necessary
    // If it was found no need to recurse.
    // Add link from us to parent if necessary
    public checkParentExists(currentPath: string, parentPath: string): boolean {
        if (currentPath === '/') {
            return false;
        }
        const [nextPp, relPath] = PathUtil.strPathToParentChild(parentPath);
        this.nodelist.set(parentPath, <ChangeValueObj>{
            relPath: relPath,
            parentPath: nextPp,
            value: <ValueDetails>{},
        });
        this.checkParentExists(parentPath, nextPp);
        return false;
    }

    requestEditLayer(abspath: string, value: ValueDetails, rwPath?: ReadWritePath): void {
        if (this.layerType === LayerType.LAYERTYPE_OPSTATE ||
            this.layerType === LayerType.LAYERTYPE_ROPATHS
        ) {
            return;
        }
        let valueObj: ValueDetails;
        if (value !== undefined && value.value !== undefined && value.value.length > 0) {
            valueObj = value;
        } else if (rwPath !== undefined) {
            valueObj = <ValueDetails>{
                value: new Uint8Array(),
                valueType: rwPath.getValueType(),
                valueTypeOpts: Array<number>(0), // TODO get number of decimal places from RW path
            };
        } else {
            valueObj = <ValueDetails>{
                value: new Uint8Array(),
                valueType: ChangeValueType.EMPTY,
            };
        }
        this.editRequestedLayer.emit(<PathDetails>{
            abspath: abspath,
            value: valueObj,
            readWritePath: rwPath
        });
        console.log('Selected on layer', this.layerId, abspath, valueObj.valueType);
    }

    // Calculates an SVG path for the branch
    // Start in the middle and draw path to source end with curve (control point is x+ControlPointX)
    // Move back to middle and draw path to target end with curve (control point is x-ControlPointX)
    curveCalculator(link: ConfigLink, child?, parent?: string): string {
        if (link === null) {
            console.log('Warning Link is null for', child, parent);
            return '';
        }
        const halfWayY = (link.target.y + link.source.y + 160) / 2;
        const halfWayX = (link.target.x + 10 + link.source.x + 10) / 2;

        const mm = 'M ' + halfWayY + ' ' + halfWayX;
        const cp1 = 'Q ' + (link.target.y + ControlPointX) + ' ' + (link.target.x + 10);
        const ep1 = (link.target.y) + ' ' + (link.target.x + 10);
        const cp2 = 'Q ' + (link.source.y + 160 - ControlPointX) + ' ' + (link.source.x + 10);
        const ep2 = (link.source.y + 160) + ' ' + (link.source.x + 10);

        return mm + ' ' + cp1 + ', ' + ep1 + ' ' + mm + ' ' + cp2 + ', ' + ep2;
    }
}


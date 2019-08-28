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
    Change, ChangeValue, ChangeValueType, ReadWritePath
} from '../../proto/github.com/onosproject/onos-config/pkg/northbound/admin/admin_pb';
import {
    ConfigLink,
    ConfigLinkType,
    ConfigNode,
    ConfigNodeType,
    TreeLayoutService
} from '../../tree-layout.service';
import {OpStateResponse} from '../../proto/github.com/onosproject/onos-config/pkg/northbound/diags/diags_pb';
import {ModelService} from '../../model.service';
import {ValueDetails} from '../../change-value.util';
import {PendingNetChangeService} from '../../pending-net-change.service';
import {ModelTempIndexService} from '../model-temp-index.service';

export interface ChangeValueObj {
    relPath: string;
    value: Uint8Array | string;
    valueType: ChangeValueType;
    valueTypeOpts: Array<number>;
    removed: boolean;
    parentPath: string;
    node: ConfigNode;
    rwPath: ReadWritePath;
}

export interface Branch {
    parent: string;
    child: string;
    link: ConfigLink;
}

export enum LayerType {
    LAYERTYPE_CONFIG,
    LAYERTYPE_OPSTATE,
    LAYERTYPE_PENDING,
    LAYERTYPE_RWPATHS,
    LAYERTYPE_ROPATHS,
}

const ControlPointX = 40;

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
    @Input() visible: boolean;
    @Input() classes: string[] = ['config'];
    @Input() updated: Date;
    @Output() editRequestedLayer = new EventEmitter<PathDetails>();
    description: string;
    changeTime: number = 0;
    nodelist: Map<string, ChangeValueObj>;
    linkList: Map<string, Branch>;
    offset: number = Math.random() * 200;

    constructor(
        private diags: OnosConfigDiagsService,
        private tree: TreeLayoutService,
        private models: ModelService,
        private pending: PendingNetChangeService,
        private modelTempIdx: ModelTempIndexService,
    ) {
        this.nodelist = new Map<string, ChangeValueObj>();
        this.linkList = new Map<string, Branch>();
        this.updated = new Date(); // now
        console.log('Constructed LayerSvgComponent');
    }

    // Watch out for a slash in an index name
    public decomposePath(p: string): [string, string] {
        let lastSlashIdx = p.lastIndexOf('/');
        const lastSqBrktIdx = p.lastIndexOf(']');
        if (lastSqBrktIdx > lastSlashIdx) {
            lastSlashIdx = p.substr(0, p.lastIndexOf('[')).lastIndexOf('/');
        }
        const parentPath = p.substr(0, lastSlashIdx);
        const relPath = p.substring(lastSlashIdx + 1);
        return [relPath, parentPath];
    }

    public reinitialize() {
        this.nodelist.clear();
        const rootNode = this.addToForceGraph('');
        const cvRoot = <ChangeValueObj>{
            relPath: '/',
            node: rootNode,
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
                console.log('Display of Read Write Paths for', layerIdNew);
                for (const model of this.models.modelInfoList) {
                    if (model['id'] === layerIdNew) {
                        console.log('Getting RW paths for', layerIdNew);

                        for (const path of model.getReadWritePathList()) {
                            this.addRwPath(path);
                        }
                        this.modelTempIdx.addModelInfo(model);
                        this.tree.reinitSimulation();
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
                    const [relPath, parentPath] = this.decomposePath(p);
                    const fgNode = this.addToForceGraph(p);
                    const cv = <ChangeValueObj>{
                        relPath: relPath,
                        parentPath: parentPath,
                        value: opState.getPathvalue().getValue(),
                        valueType: opState.getPathvalue().getValueType(),
                        valueTypeOpts: opState.getPathvalue().getTypeOptsList(),
                        node: fgNode
                    };
                    this.nodelist.set(p, cv);

                    this.checkParentExists(p, parentPath);
                    console.log('Change response for ', layerIdNew, 'received', p);
                    this.tree.reinitSimulation();
                });
                console.log('Finished with subscribe to OpStateCache on', layerIdNew);
            } else {
                this.diags.requestChanges([layerIdNew], (change: Change) => {
                    // We're only expecting the 1 change as we only asked for 1
                    this.description = change.getDesc();
                    this.changeTime = Number(change.getTime()) * 1000;
                    for (const c of change.getChangeValuesList()) {
                        const [relPath, parentPath] = this.decomposePath(c.getPath());
                        const fgNode = this.addToForceGraph(c.getPath());
                        const cv = <ChangeValueObj>{
                            relPath: relPath,
                            value: c.getValue(),
                            valueType: c.getValueType(),
                            valueTypeOpts: c.getTypeOptsList(),
                            removed: c.getRemoved(),
                            parentPath: parentPath,
                            node: fgNode
                        };
                        this.nodelist.set(c.getPath(), cv);

                        this.checkParentExists(c.getPath(), parentPath);

                        if (c.getPath().indexOf('[') > -1) {
                            this.modelTempIdx.addIndex(c.getPath());
                        }
                    }
                    console.log('Change response for ', layerIdNew, 'received', this.nodelist);
                    this.tree.reinitSimulation();
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
        if (changes['visible']) {
            if (changes['visible'].currentValue && this.layerType === LayerType.LAYERTYPE_RWPATHS) {
                this.modelTempIdx.calculateExtraPaths().forEach((ep) => {
                    this.addRwPath(ep);
                });
                this.tree.reinitSimulation();
            }
        }
    }

    private addRwPath(path: ReadWritePath) {
        const [relPath, parentPath] = this.decomposePath(path.getPath());
        const fgnode = this.addToForceGraph(path.getPath());
        const cv = <ChangeValueObj>{
            relPath: relPath,
            parentPath: parentPath,
            value: new Uint8Array(),
            valueType: ChangeValueType.EMPTY,
            valueTypeOpts: {},
            node: fgnode,
            rwPath: path
        };
        this.nodelist.set(path.getPath(), cv);

        this.checkParentExists(path.getPath(), parentPath);
    }

    private updatePending(pendingChanges: Array<ChangeValue>, configName: string) {
        console.log('Getting changes Pending from service:', configName);
        for (const c of pendingChanges) {
            console.log('Handling', c.getPath(), 'of', configName);
            const [relPath, parentPath] = this.decomposePath(c.getPath());
            const fgNode = this.addToForceGraph(c.getPath());
            const cv = <ChangeValueObj>{
                relPath: relPath,
                value: c.getValue(),
                valueType: c.getValueType(),
                valueTypeOpts: c.getTypeOptsList(),
                removed: c.getRemoved(),
                parentPath: parentPath,
                node: fgNode
            };
            this.nodelist.set(c.getPath(), cv);

            this.checkParentExists(c.getPath(), parentPath);
        }
        this.tree.reinitSimulation();
    }

    public addToForceGraph(abspath: string): ConfigNode {
        // Search for node
        for (const n of this.tree.nodes) {
            if (n.id === abspath) {
                return n;
            }
        }
        const newNode = <ConfigNode>{
            id: abspath,
            x: 0,
            y: 0,
            nodeType: ConfigNodeType.CONFIG_LEAF
        };
        this.tree.nodes.push(newNode);
        return newNode;
    }

    // recursive function to add parent to the list with a link if necessary
    // If it was found no need to recurse.
    // Add link from us to parent if necessary
    public checkParentExists(currentPath: string, parentPath: string): boolean {
        if (this.nodelist.get(parentPath) !== undefined || parentPath === '') {
            this.addLink(currentPath);
            return true;
        }
        const [relpath, nextPp] = this.decomposePath(parentPath);
        const fgNode = this.addToForceGraph(parentPath);
        this.nodelist.set(parentPath, <ChangeValueObj>{
            relPath: relpath,
            parentPath: nextPp,
            node: fgNode
        });
        this.addLink(currentPath);
        this.checkParentExists(parentPath, nextPp);
        return false;
    }

    private addLinkToForceGraph(branchId, sourcePath, targetPath: string): ConfigLink {
        // Search for link
        for (const l of this.tree.links) {
            if (l.id === branchId) {
                return l;
            }
        }
        // Else create it
        if (sourcePath === undefined || sourcePath === '') {
            sourcePath = '/';
        }
        const sourceNode = this.nodelist.get(sourcePath).node;
        if (targetPath === undefined || targetPath === '') {
            targetPath = '/';
        }
        const targetNode = this.nodelist.get(targetPath).node;
        const newLink = <ConfigLink>{
            id: branchId,
            source: sourceNode,
            target: targetNode,
            linkType: ConfigLinkType.CONFIG_DIRECT,
        };
        this.tree.links.push(newLink);
        return newLink;
    }

    private addLink(currentPath: string): string {
        const [relpath, parentPath] = this.decomposePath(currentPath);
        const branchId = parentPath + '_' + relpath;
        this.linkList.set(branchId, <Branch>{
            child: currentPath,
            parent: parentPath,
            link: this.addLinkToForceGraph(branchId, currentPath, parentPath),
        });
        return branchId;
    }

    requestEditLayer(abspath: string, value: Uint8Array, valueType: ChangeValueType,
                     valueTypeOpts: Array<number>, rwPath?: ReadWritePath): void {
        if (this.layerType === LayerType.LAYERTYPE_OPSTATE ||
            this.layerType === LayerType.LAYERTYPE_ROPATHS) {
            return;
        }
        let valueObj: ValueDetails;
        if (value !== undefined && value.length > 0) {
            valueObj = <ValueDetails>{
                value: value,
                valueType: valueType,
                valueTypeOpts: valueTypeOpts,
            };
        } else {
            valueObj = <ValueDetails>{
                value: new Uint8Array(),
                valueType: rwPath.getValueType(),
                valueTypeOpts: Array<number>(0), // TODO get number of decimal places from RW path
            };
        }
        this.editRequestedLayer.emit(<PathDetails>{
            abspath: abspath,
            value: valueObj,
            readWritePath: rwPath
        });
        console.log('Edit requested on layer', this.layerId, abspath, valueObj.valueType);
    }

    // Calculates an SVG path for the branch
    // Start in the middle and draw path to source end with curve (control point is x+ControlPointX)
    // Move back to middle and draw path to target end with curve (control point is x-ControlPointX)
    curveCalculator(link: ConfigLink, child?, parent?: string): string {
        if (link === null) {
            console.log('Warning Link is null for', child, parent);
            return '';
        }
        const halfWayX = (link.target.x + 160 + link.source.x) / 2;
        const halfWayY = (link.target.y + 10 + link.source.y + 10) / 2;

        const mm = 'M ' + halfWayX + ' ' + halfWayY;
        const cp1 = 'Q ' + (link.target.x + 160 + ControlPointX) + ' ' + (link.target.y + 10);
        const ep1 = (link.target.x + 160) + ' ' + (link.target.y + 10);
        const cp2 = 'Q ' + (link.source.x - ControlPointX) + ' ' + (link.source.y + 10);
        const ep2 = link.source.x + ' ' + (link.source.y + 10);

        return mm + ' ' + cp1 + ', ' + ep1 + ' ' + mm + ' ' + cp2 + ', ' + ep2;
    }
}


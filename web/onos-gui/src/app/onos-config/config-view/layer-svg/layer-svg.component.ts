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
    ChangeValueType
} from '../../proto/github.com/onosproject/onos-config/pkg/northbound/admin/admin_pb';
import {PENDING} from '../../pending-net-change.service';
import {
    ConfigLink,
    ConfigLinkType,
    ConfigNode,
    ConfigNodeType,
    TreeLayoutService
} from '../../tree-layout.service';

export interface ChangeValueObj {
    relPath: string;
    value: Uint8Array;
    valueType: ChangeValueType;
    removed: boolean;
    parentPath: string;
    node: ConfigNode;
}

export interface Branch {
    parent: string;
    child: string;
    link: ConfigLink;
}

const ControlPointX = 40;

@Component({
    selector: '[onos-layer-svg]',
    templateUrl: './layer-svg.component.html',
    styleUrls: ['./layer-svg.component.css']
})
export class LayerSvgComponent implements OnChanges {
    @Input() layerId: string = '';
    @Input() visible: boolean;
    @Output() editRequestedLayer = new EventEmitter<string>();
    description: string;
    changeTime: number = 0;
    nodelist: Map<string, ChangeValueObj>;
    branchList: Map<string, Branch>;
    offset: number = Math.random() * 200;

    constructor(
        private diags: OnosConfigDiagsService,
        private tree: TreeLayoutService,
    ) {
        this.nodelist = new Map<string, ChangeValueObj>();
        this.branchList = new Map<string, Branch>();
        console.log('Constructed LayerSvgComponent');
    }

    // the change name can be changes any time
    ngOnChanges(changes: SimpleChanges) {
        if (changes['layerId']) {
            const layerIdNew = changes['layerId'].currentValue;
            this.nodelist.clear();
            const cvRoot = <ChangeValueObj>{
                relPath: '',
                node: this.addToForceGraph('')
            };
            this.nodelist.set('', cvRoot);

            if (String(layerIdNew).startsWith(PENDING)) {
                console.log('Getting pending changes from service:', layerIdNew);
            } else {
                this.diags.requestChanges([layerIdNew], (change: Change) => {
                    // We're only expecting the 1 change as we only asked for 1
                    this.description = change.getDesc();
                    this.changeTime = Number(change.getTime()) * 1000;
                    for (const c of change.getChangeValuesList()) {
                        const lastSlashIdx =  c.getPath().lastIndexOf('/');
                        const parentPath = c.getPath().substr(0, lastSlashIdx);
                        const relPath = c.getPath().substring(lastSlashIdx + 1);
                        const cv = <ChangeValueObj>{
                            relPath: relPath,
                            value: c.getValue(),
                            valueType: c.getValueType(),
                            removed: c.getRemoved(),
                            parentPath: parentPath,
                            node: this.addToForceGraph(c.getPath())
                        };
                        this.nodelist.set(c.getPath(), cv);

                        this.checkParent(c.getPath(), parentPath);
                    }
                    console.log('Change response for ', layerIdNew, 'received', this.nodelist);
                    this.tree.reinitSimulation();
                });
            }
        }
    }

    private addToForceGraph(abspath: string): ConfigNode {
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

    private checkParent(currentPath: string, parentPath: string): boolean {
        if (this.nodelist.get(parentPath) !== undefined || parentPath === '') {
            this.addBranch(currentPath, parentPath);
            return true;
        }
        const idx = parentPath.lastIndexOf('/');
        const nextPp = parentPath.substr(0, idx);
        this.nodelist.set(parentPath, <ChangeValueObj>{
            relPath: parentPath.substr(idx + 1),
            parentPath: nextPp,
            node: this.addToForceGraph(parentPath)
        });
        this.addBranch(currentPath, parentPath);
        this.checkParent(parentPath, nextPp);
        return false;
    }

    private addBranchToForceGraph(branchId, sourcePath, targetPath: string): ConfigLink {
        // Search for link
        for (const l of this.tree.links) {
            if (l.id === branchId) {
                return l;
            }
        }
        // Else create it
        const newLink = <ConfigLink>{
            id: branchId,
            source: this.nodelist.get(sourcePath).node,
            target: this.nodelist.get(targetPath).node,
            linkType: ConfigLinkType.CONFIG_DIRECT,
        };
        this.tree.links.push(newLink);
        return newLink;
    }

    private addBranch(currentPath, parentPath: string): string {
        const lastSlashIdx =  currentPath.lastIndexOf('/');
        const branchId = currentPath.substring(lastSlashIdx) + '_' + parentPath;
        this.branchList.set(branchId, <Branch>{
            child: currentPath,
            parent: parentPath,
            link: this.addBranchToForceGraph(branchId, currentPath, parentPath),
        });
        return branchId;
    }

    countParts(path: string): number {
        return path.split('/').length;
    }

    requestEditLayer(path: string, leaf: string, l1: string) {
        this.editRequestedLayer.emit(path + ',' + leaf + ',' + l1);
        console.log('Edit requested on layer', this.layerId, path, leaf, l1);
    }

    // Calculates an SVG path for the branch
    // Start in the middle and draw path to source end with curve (control point is x+ControlPointX)
    // Move back to middle and draw path to target end with curve (control point is x-ControlPointX)
    curveCalculator(link: ConfigLink): string {
        const halfWayX = (link.target.x + 160 + link.source.x) / 2;
        const halfWayY = (link.target.y + 10 + link.source.y + 10) / 2;

        const mm = 'M ' + halfWayX + ' ' + halfWayY;
        const cp1 =  'Q ' + (link.target.x + 160 + ControlPointX) + ' ' + (link.target.y + 10);
        const ep1 = (link.target.x + 160) + ' ' + (link.target.y + 10);
        const cp2 = 'Q ' + (link.source.x - ControlPointX) + ' ' + (link.source.y + 10);
        const ep2 = link.source.x + ' ' + (link.source.y + 10);

        return mm + ' ' + cp1 + ', ' + ep1 + ' ' + mm + ' ' + cp2 + ', ' + ep2;
    }
}


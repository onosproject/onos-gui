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

import {Injectable} from '@angular/core';
import * as d3 from 'd3-hierarchy';
import {PathUtil} from '../path.util';

export interface HierarchyNode {
    id: string;
    absPath: string;
    layerRefs: string[];
    children: Array<HierarchyNode>;
}

// Got from reverse engineering the d3 tree() output - used to ensure type prompting below
export interface TreeLayoutNode {
    data: HierarchyNode;
    height: number;
    width: number;
    x: number;
    y: number;
    children: Array<TreeLayoutNode>;
    parent: HierarchyNode;
    links: () => ConfigLink[];
    descendants: () => Array<TreeLayoutNode>;
}

export interface ConfigNode {
    id: string;
    data: HierarchyNode;
    x: number;
    y: number;
}

export interface ConfigLink {
    id: string;
    source: ConfigNode;
    target: ConfigNode;
}

/**
 * This represents a hierarchy of nodes from across all layers.
 *
 * Each layer view adds its nodes to this
 */
@Injectable()
export class HierarchyLayoutService {

    root: HierarchyNode;
    treeLayout: TreeLayoutNode;
    emptyRoot: HierarchyNode;

    /**
     * Set up the root node
     */
    constructor() {
        this.emptyRoot = <HierarchyNode>{id: '/', children: Array<HierarchyNode>(0),
            absPath: '/', layerRefs: Array<String>(0)};
        this.root = this.emptyRoot;
    }

    /**
     * Should be called by ConfigViewComponent onDestroy(). The service will still
     * exist, but needs to be cleaned for the next component.
     */
    clearAll() {
        this.root = <HierarchyNode>{id: '/', children: Array<HierarchyNode>(0),
            absPath: '/', layerRefs: Array<String>(0)};
        this.treeLayout = null;
    }

    /**
     * A layer should call this after it has finished adding nodes
     *
     * TODO refine this so the whole thing does not have to be rebuilt
     */
    recalculate() {
        const hierarchyRoot = d3.hierarchy(this.root);
        hierarchyRoot.dx = 60;
        hierarchyRoot.dy = 240;
        this.treeLayout = d3.tree().nodeSize([hierarchyRoot.dx, hierarchyRoot.dy])(hierarchyRoot);
        return this.treeLayout;
    }

    /**
     * Each layer should call this for every leaf or container to ensure they
     * and all of their parent nodes are added to the hierarchy.
     * @param abspath The absolute path of the node e.g. /a/b[n=*]/c/d
     * @param layer the layer that this is referring to this node
     */
    ensureNode(abspath: string, layer: string): HierarchyNode {
        const parts = ['/'];
        parts.push(...PathUtil.strPathToParts(abspath));
        if (!this.root.layerRefs.includes(layer)) {
            this.root.layerRefs.push(layer);
        }

        return this.ensureChildren(parts, this.root, '', layer);
    }

    /**
     * Recursive method to look through the hierarchy for a specific named node
     * If the node doesn't exist then create it and add it to the hierarchy
     * @param pathParts an ordered array of string parts e.g. ['/','a','b[n=*']','c','d']
     * @param node the parent node
     * @param parent the absolute path of the parent
     * @layer the layer that this is referring to this node
     */
    private ensureChildren(pathParts: string[], node: HierarchyNode, parent: string, layer: string): HierarchyNode {
        const current = pathParts[0];
        if (node.id !== current) {
            console.error('Mismatch', node.id, current);
            return null;
        }
        if (pathParts.length === 1) {
            return null;
        }
        const next = pathParts[1];
        let newParent: string;
        if (parent === '' || parent === '/') {
            newParent = parent + pathParts[0];
        } else {
            newParent = parent + '/' + pathParts[0];
        }

        for (const child of node.children) {
            if (child.id === next) {
                if (!child.layerRefs.includes(layer)) {
                    child.layerRefs.push(layer);
                }
                return this.ensureChildren(pathParts.slice(1), child, newParent, layer);
            }
        }
        // If it got to here - then it wasn't found - create it
        const newNode = <HierarchyNode>{
            id: next,
            children: Array<HierarchyNode>(0),
            absPath: newParent + (newParent === '/' ? '' : '/') + next,
            layerRefs: Array<String>(1).fill(layer)
        };
        node.children.push(newNode);
        if (pathParts.length > 2) {
            return this.ensureChildren(pathParts.slice(1), newNode, newParent, layer);
        }
        return newNode;
    }

    /**
     * Remove all nodes that belong only to this given layer
     * @param layer the name of a layer
     */
    removeLayer(layer: string): void {
        const updatedRoot = this.removeChildWithOnlyLayer(layer, this.root);
        if (updatedRoot !== null) {
            this.root = updatedRoot;
        } else {
            this.root = this.emptyRoot;
        }
        // Then do the calculation again
        this.recalculate();
    }

    /**
     * Recursive function to remove child nodes that only belong to the given layer
     * @param layer the layer to search for
     * @param node the node to recurse on
     */
    private removeChildWithOnlyLayer(layer: string, node: HierarchyNode): HierarchyNode {
        if (node.layerRefs.length === 1 && node.layerRefs.includes(layer)) {
            return null;
        }
        if (node.layerRefs.includes(layer)) {
            const i = node.layerRefs.indexOf(layer);
            node.layerRefs.splice(i, 1);
        }

        const n1 = <HierarchyNode>{
            absPath: node.absPath,
            layerRefs: node.layerRefs,
            id: node.id,
            children: Array<HierarchyNode>(0)
        };
        for (const child of node.children) {
            const n1c = this.removeChildWithOnlyLayer(layer, child);
            if (n1c) {
                n1.children.push(n1c);
            }
        }
        return n1;
    }
}

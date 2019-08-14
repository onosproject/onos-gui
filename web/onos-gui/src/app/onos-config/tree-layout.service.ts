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

import {EventEmitter, Inject, Injectable} from '@angular/core';
import * as d3 from 'd3-force';

const CHARGES = {
    container: -600,
    leaf: -800,
    list: -600,
    _def_: -1000
};

const LINK_DISTANCE = {
    // note: key is link.type
    direct: 100,
    _def_: 50,
};

/**
 * note: key is link.type
 * range: {0.0 ... 1.0}
 */
const LINK_STRENGTH = {
    _def_: 0.5
};

export interface Options {
    width: number;
    height: number;
    column: number;
}

const SVGCANVAS = <Options>{
    width: 1000,
    height: 1000,
    column: 600
};

export enum ConfigNodeType {
    CONFIG_CONTAINER = 'container',
    CONFIG_LIST = 'list',
    CONFIG_LEAF = 'leaf',
}

export enum ConfigLinkType {
    CONFIG_DIRECT = 'direct',
}

export interface ConfigNode {
    id: string;
    nodeType: ConfigNodeType;
    x: number;
    y: number;
}

export interface ConfigLink {
    id: string;
    linkType: ConfigLinkType;
    source: ConfigNode;
    target: ConfigNode;
}

/**
 * TreeLayoutService acts a as a common layout engine of all of the layers in
 * the onos-config view.
 *
 * The inspiration for this approach is from gui-topo-lib ForceDirectedGraph and
 * originally comes from
 * https://medium.com/netscape/visualizing-data-with-angular-and-d3-209dde784aeb
 *
 * Do yourself a favour and read https://d3indepth.com/force-layout/
 */
@Injectable()
export class TreeLayoutService {
    public ticker: EventEmitter<d3.Simulation<ConfigNode, ConfigLink>> = new EventEmitter();
    public simulation: d3.Simulation<any, any>;
    public canvasOptions: Options;
    public nodes: ConfigNode[];
    public links: ConfigLink[];

    constructor(
        @Inject('COLLISION') private COLLISION: number = 1,
        @Inject('GRAVITY') private GRAVITY: number = 0.4,
        @Inject('FRICTION') private FRICTION: number = 0.7
    ) {
        this.nodes = [];
        this.links = [];
        this.canvasOptions = SVGCANVAS;
        const ticker = this.ticker;

        // Creating the force simulation and defining the charges
        this.simulation = d3.forceSimulation()
            .force('charge',
                d3.forceManyBody().strength(this.charges.bind(this)))
            // .distanceMin(100).distanceMax(500))
            .force('gravity',
                d3.forceManyBody().strength(GRAVITY))
            .force('friction',
                d3.forceManyBody().strength(FRICTION))
            .force('center',
                d3.forceCenter(this.canvasOptions.width / 2, this.canvasOptions.height / 2))
            .force('x', d3.forceX().x((d) => this.offsetX(d)))
            .force('y', d3.forceY())
            .on('tick', () => {
                ticker.emit(this.simulation); // ForceSvgComponent.ngOnInit listens
            });


        console.log('TreeLayoutService constructed');
    }

    private offsetX(node: ConfigNode): number {
        const column  = node.id.split('/').length - 1;
        return column * this.canvasOptions.column;
    }

    /**
     * Assigning updated node and restarting the simulation
     * Setting alpha to 0.3 and it will count down to alphaTarget=0
     */
    public reinitSimulation() {
        this.simulation.nodes(this.nodes);
        this.simulation.force('link',
            d3.forceLink(this.links)
                .strength(LINK_STRENGTH._def_)
                .distance(this.distance.bind(this))
        );
        this.simulation.alpha(0.3).restart();
    }

    charges(node: ConfigNode) {
        const nodeType = node.nodeType;
        return CHARGES[nodeType] || CHARGES._def_;
    }

    distance(link: ConfigLink) {
        const linkType = link.linkType;
        return LINK_DISTANCE[linkType] || LINK_DISTANCE._def_;
    }

    stopSimulation() {
        this.simulation.stop();
        console.debug('Simulation stopped');
    }

    public restartSimulation(alpha: number = 0.3) {
        this.simulation.alpha(alpha).restart();
        console.debug('Simulation restarted. Alpha:', alpha);
    }

    public resetAll() {
        this.nodes.length = 0;
        this.links.length = 0;
    }
}

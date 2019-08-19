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
    Directive,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges, Output
} from '@angular/core';
import * as d3 from 'd3';
import {LogService} from 'gui2-fw-lib';
import {ConfigNode, TreeLayoutService} from '../../tree-layout.service';

export interface GridPosition {
    x: number;
    y: number;
}

@Directive({
  selector: '[onosDraggableContainer]'
})
export class DraggableDirective implements OnChanges {
    @Input() draggableNode: ConfigNode;
    @Output() newLocation = new EventEmitter<GridPosition>();

    constructor(
        private _element: ElementRef,
        private log: LogService,
        private layout: TreeLayoutService
    ) {
        this.log.debug('DraggableDirective constructed');
    }

    ngOnChanges() {
        this.applyDraggableBehaviour(
            this._element.nativeElement,
            this.draggableNode,
            this.layout,
            this.newLocation);
    }

    /**
     * A method to bind a draggable behaviour to an svg element
     */
    applyDraggableBehaviour(element, node: ConfigNode, graph: TreeLayoutService, newLocation: EventEmitter<GridPosition>) {
        const d3element = d3.select(element);

        function started() {
            /** Preventing propagation of dragstart to parent elements */
            d3.event.sourceEvent.stopPropagation();

            if (!d3.event.active) {
                graph.simulation.alphaTarget(0.3).restart();
            }

            d3.event.on('drag', () => dragged()).on('end', () => ended());

            function dragged() {
                node.fx = d3.event.x;
                node.fy = d3.event.y;
            }

            function ended() {
                if (!d3.event.active) {
                    graph.simulation.alphaTarget(0);
                }
                newLocation.emit(<GridPosition>{x: node.fx, y: node.fy});
            }
        }

        d3element.call(d3.drag()
            .on('start', started));
    }
}

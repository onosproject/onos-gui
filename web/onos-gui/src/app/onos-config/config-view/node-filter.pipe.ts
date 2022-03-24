/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Pipe, PipeTransform } from '@angular/core';
import {TreeLayoutNode} from './hierarchy-layout.service';

/**
 * A pipe used to filter out of the complete set of calculated nodes only the
 * ones useful to this layer.
 */
@Pipe({
    name: 'nodeFilter'
})
export class NodeFilterPipe implements PipeTransform {

    transform(nodes: TreeLayoutNode[], layerId: string): TreeLayoutNode[] {
        if (nodes === undefined || nodes === null || nodes.length === 0) {
            return undefined;
        }
        const returnedNodes = Array<TreeLayoutNode>(0);
        nodes.forEach((n) => {
            if (n.data.layerRefs.includes(layerId)) {
                returnedNodes.push(n);
            }
        });

        return returnedNodes;
    }
}

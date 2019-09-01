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
        if (nodes === undefined || nodes.length === 0) {
            return null;
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

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

import {LinkFilterPipe} from './link-filter.pipe';
import {
    ConfigLink,
    ConfigNode,
    HierarchyNode
} from './hierarchy-layout.service';

describe('LinkFilterPipe', () => {
    it('create an instance', () => {
        const pipe = new LinkFilterPipe();
        expect(pipe).toBeTruthy();
    });

    /**
     * We're looking only for the links that are present on Layer 'l2'
     * First we build up 4 nodes and assign them to 2 links
     * 3 of the nodes are on layer l2, nodes t1, t3, t4
     * But only the 2nd link has a source and a target BOTH on 'l2' and so this
     * is the only link returned by the filter
     */
    it('should filter out links not on this layer', () => {
        const link1 = <ConfigLink>{
            source: <ConfigNode>{
                id: 't1',
                data: <HierarchyNode>{
                    id: 't1',
                    absPath: '/a/b/t1',
                    layerRefs: ['l1', 'l2']
                }
            },
            target: <ConfigNode>{
                id: 't2',
                data: <HierarchyNode>{
                    id: 't2',
                    absPath: '/a/b/t2',
                    layerRefs: ['l1']
                }
            }
        };

        const link2 = <ConfigLink>{
            source: <ConfigNode>{
                id: 't3',
                data: <HierarchyNode>{
                    id: 't3',
                    absPath: '/a/b/t3',
                    layerRefs: ['l2', 'l1']
                }
            },
            target: <ConfigNode>{
                id: 't4',
                data: <HierarchyNode>{
                    id: 't4',
                    absPath: '/a/b/t4',
                    layerRefs: ['l3', 'l2', 'l1']
                }
            }
        };

        const pipe = new LinkFilterPipe();
        const filteredLayers = pipe.transform([link1, link2], 'l2');
        expect(filteredLayers.length).toEqual(1);
        expect(filteredLayers[0].source).toBeTruthy();
        expect(filteredLayers[0].source.id).toEqual('t3');
        expect(filteredLayers[0].target).toBeTruthy();
        expect(filteredLayers[0].target.id).toEqual('t4');
    });
});

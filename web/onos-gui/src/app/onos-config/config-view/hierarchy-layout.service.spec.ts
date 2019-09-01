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

import {TestBed} from '@angular/core/testing';

import {HierarchyLayoutService} from './hierarchy-layout.service';

describe('HierarchyLayoutService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        providers: [
            {
                provide: HierarchyLayoutService,
                useClass: HierarchyLayoutService
            }
        ]
    }));

    it('should be created', () => {
        const service: HierarchyLayoutService = TestBed.get(HierarchyLayoutService);
        expect(service).toBeTruthy();
    });

    it('should find root', () => {
        const service: HierarchyLayoutService = TestBed.get(HierarchyLayoutService);

        const nodeC1 = service.ensureNode('/a/b/c1', 'l1');
        expect(nodeC1).toBeTruthy();
        expect(nodeC1.id).toEqual('c1');
        expect(nodeC1.absPath).toEqual('/a/b/c1');
        expect(nodeC1.children.length).toEqual(0);

        const nodeC2 = service.ensureNode('/a/b/c2', 'l2');
        expect(nodeC2).toBeTruthy();
        expect(nodeC2.id).toEqual('c2');
        expect(nodeC2.absPath).toEqual('/a/b/c2');
        expect(nodeC2.children.length).toEqual(0);

        const nodeD1 = service.ensureNode('/a/b/c2/d1', 'l2');
        expect(nodeD1).toBeTruthy();
        expect(nodeD1.id).toEqual('d1');
        expect(nodeD1.absPath).toEqual('/a/b/c2/d1');
        expect(nodeD1.children.length).toEqual(0);

        const rootNode = service.recalculate();
        expect(rootNode).toBeTruthy();

        expect(service.treeLayout.descendants()).toBeTruthy();
        expect(service.treeLayout.descendants().length).toEqual(6);

        const node_slash = service.treeLayout.descendants().find((d) => d.data.absPath === '/');
        expect(node_slash).toBeTruthy();
        expect(node_slash.x).toEqual(0);
        expect(node_slash.y).toEqual(0);
        expect(node_slash.data.layerRefs).toEqual(['l1', 'l2']);

        const node_a = service.treeLayout.descendants().find((d) => d.data.absPath === '/a');
        expect(node_a).toBeTruthy();
        expect(node_a.x).toEqual(0);
        expect(node_a.y).toEqual(240);
        expect(node_a.data.layerRefs).toEqual(['l1', 'l2']);

        const node_a_b = service.treeLayout.descendants().find((d) => d.data.absPath === '/a/b');
        expect(node_a_b.data.layerRefs).toEqual(['l1', 'l2']);

        const node_a_b_c1 = service.treeLayout.descendants().find((d) => d.data.absPath === '/a/b/c1');
        expect(node_a_b_c1.data.layerRefs).toEqual(['l1']);
        const node_a_b_c2 = service.treeLayout.descendants().find((d) => d.data.absPath === '/a/b/c2');
        expect(node_a_b_c2.data.layerRefs).toEqual(['l2']);

        service.removeLayer('l1');
        expect(service.treeLayout.descendants().find((d) => d.data.absPath === '/a/b/c1')).toBeFalsy();

        expect(service.treeLayout.descendants().find((d) => d.data.absPath === '/a/b/c2').data.layerRefs).toEqual(['l2']);
        expect(service.treeLayout.descendants().find((d) => d.data.absPath === '/a/b').data.layerRefs).toEqual(['l2']);
    });
});

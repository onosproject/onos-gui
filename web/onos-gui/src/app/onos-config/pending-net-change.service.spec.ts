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

import {PendingNetChangeService} from './pending-net-change.service';

describe('PendingNetChangeService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        providers: [
            {
                provide: PendingNetChangeService,
                useClass: PendingNetChangeService
            }
        ],
    }));

    it('should be created', () => {
        const service: PendingNetChangeService = TestBed.get(PendingNetChangeService);
        expect(service).toBeTruthy();
    });

    it('should convert path with no imdex', () => {
        const service: PendingNetChangeService = TestBed.get(PendingNetChangeService);
        const parts = service.strPathToParts('/a/b/c/d/e');

        expect(parts.length).toEqual(5);
        expect(parts).toEqual(['a', 'b', 'c', 'd', 'e']);
    });

    it('should convert path with 1 index', () => {
        const service: PendingNetChangeService = TestBed.get(PendingNetChangeService);
        const parts = service.strPathToParts('/a/b[name=foo]/c/d/e');

        expect(parts.length).toEqual(5);
        expect(parts).toEqual(['a', 'b[name=foo]', 'c', 'd', 'e']);
    });

    it('should convert path with 1 index slash', () => {
        const service: PendingNetChangeService = TestBed.get(PendingNetChangeService);
        const parts = service.strPathToParts('/a/b[name=1/0]/c/d/e');

        expect(parts.length).toEqual(5);
        expect(parts).toEqual(['a', 'b[name=1/0]', 'c', 'd', 'e']);
    });

    it('should convert path with 2 indices', () => {
        const service: PendingNetChangeService = TestBed.get(PendingNetChangeService);
        const parts = service.strPathToParts('/a/b[name=foo]/c/d/e[idx=bar]');

        expect(parts.length).toEqual(5);
        expect(parts).toEqual(['a', 'b[name=foo]', 'c', 'd', 'e[idx=bar]']);
    });


    it('should create gnmiPath', () => {
        const service: PendingNetChangeService = TestBed.get(PendingNetChangeService);
        const gnmiPaths = service.toGnmiPathElems(['a', 'b', 'c', 'd', 'e']);

        expect(gnmiPaths.length).toEqual(5);
        expect(gnmiPaths[0].getName()).toEqual('a');
        expect(gnmiPaths[1].getName()).toEqual('b');
        expect(gnmiPaths[2].getName()).toEqual('c');
        expect(gnmiPaths[3].getName()).toEqual('d');
        expect(gnmiPaths[4].getName()).toEqual('e');
    });

    it('should create gnmiPath with 2 indices', () => {
        const service: PendingNetChangeService = TestBed.get(PendingNetChangeService);
        const gnmiPaths = service.toGnmiPathElems(['a', 'b[name=1/0]', 'c', 'd', 'e[facility=1,severity=2]']);

        expect(gnmiPaths.length).toEqual(5);
        expect(gnmiPaths[0].getName()).toEqual('a');

        expect(gnmiPaths[1].getName()).toEqual('b');
        expect(gnmiPaths[1].getKeyMap()).toBeDefined();
        expect(gnmiPaths[1].getKeyMap()['map_']).toBeDefined();
        expect(gnmiPaths[1].getKeyMap()['map_']['name']).toBeDefined();
        expect(gnmiPaths[1].getKeyMap()['map_']['name']['key']).toEqual('name');
        expect(gnmiPaths[1].getKeyMap()['map_']['name']['value']).toEqual('1/0');

        expect(gnmiPaths[2].getName()).toEqual('c');

        expect(gnmiPaths[3].getName()).toEqual('d');

        expect(gnmiPaths[4].getName()).toEqual('e');
        expect(gnmiPaths[4].getKeyMap()).toBeDefined();
        expect(gnmiPaths[4].getKeyMap()['map_']).toBeDefined();
        expect(gnmiPaths[4].getKeyMap()['map_']['facility']).toBeDefined();
        expect(gnmiPaths[4].getKeyMap()['map_']['facility']['key']).toEqual('facility');
        expect(gnmiPaths[4].getKeyMap()['map_']['facility']['value']).toEqual('1');
        expect(gnmiPaths[4].getKeyMap()['map_']['severity']).toBeDefined();
        expect(gnmiPaths[4].getKeyMap()['map_']['severity']['key']).toEqual('severity');
        expect(gnmiPaths[4].getKeyMap()['map_']['severity']['value']).toEqual('2');

        // console.log('KeyMap', Object.keys(gnmiPaths[4].getKeyMap()));
        // for (const k of Object.keys(gnmiPaths[4].getKeyMap())) {
        //     console.log('item', k, gnmiPaths[4].getKeyMap()[k]);
        // }
    });

});

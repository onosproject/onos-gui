/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
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

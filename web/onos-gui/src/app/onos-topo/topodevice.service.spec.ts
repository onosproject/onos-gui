/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {TestBed} from '@angular/core/testing';

import {TopoEntityService} from './topo-entity.service';

describe('TopoDeviceService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: TopoEntityService = TestBed.inject(TopoEntityService);
        expect(service).toBeTruthy();
    });
});

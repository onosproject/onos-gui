/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {TestBed} from '@angular/core/testing';

import {OnosTopoEntityService} from './onos-topo-entity.service';

describe('OnosTopoDeviceService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: OnosTopoEntityService = TestBed.inject(OnosTopoEntityService);
        expect(service).toBeTruthy();
    });
});

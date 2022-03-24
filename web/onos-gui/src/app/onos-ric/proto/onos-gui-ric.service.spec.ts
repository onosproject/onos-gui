/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {TestBed} from '@angular/core/testing';

import {OnosRicC1Service} from './onos-ric-c1.service';

describe('OnosRicC1Service', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        const service: OnosRicC1Service = TestBed.inject(OnosRicC1Service);
        expect(service).toBeTruthy();
    });
});

/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {TestBed} from '@angular/core/testing';

import {ConnectivityService} from './connectivity.service';

describe('ConnectivityService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ConnectivityService = TestBed.inject(ConnectivityService);
        expect(service).toBeTruthy();
    });
});

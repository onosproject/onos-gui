/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {TestBed} from '@angular/core/testing';

import {K8sClientService} from './k8sclient.service';

describe('K8sClientService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: K8sClientService = TestBed.inject(K8sClientService);
        expect(service).toBeTruthy();
    });
});

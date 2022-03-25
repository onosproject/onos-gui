/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {TestBed} from '@angular/core/testing';

import {ModelService} from './model.service';
import {OnosConfigAdminService} from '../onos-api/onos-config-admin.service';
import {GRPC_WEB_CONFIG_PROXY, ID_TOKEN} from './onos-config.module';

describe('ModelService', () => {

    beforeEach(() => TestBed.configureTestingModule({
        providers: [
            {
                provide: GRPC_WEB_CONFIG_PROXY,
                useValue: 'http://localhost:8080'
            },
            {
                provide: ID_TOKEN,
                useValue: localStorage.getItem('id_token')
            },
            {
                provide: OnosConfigAdminService,
                deps: [ID_TOKEN, GRPC_WEB_CONFIG_PROXY]
            },
            {
                provide: ModelService,
                deps: [OnosConfigAdminService]
            }
        ]
    }));

    it('should be created', () => {
        const service: ModelService = TestBed.inject(ModelService);
        expect(service).toBeTruthy();
    });
});

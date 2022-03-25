/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {TestBed} from '@angular/core/testing';

import {OnosConfigDiagsService} from './onos-config-diags.service';
import {GRPC_WEB_CONFIG_PROXY, ID_TOKEN} from './onos-api.module';
import {OnosConfigAdminService} from './onos-config-admin.service';

describe('OnosConfigDiagsService', () => {
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
                }
            ]
        }
    ));

    it('should be created', () => {
        const service: OnosConfigDiagsService = TestBed.inject(OnosConfigDiagsService);
        expect(service).toBeTruthy();
    });
});

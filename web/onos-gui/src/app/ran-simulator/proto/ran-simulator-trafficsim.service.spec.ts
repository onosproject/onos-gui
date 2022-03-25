/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import {TestBed} from '@angular/core/testing';

import {RanSimulatorTrafficsimService} from './ran-simulator-trafficsim.service';
import {GRPC_WEB_SIM_PROXY, ID_TOKEN} from '../ran-simulator.module';

describe('RanSimulatorTrafficsimService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: GRPC_WEB_SIM_PROXY,
                    useValue: 'http://localhost:8080'
                },
                {
                    provide: ID_TOKEN,
                    useValue: localStorage.getItem('id_token')
                },
                {
                    provide: RanSimulatorTrafficsimService,
                    deps: [ID_TOKEN, GRPC_WEB_SIM_PROXY]
                }
            ]
        });
    });

    it('should be created', () => {
        const service: RanSimulatorTrafficsimService = TestBed.inject(RanSimulatorTrafficsimService);
        expect(service).toBeTruthy();
    });
});

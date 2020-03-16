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

import {ModelService} from './model.service';
import {OnosConfigAdminService} from './proto/onos-config-admin.service';

describe('ModelService', () => {
    const cas: OnosConfigAdminService = new OnosConfigAdminService('http://localhost:8080');

    beforeEach(() => TestBed.configureTestingModule({
        providers: [
            {
                provide: OnosConfigAdminService,
                useValue: cas
            },
            {
                provide: ModelService,
                useValue: new ModelService(cas)
            }
        ]
    }));

    it('should be created', () => {
        const service: ModelService = TestBed.inject(ModelService);
        expect(service).toBeTruthy();
    });
});

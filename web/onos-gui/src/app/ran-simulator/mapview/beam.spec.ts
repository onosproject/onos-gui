/*
 * Copyright 2020-present Open Networking Foundation
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

import {BeamCalculator} from './beam';
import {TestBed} from '@angular/core/testing';
import * as L from 'leaflet';
import {Point} from '../proto/github.com/onosproject/ran-simulator/api/types/types_pb';

describe('BeamCalculator', () => {
    const centre = new Point();
    centre.setLat(52);
    centre.setLng(13);

    const centroid = new Point();
    centroid.setLat(52);
    centroid.setLng(13);

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('should calculate beam', () => {
        const original = new L.LatLng(-1, -1);
        const bc = new BeamCalculator(centre, centroid);
        expect(bc.beamCurve).toBeTruthy();
    });

});

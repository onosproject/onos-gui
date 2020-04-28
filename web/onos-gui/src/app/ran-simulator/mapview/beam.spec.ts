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

    const aspectRatio = Math.cos(centre.getLat() * Math.PI / 180);

    const centroid = new Point();
    centroid.setLat(52.01);
    centroid.setLng(13);

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('should calculate beam', () => {
        const bc = new BeamCalculator(centre, 0, 60, centroid, aspectRatio);
        expect(bc).toBeTruthy();
        expect(bc.beamCurve.getPath().length).toEqual(13);
        expect(bc.beamCurve.getPath()[0]).toEqual('M');
        expect(String(bc.beamCurve.getPath()[1])).toEqual('52,13');
        expect(bc.beamCurve.getPath()[2]).toEqual('C');
        expect(String(bc.beamCurve.getPath()[3])).toEqual('52,12.99192169262337');
        expect(bc.beamCurve.getPath()[6]).toEqual('S');
        expect(bc.beamCurve.getPath()[9]).toEqual('S');
        expect(bc.beamCurve.getPath()[12]).toEqual('Z');

        const newCentroid = new Point();
        newCentroid.setLat(52.011);
        newCentroid.setLng(13.011);
        const scale = bc.updateCentroid(newCentroid);
        expect(scale).toBeTruthy();
        expect(bc.beamCurve.getPath().length).toEqual(13);
        expect(bc.beamCurve.getPath()[0]).toEqual('M');
        expect(String(bc.beamCurve.getPath()[1])).toEqual('52,13');
        expect(bc.beamCurve.getPath()[2]).toEqual('C');
        expect(String(bc.beamCurve.getPath()[3])).toEqual('52,12.987433102961642');
        expect(bc.beamCurve.getPath()[6]).toEqual('S');
        expect(bc.beamCurve.getPath()[9]).toEqual('S');
        expect(bc.beamCurve.getPath()[12]).toEqual('Z');
    });

});

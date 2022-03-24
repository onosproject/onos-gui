/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {MapviewComponent} from './mapview.component';
import {RanSimulatorTrafficsimService} from '../proto/ran-simulator-trafficsim.service';
import {ConnectivityService} from '../../connectivity.service';
import {Observable, Subscriber} from 'rxjs';
import {MapLayout} from '../proto/github.com/onosproject/ran-simulator/api/types/types_pb';

class MockTrafficSimService {
    requestGetMapLayout() {
        return new Observable<MapLayout>( (observer: Subscriber<MapLayout>) => {
            observer.complete();
        });
    }
}
class MockConnSvc {
    hideVeil() {}
}

describe('MapviewComponent', () => {
    let component: MapviewComponent;
    let fixture: ComponentFixture<MapviewComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [MapviewComponent],
            providers: [
                { provide: RanSimulatorTrafficsimService, useClass: MockTrafficSimService},
                { provide: ConnectivityService, useClass: MockConnSvc}
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MapviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

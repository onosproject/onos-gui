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

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

import {InjectionToken, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MapviewComponent} from './mapview/mapview.component';
import {Gui2FwLibModule} from 'gui2-fw-lib';
import {RouterModule} from '@angular/router';
import {RanSimulatorTrafficsimService} from './proto/ran-simulator-trafficsim.service';
import {grpc_web_sim_proxy} from '../../environments/environment';
import {FormsModule} from '@angular/forms';

export const GRPC_WEB_SIM_PROXY = new InjectionToken<string>('grpc.web.sim.proxy');
export const ID_TOKEN = new InjectionToken<string>('auth.local.idtoken');

@NgModule({
    declarations: [MapviewComponent],
    imports: [
        CommonModule,
        Gui2FwLibModule,
        FormsModule,
        RouterModule.forChild([
            {path: 'mapview', component: MapviewComponent},
            {path: '', component: MapviewComponent, pathMatch: 'full'}
        ])
    ],
    providers: [
        {
            provide: GRPC_WEB_SIM_PROXY,
            useValue: grpc_web_sim_proxy
        },
        {
            provide: ID_TOKEN,
            useValue: localStorage.getItem('id_token')
        },
        {
            provide: RanSimulatorTrafficsimService,
            deps: [ID_TOKEN, GRPC_WEB_SIM_PROXY],
        }
    ]
})
export class RanSimulatorModule {
}

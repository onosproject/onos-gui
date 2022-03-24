/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
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

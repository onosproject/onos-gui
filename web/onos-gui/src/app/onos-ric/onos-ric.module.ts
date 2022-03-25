/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import {InjectionToken, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {grpc_web_ric_proxy} from '../../environments/environment';
import {UelinksComponent} from './uelinks/uelinks.component';
import {OnosRicC1Service} from './proto/onos-ric-c1.service';
import {Gui2FwLibModule} from 'gui2-fw-lib';
import {CellDetailsComponent} from './celldetails/celldetails.component';

const GRPC_WEB_RIC_PROXY = new InjectionToken<string>('grpc.web.ric.proxy');
export const ID_TOKEN = new InjectionToken<string>('auth.local.idtoken');

@NgModule({
    declarations: [UelinksComponent, CellDetailsComponent],
    imports: [
        CommonModule,
        FormsModule,
        Gui2FwLibModule,
        RouterModule.forChild([
            {path: 'uelinks', component: UelinksComponent},
            {path: '', component: UelinksComponent, pathMatch: 'full'}
        ]),
    ],
    providers: [
        {
            provide: GRPC_WEB_RIC_PROXY,
            useValue: grpc_web_ric_proxy
        },
        {
            provide: ID_TOKEN,
            useValue: localStorage.getItem('id_token')
        },
        {
            provide: OnosRicC1Service,
            deps: [ID_TOKEN, GRPC_WEB_RIC_PROXY],
        }
    ]
})
export class OnosRicModule {
}

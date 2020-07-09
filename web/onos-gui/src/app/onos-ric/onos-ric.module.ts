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
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {grpc_web_ric_proxy} from '../../environments/environment';
import {UelinksComponent} from './uelinks/uelinks.component';
import {OnosRicC1Service} from './proto/onos-ric-c1.service';
import {Gui2FwLibModule} from 'gui2-fw-lib';
import { CellDetailsComponent } from './celldetails/celldetails.component';
import {LoggedinService} from '../loggedin.service';

const GRPC_WEB_RIC_PROXY = new InjectionToken<string>('grpc.web.ric.proxy');

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
            provide: OnosRicC1Service,
            deps: [LoggedinService, GRPC_WEB_RIC_PROXY]
        }
    ]
})
export class OnosRicModule {
}

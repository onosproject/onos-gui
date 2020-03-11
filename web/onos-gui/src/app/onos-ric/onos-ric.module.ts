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
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {grpc_web_ric_proxy} from '../../environments/environment';
import {UelinksComponent} from './uelinks/uelinks.component';
import {OnosGuiRicService} from './proto/onos-gui-ric.service';
import {Gui2FwLibModule} from 'gui2-fw-lib';
import { CellDetailsComponent } from './celldetails/celldetails.component';

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
            provide: OnosGuiRicService,
            useValue: new OnosGuiRicService(grpc_web_ric_proxy)
        }
    ]
})
export class OnosRicModule {
}

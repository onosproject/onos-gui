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

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {grpc_web_config_proxy} from '../../environments/environment';
import {OnosConfigDiagsService} from './proto/onos-config-diags.service';
import {OnosConfigAdminService} from './proto/onos-config-admin.service';
import {OnosConfigGnmiService} from './proto/onos-config-gnmi.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {OnosConfigRoutingModule} from './onos-config-routing.module';
import {Gui2FwLibModule} from 'gui2-fw-lib';
import {Gui2TopoLibModule} from 'gui2-topo-lib';
import { ModelsListComponent } from './models-list/models-list.component';
import {ModelService} from './model.service';
import { ModelDetailComponent } from './model-detail/model-detail.component';
import { ChangeValuePipe } from './change-value.pipe';
import {OnosUtilsModule} from '../utils/onos-utils.module';

@NgModule({
    declarations: [
        // NetworkChangesComponent,
        // ConfigViewComponent,
        // LayerSvgComponent,
        // NetworkChangeDetailComponent,
        // ConfigLayersPanelComponent,
        // ContainerSvgComponent,
        // LeafSvgComponent,
        // ConfigsListComponent,
        ModelsListComponent,
        ModelDetailComponent,
        ChangeValuePipe,
        // PathBarComponent,
        // StringValueComponent,
        // LinkFilterPipe,
        // NodeFilterPipe
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        OnosConfigRoutingModule,
        Gui2FwLibModule,
        Gui2TopoLibModule,
        OnosUtilsModule
    ],
    providers: [
        {
            provide: OnosConfigDiagsService,
            useValue: new OnosConfigDiagsService(grpc_web_config_proxy)
        },
        {
            provide: OnosConfigAdminService,
            useValue: new OnosConfigAdminService(grpc_web_config_proxy)
        },
        {
            provide: OnosConfigGnmiService,
            useValue: new OnosConfigGnmiService(grpc_web_config_proxy)
        },
        {
            provide: ModelService,
            useClass: ModelService
        }
    ],
    exports: [
        // ConfigViewComponent
    ]
})
export class OnosConfigModule {
}

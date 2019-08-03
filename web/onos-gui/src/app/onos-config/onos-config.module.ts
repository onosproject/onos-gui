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
import {grpc_web_proxy} from '../../environments/environment';
import {NetworkChangesComponent} from './networkchanges/network-changes.component';
import {ConfigViewComponent} from './config-view/config-view.component';
import {OnosConfigDiagsService} from './proto/onos-config-diags.service';
import {OnosConfigAdminService} from './proto/onos-config-admin.service';
import {OnosConfigGnmiService} from './proto/onos-config-gnmi.service';
import {LayerSvgComponent} from './config-view/layer-svg/layer-svg.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {OnosConfigRoutingModule} from './onos-config-routing.module';
import {Gui2FwLibModule} from 'gui2-fw-lib';
import {NetworkChangeDetailComponent} from './network-change-detail/network-change-detail.component';
import {ConfigLayersPanelComponent} from './config-layers-panel/config-layers-panel.component';
import { ContainerSvgComponent } from './config-view/container-svg/container-svg.component';
import { LeafSvgComponent } from './config-view/leaf-svg/leaf-svg.component';
import {Gui2TopoLibModule} from 'gui2-topo-lib';

@NgModule({
    declarations: [
        NetworkChangesComponent,
        ConfigViewComponent,
        LayerSvgComponent,
        NetworkChangeDetailComponent,
        ConfigLayersPanelComponent,
        ContainerSvgComponent,
        LeafSvgComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        OnosConfigRoutingModule,
        Gui2FwLibModule,
        Gui2TopoLibModule
    ],
    providers: [
        {
            provide: OnosConfigDiagsService,
            useValue: new OnosConfigDiagsService(grpc_web_proxy)
        },
        {
            provide: OnosConfigAdminService,
            useValue: new OnosConfigAdminService(grpc_web_proxy)
        },
        {
            provide: OnosConfigGnmiService,
            useValue: new OnosConfigGnmiService(grpc_web_proxy)
        },
    ],
    exports: [
        ConfigViewComponent
    ]
})
export class OnosConfigModule {
}

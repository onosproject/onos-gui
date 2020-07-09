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

import {InjectionToken, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {grpc_web_config_proxy, grpc_web_topo_proxy} from '../../environments/environment';
import {OnosConfigDiagsService} from './proto/onos-config-diags.service';
import {OnosConfigAdminService} from './proto/onos-config-admin.service';
import {OnosConfigGnmiService} from './proto/onos-config-gnmi.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {OnosConfigRoutingModule} from './onos-config-routing.module';
import {Gui2FwLibModule} from 'gui2-fw-lib';
import { ModelsListComponent } from './models-list/models-list.component';
import {ModelService} from './model.service';
import { ModelDetailComponent } from './model-detail/model-detail.component';
import { ChangeValuePipe } from './change-value.pipe';
import { ConfigDashboardComponent } from './config-dashboard/config-dashboard.component';
import { NetworkChangeComponent } from './config-dashboard/network-change/network-change.component';
import { DeviceChangeComponent } from './config-dashboard/device-change/device-change.component';
import { DeviceSnapshotComponent } from './config-dashboard/device-snapshot/device-snapshot.component';
import { NetworkSnapshotComponent } from './config-dashboard/network-snapshot/network-snapshot.component';
import {OnosTopoDeviceService} from '../onos-topo/proto/onos-topo-device.service';
import { DeviceChangeDetailsComponent } from './device-change-details/device-change-details.component';
import { ChangeStatusPipe } from './change-status.pipe';
import {ConfigViewComponent} from './config-view/config-view.component';
import {ConfigLayersPanelComponent} from './config-layers-panel/config-layers-panel.component';
import {LayerSvgComponent} from './config-view/layer-svg/layer-svg.component';
import {NodeFilterPipe} from './config-view/node-filter.pipe';
import {ContainerSvgComponent} from './config-view/container-svg/container-svg.component';
import {LinkFilterPipe} from './config-view/link-filter.pipe';
import {StringValueComponent} from './config-view/string-value/string-value.component';
import {DeviceService} from './device.service';
import {TopoDeviceService} from '../onos-topo/topodevice.service';
import { OrderModule } from 'ngx-order-pipe';
import {LoggedinService} from '../loggedin.service';

const GRPC_WEB_TOPO_PROXY = new InjectionToken<string>('grpc.web.topo.proxy');
export const GRPC_WEB_CONFIG_PROXY = new InjectionToken<string>('grpc.web.config.proxy');

@NgModule({
    declarations: [
        ModelsListComponent,
        ModelDetailComponent,
        ChangeValuePipe,
        ConfigDashboardComponent,
        NetworkChangeComponent,
        DeviceChangeComponent,
        DeviceSnapshotComponent,
        NetworkSnapshotComponent,
        DeviceChangeDetailsComponent,
        ChangeStatusPipe,
        ConfigViewComponent,
        ConfigLayersPanelComponent,
        LayerSvgComponent,
        NodeFilterPipe,
        ContainerSvgComponent,
        LinkFilterPipe,
        StringValueComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        OnosConfigRoutingModule,
        Gui2FwLibModule,
        OrderModule
    ],
    providers: [
        {
            provide: GRPC_WEB_TOPO_PROXY,
            useValue: grpc_web_topo_proxy
        },
        {
            provide: GRPC_WEB_CONFIG_PROXY,
            useValue: grpc_web_config_proxy
        },
        {
            provide: OnosConfigDiagsService,
            deps: [LoggedinService, GRPC_WEB_CONFIG_PROXY],
        },
        {
            provide: OnosConfigAdminService,
            deps: [LoggedinService, GRPC_WEB_CONFIG_PROXY],
        },
        {
            provide: OnosConfigGnmiService,
            deps: [LoggedinService, GRPC_WEB_CONFIG_PROXY],
        },
        {
            provide: OnosTopoDeviceService,
            deps: [LoggedinService, GRPC_WEB_TOPO_PROXY],
        },
        {
            provide: ModelService,
            useClass: ModelService
        },
        {
            provide: DeviceService,
            useClass: DeviceService
        },
        {
            provide: TopoDeviceService,
            useClass: TopoDeviceService
        }
    ],
    exports: [
        // ConfigViewComponent
    ]
})
export class OnosConfigModule {
}

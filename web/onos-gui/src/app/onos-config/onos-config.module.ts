/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {InjectionToken, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
    grpc_web_config_proxy,
    grpc_web_topo_proxy
} from '../../environments/environment';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {OnosConfigRoutingModule} from './onos-config-routing.module';
import {Gui2FwLibModule} from 'gui2-fw-lib';
import {ModelsListComponent} from './models-list/models-list.component';
import {ModelService} from './model.service';
import {ModelDetailComponent} from './model-detail/model-detail.component';
import {ChangeValuePipe} from './change-value.pipe';
import {ConfigDashboardComponent} from './config-dashboard/config-dashboard.component';
import {NetworkChangeComponent} from './config-dashboard/network-change/network-change.component';
import {DeviceChangeComponent} from './config-dashboard/device-change/device-change.component';
import {DeviceSnapshotComponent} from './config-dashboard/device-snapshot/device-snapshot.component';
import {NetworkSnapshotComponent} from './config-dashboard/network-snapshot/network-snapshot.component';
import {DeviceChangeDetailsComponent} from './device-change-details/device-change-details.component';
import {ChangeStatusPipe} from './change-status.pipe';
import {ConfigViewComponent} from './config-view/config-view.component';
import {ConfigLayersPanelComponent} from './config-layers-panel/config-layers-panel.component';
import {LayerSvgComponent} from './config-view/layer-svg/layer-svg.component';
import {NodeFilterPipe} from './config-view/node-filter.pipe';
import {ContainerSvgComponent} from './config-view/container-svg/container-svg.component';
import {LinkFilterPipe} from './config-view/link-filter.pipe';
import {StringValueComponent} from './config-view/string-value/string-value.component';
import {DeviceService} from './device.service';
import {TopoEntityService} from '../onos-topo/topo-entity.service';
import {OrderModule} from 'ngx-order-pipe';
import {OnosApiModule} from '../onos-api/onos-api.module';

const GRPC_WEB_TOPO_PROXY = new InjectionToken<string>('grpc.web.topo.proxy');
export const GRPC_WEB_CONFIG_PROXY = new InjectionToken<string>('grpc.web.config.proxy');
export const ID_TOKEN = new InjectionToken<string>('auth.local.idtoken');

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
        OrderModule,
        OnosApiModule,
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
            provide: ID_TOKEN,
            useValue: localStorage.getItem('id_token')
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
            provide: TopoEntityService,
            useClass: TopoEntityService
        }
    ],
    exports: [
        // ConfigViewComponent
    ]
})
export class OnosConfigModule {
}

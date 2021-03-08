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
import {
    grpc_web_config_proxy, grpc_web_modelregistry_proxy,
    grpc_web_topo_proxy
} from '../../environments/environment';
import {OnosConfigDiagsService} from './onos-config-diags.service';
import {OnosTopoEntityService} from './onos-topo-entity.service';
import {OnosConfigAdminService} from './onos-config-admin.service';
import {OnosConfigGnmiService} from './onos-config-gnmi.service';
import {ConfigModelRegistryService} from './config-model-registry.service';

const GRPC_WEB_TOPO_PROXY = new InjectionToken<string>('grpc.web.topo.proxy');
const GRPC_WEB_CONFIGMODEL_PROXY = new InjectionToken<string>('grpc.web.configmodel.proxy');
export const GRPC_WEB_CONFIG_PROXY = new InjectionToken<string>('grpc.web.config.proxy');
export const ID_TOKEN = new InjectionToken<string>('auth.local.idtoken');

@NgModule({
    declarations: [
    ],
    imports: [
        CommonModule,
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
            provide: GRPC_WEB_CONFIGMODEL_PROXY,
            useValue: grpc_web_modelregistry_proxy
        },
        {
            provide: ID_TOKEN,
            useValue: localStorage.getItem('id_token')
        },
        {
            provide: OnosConfigDiagsService,
            deps: [ID_TOKEN, GRPC_WEB_CONFIG_PROXY],
        },
        {
            provide: OnosConfigAdminService,
            deps: [ID_TOKEN, GRPC_WEB_CONFIG_PROXY],
        },
        {
            provide: OnosConfigGnmiService,
            deps: [ID_TOKEN, GRPC_WEB_CONFIG_PROXY],
        },
        {
            provide: OnosTopoEntityService,
            deps: [ID_TOKEN, GRPC_WEB_TOPO_PROXY],
        },
        {
            provide: ConfigModelRegistryService,
            deps: [ID_TOKEN, GRPC_WEB_CONFIGMODEL_PROXY]
        }
    ],
    exports: [
        // ConfigViewComponent
    ]
})
export class OnosApiModule {
}

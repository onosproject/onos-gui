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
    grpc_web_config_proxy,
    grpc_web_topo_proxy
} from '../../environments/environment';
import {LoggedinService} from '../loggedin.service';
import {OnosConfigDiagsService} from './onos-config-diags.service';
import {OnosTopoDeviceService} from './onos-topo-device.service';
import {OnosConfigAdminService} from './onos-config-admin.service';
import {OnosConfigGnmiService} from './onos-config-gnmi.service';

const GRPC_WEB_TOPO_PROXY = new InjectionToken<string>('grpc.web.topo.proxy');
export const GRPC_WEB_CONFIG_PROXY = new InjectionToken<string>('grpc.web.config.proxy');

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
    ],
    exports: [
        // ConfigViewComponent
    ]
})
export class OnosApiModule {
}

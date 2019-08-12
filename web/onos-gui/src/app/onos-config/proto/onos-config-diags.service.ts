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

import {Inject, Injectable} from '@angular/core';
import {ConfigDiagsClient} from './github.com/onosproject/onos-config/pkg/northbound/diags/diagsServiceClientPb';
import {
    ChangesRequest, ConfigRequest, Configuration
} from './github.com/onosproject/onos-config/pkg/northbound/diags/diags_pb';
import {Change} from './github.com/onosproject/onos-config/pkg/northbound/admin/admin_pb';

type ChangesCallback = (r: Change) => void;
type ConfigsCallback = (r: Configuration) => void;

@Injectable()
export class OnosConfigDiagsService {
    diagsService: ConfigDiagsClient;

    constructor(@Inject('onosConfigUrl') private onosConfigUrl: string) {
        this.diagsService = new ConfigDiagsClient(onosConfigUrl);
        console.log('Connecting to ', onosConfigUrl);
    }

    requestChanges(changeIds: string[], callback: ChangesCallback) {
        console.log('ListChangesRequest sent to', this.onosConfigUrl);
        const changesRequest = new ChangesRequest();
        let idx = 0;
        for (const ch of changeIds) {
            changesRequest.addChangeIds(ch, idx);
            idx++;
        }
        const stream = this.diagsService.getChanges(changesRequest, {});
        stream.on('data', callback);
    }

    requestConfigurations(configNames: string[], callback: ConfigsCallback) {
        const configRequest = new ConfigRequest();
        let idx = 0;
        for (const cfg of configNames) {
            configRequest.addDeviceIds(cfg, idx);
            idx++;
        }
        const stream = this.diagsService.getConfigurations(configRequest, {});
        console.log('ListConfigsRequest sent to', this.onosConfigUrl, 'for', configNames.join(','));
        stream.on('data', callback);
    }
}

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
import {
    ChangeServiceClient,
    OpStateDiagsClient
} from './github.com/onosproject/onos-config/api/diags/diagsServiceClientPb';
import {
    ListDeviceChangeRequest, ListDeviceChangeResponse,
    ListNetworkChangeRequest, ListNetworkChangeResponse,
    OpStateRequest,
    OpStateResponse
} from './github.com/onosproject/onos-config/api/diags/diags_pb';

type NetworkChangesCallback = (r: ListNetworkChangeResponse) => void;
type DeviceChangesCallback = (r: ListDeviceChangeResponse) => void;
type OpStateCallback = (r: OpStateResponse) => void;

@Injectable()
export class OnosConfigDiagsService {
    diagsService: ChangeServiceClient;
    opStateService: OpStateDiagsClient;

    constructor(@Inject('onosConfigUrl') private onosConfigUrl: string) {
        this.diagsService = new ChangeServiceClient(onosConfigUrl);
        this.opStateService = new OpStateDiagsClient(onosConfigUrl);

        console.log('Connecting to ', onosConfigUrl);
    }

    // requestChanges(changeIds: string[], callback: ChangesCallback) {
    //     console.log('ListChangesRequest sent to', this.onosConfigUrl);
    //     const changesRequest = new ChangesRequest();
    //     let idx = 0;
    //     for (const ch of changeIds) {
    //         changesRequest.addChangeIds(ch, idx);
    //         idx++;
    //     }
    //     const stream = this.diagsService.getChanges(changesRequest, {});
    //     stream.on('data', callback);
    // }

    // requestConfigurations(configNames: string[], callback: ConfigsCallback) {
    //     const configRequest = new ConfigRequest();
    //     let idx = 0;
    //     for (const cfg of configNames) {
    //         configRequest.addDeviceIds(cfg, idx);
    //         idx++;
    //     }
    //     const stream = this.diagsService.getConfigurations(configRequest, {});
    //     console.log('ListConfigsRequest sent to', this.onosConfigUrl, 'for', configNames.join(','));
    //     stream.on('data', callback);
    // }

    requestNetworkChanges(callback: NetworkChangesCallback) {
        const listNetworkChangeRequest = new ListNetworkChangeRequest();
        listNetworkChangeRequest.setSubscribe(true);
        const stream = this.diagsService.listNetworkChanges(listNetworkChangeRequest, {});
        console.log('ListNetworkChangeRequest sent to', this.onosConfigUrl);
        stream.on('data', callback);
    }

    requestDeviceChanges(deviceId: string, version: string, callback: DeviceChangesCallback) {
        const listDeviceChangesRequest = new ListDeviceChangeRequest();
        listDeviceChangesRequest.setSubscribe(true);
        listDeviceChangesRequest.setDeviceId(deviceId);
        listDeviceChangesRequest.setDeviceVersion(version);
        const stream = this.diagsService.listDeviceChanges(listDeviceChangesRequest, {});
        console.log('ListDeviceChangeRequest for', deviceId, version, 'sent to', this.onosConfigUrl);
        stream.on('data', callback);
    }

    requestOpStateCache(deviceId: string, subscribe: boolean, callback: OpStateCallback ) {
        const opStateRequest = new OpStateRequest();
        opStateRequest.setDeviceid(deviceId);
        opStateRequest.setSubscribe(subscribe);

        const stream = this.opStateService.getOpState(opStateRequest, {});
        console.log('GetOpStateRequest sent to', this.onosConfigUrl, 'for', deviceId);
        stream.on('data', callback);
    }
}

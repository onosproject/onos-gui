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

import {Injectable} from '@angular/core';
import {
    AdminServiceClient,
    DeviceInventoryServiceClient
} from './github.com/onosproject/onos-config/pkg/northbound/proto/adminServiceClientPb';
import {
    DeviceSummaryRequest,
    DeviceSummaryResponse, NetChange, NetworkChangesRequest
} from './github.com/onosproject/onos-config/pkg/northbound/proto/admin_pb';
import * as grpcWeb from 'grpc-web';

type DeviceCountCallback = (e: grpcWeb.Error, r: DeviceSummaryResponse) => void;
type NetChangeCallback = (r: NetChange) => void;

@Injectable({
    providedIn: 'root'
})
export class OnosConfigAdminService {

    deviceInventoryService: DeviceInventoryServiceClient;
    adminServiceClient: AdminServiceClient;

    constructor(private onosConfigUrl: string) {
        this.deviceInventoryService = new DeviceInventoryServiceClient(onosConfigUrl);
        this.adminServiceClient = new AdminServiceClient(onosConfigUrl);

        console.log('Device Inventory Service and Admin Service Connecting to ', onosConfigUrl);
    }

    requestSummary(cb: DeviceCountCallback) {
        console.log('ListChangesRequest Request sent to', this.onosConfigUrl);
        const deviceSummaryRequest = new DeviceSummaryRequest();
        this.deviceInventoryService.getDeviceSummary(deviceSummaryRequest, {}, cb);
    }

    requestNetworkChanges(callback: NetChangeCallback) {
        const stream = this.adminServiceClient.getNetworkChanges(new NetworkChangesRequest(), {});
        console.log('NetworkChangesRequest sent to', this.onosConfigUrl);
        stream.on('data', callback);
    }
}

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

import { Injectable } from '@angular/core';
import {DeviceInventoryServiceClient} from './github.com/onosproject/onos-config/pkg/northbound/proto/adminServiceClientPb';
import {
  DeviceSummaryRequest,
  DeviceSummaryResponse
} from './github.com/onosproject/onos-config/pkg/northbound/proto/admin_pb';
import * as grpcWeb from 'grpc-web';

type DeviceCountCallback = (e: grpcWeb.Error, r: DeviceSummaryResponse) => void;

@Injectable({
  providedIn: 'root'
})
export class OnosConfigAdminService {

  deviceInventoryService: DeviceInventoryServiceClient;
  deviceSummaryRequest: DeviceSummaryRequest;

  constructor(private onosConfigUrl: string) {
    this.deviceInventoryService = new DeviceInventoryServiceClient(onosConfigUrl);
    console.log('Device Inventory Service Connecting to ', onosConfigUrl);
    this.deviceSummaryRequest = new DeviceSummaryRequest();
  }

  requestSummary(cb: DeviceCountCallback) {
    console.log('ListChangesRequest Request sent to', this.onosConfigUrl);
    this.deviceInventoryService.getDeviceSummary(this.deviceSummaryRequest, {}, cb);
  }
}

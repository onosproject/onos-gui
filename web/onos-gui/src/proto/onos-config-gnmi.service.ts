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
import * as grpcWeb from 'grpc-web';
import {gNMIClient} from './github.com/openconfig/gnmi/proto/gnmi/gnmiServiceClientPb';
import {
  CapabilityRequest,
  CapabilityResponse
} from './github.com/openconfig/gnmi/proto/gnmi/gnmi_pb';

type CapabilityCallback = (e: grpcWeb.Error, r: CapabilityResponse) => void;

@Injectable({
  providedIn: 'root'
})
export class OnosConfigGnmiService {

  onosConfigUrl: string;
  gnmiService: gNMIClient;
  capabilitiesRequest: CapabilityRequest;

  constructor(onosConfigHostname: string) {
    this.onosConfigUrl = 'https://' + onosConfigHostname;

    this.gnmiService = new gNMIClient(this.onosConfigUrl);
    console.log('gNMI Client Connecting to ', this.onosConfigUrl);
    this.capabilitiesRequest = new CapabilityRequest();
  }

  requestCapabilities(cb: CapabilityCallback): void {
    console.log('capabilities Request sent to', this.onosConfigUrl);
    this.gnmiService.capabilities(this.capabilitiesRequest, {}, cb);
  }
}

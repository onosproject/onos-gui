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

import { Component } from '@angular/core';
import {OnosConfigDiagsService} from '../proto/onos-config-diags.service';
import {OnosConfigAdminService} from '../proto/onos-config-admin.service';
import {OnosConfigGnmiService} from '../proto/onos-config-gnmi.service';
import {
  CapabilityRequest,
  CapabilityResponse
} from '../proto/github.com/openconfig/gnmi/proto/gnmi/gnmi_pb';
import * as grpcWeb from 'grpc-web';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'onos-gui';
  capabilites: CapabilityResponse;

  constructor(
    private diags: OnosConfigDiagsService,
    private admin: OnosConfigAdminService,
    private gnmi: OnosConfigGnmiService,
  ) {
    console.log('Constructed AppComponent');
  }

  listChanges() {
    this.diags.requestChanges();
  }

  listDeviceSummary() {
    this.admin.requestSummary();
  }

  listGnmiCapabilities() {
    this.gnmi.requestCapabilities((e: grpcWeb.Error, r: CapabilityResponse) => {
      if (e != null) {
        console.log('Error getting capabilities from onos-config');
        console.log(e.code, e.message);
      }
      this.capabilites = r;
    });
  }
}

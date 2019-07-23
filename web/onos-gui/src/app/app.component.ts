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

import {Component} from '@angular/core';
import {OnosConfigDiagsService} from '../proto/onos-config-diags.service';
import {OnosConfigAdminService} from '../proto/onos-config-admin.service';
import {OnosConfigGnmiService} from '../proto/onos-config-gnmi.service';
import {
  CapabilityResponse,
  GetResponse,
  Notification,
  Path,
  TypedValue,
  Update
} from '../proto/github.com/openconfig/gnmi/proto/gnmi/gnmi_pb';
import * as grpcWeb from 'grpc-web';
import {Change} from '../proto/github.com/onosproject/onos-config/pkg/northbound/proto/diags_pb';
import {DeviceSummaryResponse} from '../proto/github.com/onosproject/onos-config/pkg/northbound/proto/admin_pb';

export interface UpdateAsString {
  path: string;
  value: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'onos-gui';
  capabilites: CapabilityResponse;
  deviceCount: number = 0;
  changes: Change[] = [];
  updates: UpdateAsString[] = [];

  constructor(
    private diags: OnosConfigDiagsService,
    private admin: OnosConfigAdminService,
    private gnmi: OnosConfigGnmiService,
  ) {
    console.log('Constructed AppComponent');
  }

  listChanges() {
    this.changes.length = 0;
    this.diags.requestChanges((change: Change) => {
      this.changes.push(change);
    });
  }

  listDeviceSummary() {
    this.admin.requestSummary((e: grpcWeb.Error, r: DeviceSummaryResponse) => {
        if (e != null) {
          console.warn(e.code, e.message);
          return;
        }
        this.deviceCount = r.getCount();
    });
  }

  listGnmiCapabilities(): void {
    this.gnmi.requestCapabilities((e: grpcWeb.Error, r: CapabilityResponse) => {
      if (e != null) {
        console.warn('Error getting capabilities from onos-config');
        console.warn(e.code, e.message);
      }
      this.capabilites = r;
    });
  }

  getConfigByDevice(deviceId: string): void {
    this.gnmi.requestGetAllByDevice(deviceId, (e, r) => this.handleGetResponse(e, r));
  }

  /**
   * Callback for handling the GetResponse
   * @param e error
   * @param r GetResponse
   */
  handleGetResponse(e: grpcWeb.Error, r: GetResponse): void {
    if (e != null) {
      console.warn('Error getting capabilities from onos-config', e.code, e.message);
      return;
    }
    console.log('GetResponse received', r);
    const notifications: Array<Notification> = r.getNotificationList();
    this.updates.length = 0;
    for (const n of notifications) {
      for (const u of n.getUpdateList()) {
        console.log('Update', u.getVal().getValueCase());
        if (u.getVal().getValueCase() === TypedValue.ValueCase.JSON_VAL) {
          const jsonValue = new TextDecoder('utf-8').decode(u.getVal().getJsonVal_asU8());
          const jsonUpdate = <UpdateAsString>{
            path: '/',
            value: jsonValue,
          };
          this.updates.push(jsonUpdate);
          console.log('Update', jsonUpdate);
        }
      }
    }
    console.log('GetResponse finished');
  }
}

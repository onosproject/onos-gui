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
import {ListModelsRequest, ModelInfo} from '../proto/admin_pb.d';
import {AdminServiceClient} from '../proto/adminServiceClientPb'
import * as grpcWeb from 'grpc-web';

@Injectable({
  providedIn: 'root'
})
export class DiagsService {

  adminService: any;
  modelsRequest: any;

  constructor() {

    this.adminService = new AdminServiceClient('http://localhost:5150');
    this.modelsRequest = new ListModelsRequest();
  }

  request() {
    console.log("ListModelsRequest Request sent")
    this.adminService.listRegisteredModels(this.request, {}, (err, response) => {
      console.log("Response receieved")
    })
  }

}

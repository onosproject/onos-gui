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

import { Inject, Injectable } from '@angular/core';
import { DeviceServiceClient } from './github.com/onosproject/onos-topo/api/device/DeviceServiceClientPb';
import {
    ListRequest, ListResponse
} from './github.com/onosproject/onos-topo/api/device/device_pb';
import { Observable, Subscriber } from 'rxjs';
import * as grpcWeb from 'grpc-web';
import { LoggedinService } from '../../loggedin.service';
import { TopoClient } from './github.com/onosproject/onos-topo/api/topo/TopoServiceClientPb';
import { SubscribeResponse, SubscribeRequest } from './github.com/onosproject/onos-topo/api/topo/topo_pb';

@Injectable()
export class OnosTopoDeviceService {

    deviceServiceClient: DeviceServiceClient;
    topoServiceClient: TopoClient;

    constructor(
        @Inject('loggedinService') public loggedinService: LoggedinService,
        private onosTopoUrl: string
    ) {
        this.deviceServiceClient = new DeviceServiceClient(onosTopoUrl);
        this.topoServiceClient = new TopoClient(onosTopoUrl);

        console.log('Topo Device Url', onosTopoUrl, loggedinService.email);
    }

    requestListDevices(subscribe: boolean): Observable<ListResponse> {
        const listRequest = new ListRequest();
        listRequest.setSubscribe(subscribe);
        const stream = this.deviceServiceClient.list(listRequest, {
            Authorization: 'Bearer ' + this.loggedinService.idToken,
        });
        console.log('ListDevices sent to', this.onosTopoUrl);
        const topoObs = new Observable<ListResponse>((observer: Subscriber<ListResponse>) => {
            stream.on('data', (listResponse: ListResponse) => {
                observer.next(listResponse);
            });
            stream.on('error', (error: grpcWeb.Error) => {
                observer.error(error);
            });
            stream.on('end', () => {
                observer.complete();
            });
            return () => stream.cancel();
        });
        return topoObs;
    }

    requestListTopo(subscribe: boolean): Observable<SubscribeResponse> {
        const subscribeRequest = new SubscribeRequest();
        // subscribeRequest.setSubscribe();
        const stream = this.topoServiceClient.subscribe(subscribeRequest, {
            Authorization: 'Bearer ' + this.loggedinService.idToken,
        });
        console.log('Topo data sent to', this.onosTopoUrl);
        const topoObs = new Observable<SubscribeResponse>((observer: Subscriber<SubscribeResponse>) => {
            stream.on('data', (subscribeResponse: SubscribeResponse) => {
                observer.next(subscribeResponse);
            });
            stream.on('error', (error: grpcWeb.Error) => {
                observer.error(error);
            });
            stream.on('end', () => {
                observer.complete();
            });
            return () => stream.cancel();
        });
        return topoObs;
    }
}

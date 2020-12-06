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

import { Observable, Subscriber } from 'rxjs';
import * as grpcWeb from 'grpc-web';
import { LoggedinService } from '../loggedin.service';
import { TopoClient } from './onos/topo/TopoServiceClientPb';
import {
    WatchRequest,
    WatchResponse
} from './onos/topo/topo_pb';

@Injectable()
export class OnosTopoDeviceService {

    topoServiceClient: TopoClient;

    constructor(
        @Inject('loggedinService') public loggedinService: LoggedinService,
        private onosTopoUrl: string
    ) {
        this.topoServiceClient = new TopoClient(onosTopoUrl);

        console.log('Topo Device Url', onosTopoUrl, loggedinService.email);
    }

    requestListTopo(): Observable<WatchResponse> {
        const subscribeRequest = new WatchRequest();
        const stream = this.topoServiceClient.watch(subscribeRequest, {
            Authorization: 'Bearer ' + this.loggedinService.idToken,
        });
        console.log('Topo entity data sent to', this.onosTopoUrl);
        const topoObs = new Observable<WatchResponse>((observer: Subscriber<WatchResponse>) => {
            stream.on('data', (subscribeResponse: WatchResponse) => {
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


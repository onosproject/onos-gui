/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Inject, Injectable } from '@angular/core';

import { Observable, Subscriber } from 'rxjs';
import * as grpcWeb from 'grpc-web';
import { TopoClient } from './onos/topo/TopoServiceClientPb';
import {
    WatchRequest,
    WatchResponse
} from './onos/topo/topo_pb';

@Injectable()
export class OnosTopoEntityService {

    topoServiceClient: TopoClient;

    constructor(
        private idToken: string,
        private onosTopoUrl: string
    ) {
        this.topoServiceClient = new TopoClient(onosTopoUrl);

        console.log('Topo Entity Url', onosTopoUrl);
    }

    requestListTopo(): Observable<WatchResponse> {
        const subscribeRequest = new WatchRequest();
        const stream = this.topoServiceClient.watch(subscribeRequest, {
            Authorization: 'Bearer ' + this.idToken,
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


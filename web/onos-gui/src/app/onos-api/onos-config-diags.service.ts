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
} from './onos/config/diags/DiagsServiceClientPb';
import {
    ListDeviceChangeRequest, ListDeviceChangeResponse,
    ListNetworkChangeRequest, ListNetworkChangeResponse,
    OpStateRequest,
    OpStateResponse
} from './onos/config/diags/diags_pb';
import {Observable, Subscriber} from 'rxjs';
import {Metadata} from 'grpc-web';
import * as grpcWeb from 'grpc-web';
import {LoggedinService} from '../loggedin.service';

@Injectable()
export class OnosConfigDiagsService {
    diagsService: ChangeServiceClient;
    opStateService: OpStateDiagsClient;

    constructor(
        @Inject('loggedinService') public loggedinService: LoggedinService,
        private onosConfigUrl: string
    ) {
        this.diagsService = new ChangeServiceClient(onosConfigUrl);
        this.opStateService = new OpStateDiagsClient(onosConfigUrl);

        console.log('Config Diags Url ', onosConfigUrl);
    }

    requestNetworkChanges(): Observable<ListNetworkChangeResponse> {
        const listNetworkChangeRequest = new ListNetworkChangeRequest();
        listNetworkChangeRequest.setSubscribe(true);
        const stream = this.diagsService.listNetworkChanges(listNetworkChangeRequest, {
            Authorization: 'Bearer ' + this.loggedinService.idToken,
        });
        console.log('ListNetworkChangeRequest sent to', this.onosConfigUrl);

        const networkChangesObs = new Observable<ListNetworkChangeResponse>((observer: Subscriber<ListNetworkChangeResponse>) => {
            stream.on('data', (resp: ListNetworkChangeResponse) => {
                observer.next(resp);
            });
            stream.on('error', (error: grpcWeb.Error) => {
                observer.error(error);
            });
            stream.on('end', () => {
                observer.complete();
            });
            stream.on('status', (status: grpcWeb.Status) => {
                console.log('ListNetworkChanges status', status.code, status.details, status.metadata);
            });
            return () => stream.cancel();
        });
        return networkChangesObs;
    }

    requestDeviceChanges(deviceId: string, version: string): Observable<ListDeviceChangeResponse> {
        const listDeviceChangesRequest = new ListDeviceChangeRequest();
        listDeviceChangesRequest.setSubscribe(true);
        listDeviceChangesRequest.setDeviceId(deviceId);
        listDeviceChangesRequest.setDeviceVersion(version);
        const stream = this.diagsService.listDeviceChanges(listDeviceChangesRequest, {
            Authorization: 'Bearer ' + this.loggedinService.idToken,
        } as Metadata);
        console.log('ListDeviceChangeRequest for', deviceId, version, 'sent to', this.onosConfigUrl);
        const devicechangeObs = new Observable<ListDeviceChangeResponse>((observer: Subscriber<ListDeviceChangeResponse>) => {
            stream.on('data', (resp: ListDeviceChangeResponse) => {
                observer.next(resp);
            });
            stream.on('error', (error: grpcWeb.Error) => {
                observer.error(error);
            });
            stream.on('end', () => {
                observer.complete();
            });
            stream.on('status', (status: grpcWeb.Status) => {
                console.log('ListDeviceChange status', status.code, status.details, status.metadata);
            });
            return () => stream.cancel();
        });
        return devicechangeObs;
    }

    requestOpStateCache(deviceId: string, subscribe: boolean): Observable<OpStateResponse> {
        const opStateRequest = new OpStateRequest();
        opStateRequest.setDeviceid(deviceId);
        opStateRequest.setSubscribe(subscribe);
        const stream = this.opStateService.getOpState(opStateRequest, {
            Authorization: 'Bearer ' + this.loggedinService.idToken,
        } as Metadata);
        console.log('GetOpStateRequest sent to', this.onosConfigUrl, 'for', deviceId);

        const opstateObs = new Observable<OpStateResponse>((observer: Subscriber<OpStateResponse>) => {
            stream.on('data', (resp: OpStateResponse) => {
                observer.next(resp);
            });
            stream.on('error', (error: grpcWeb.Error) => {
                observer.error(error);
            });
            stream.on('end', () => {
                observer.complete();
            });
            return () => stream.cancel();
        });
        return opstateObs;
    }
}

/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
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

@Injectable()
export class OnosConfigDiagsService {
    diagsService: ChangeServiceClient;
    opStateService: OpStateDiagsClient;

    constructor(
        private idToken: string,
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
            Authorization: 'Bearer ' + this.idToken,
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
            Authorization: 'Bearer ' + this.idToken,
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
            Authorization: 'Bearer ' + this.idToken,
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

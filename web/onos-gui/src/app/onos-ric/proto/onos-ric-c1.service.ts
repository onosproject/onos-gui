/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {Inject, Injectable} from '@angular/core';
import {C1InterfaceServiceClient} from './github.com/onosproject/onos-ric/api/nb/C1-interfaceServiceClientPb';
import {Observable, Subscriber} from 'rxjs';
import {
    ECGI,
    StationInfo, StationLinkInfo, StationLinkListRequest, StationListRequest,
    UELinkInfo,
    UELinkListRequest
} from './github.com/onosproject/onos-ric/api/nb/c1-interface_pb';
import * as grpcWeb from 'grpc-web';

@Injectable()
export class OnosRicC1Service {

    c1InterfaceClient: C1InterfaceServiceClient;

    constructor(
        private idToken: string,
        private onosRicUrl: string
    ) {
        this.c1InterfaceClient = new C1InterfaceServiceClient(onosRicUrl);

        console.log('onos-ric grpc-web Url ', onosRicUrl);
    }

    requestListUeLinks(): Observable<UELinkInfo> {
        const req = new UELinkListRequest();
        req.setNoimsi(false);
        const stream = this.c1InterfaceClient.listUELinks(req, {
            Authorization: 'Bearer ' + this.idToken,
        });
        const listUeLinksObs = new Observable<UELinkInfo>((observer: Subscriber<UELinkInfo>) => {
            stream.on('data', (uelink: UELinkInfo) => {
                observer.next(uelink);
            });
            stream.on('error', (error: grpcWeb.Error) => {
                observer.error(error);
            });
            stream.on('end', () => {
                observer.complete();
            });
            return () => stream.cancel();
        });
        return listUeLinksObs;
    }

    requestListStations(): Observable<StationInfo> {
        const req = new StationListRequest();
        const stream = this.c1InterfaceClient.listStations(req, {
            Authorization: 'Bearer ' + this.idToken,
        });
        const listStationsObs = new Observable<StationInfo>((observer: Subscriber<StationInfo>) => {
            stream.on('data', (stationInfo: StationInfo) => {
                observer.next(stationInfo);
            });
            stream.on('error', (error: grpcWeb.Error) => {
                observer.error(error);
            });
            stream.on('end', () => {
                observer.complete();
            });
            return () => stream.cancel();
        });
        return listStationsObs;
    }

    requestListStationLinks(ecgi: ECGI): Observable<StationLinkInfo> {
        const req = new StationLinkListRequest();
        // req.setEcgi(ecgi); Not implemented in onos-ric
        const stream = this.c1InterfaceClient.listStationLinks(req, {
            Authorization: 'Bearer ' + this.idToken,
        });
        const listStationLinksObs = new Observable<StationLinkInfo>((observer: Subscriber<StationLinkInfo>) => {
            stream.on('data', (stationLinkInfo: StationLinkInfo) => {
                observer.next(stationLinkInfo);
            });
            stream.on('error', (error: grpcWeb.Error) => {
                observer.error(error);
            });
            stream.on('end', () => {
                observer.complete();
            });
            return () => stream.cancel();
        });
        return listStationLinksObs;
    }
}

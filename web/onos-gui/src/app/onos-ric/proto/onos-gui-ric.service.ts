/*
 * Copyright 2020-present Open Networking Foundation
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
export class OnosGuiRicService {

    c1InterfaceClient: C1InterfaceServiceClient;

    constructor(@Inject('onosRicUrl') private onosRicUrl: string) {
        this.c1InterfaceClient = new C1InterfaceServiceClient(onosRicUrl);

        console.log('onos-ric grpc-web Url ', onosRicUrl);
    }

    requestListUeLinks(): Observable<UELinkInfo> {
        const req = new UELinkListRequest();
        const stream = this.c1InterfaceClient.listUELinks(req, {});
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
        const stream = this.c1InterfaceClient.listStations(req, {});
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
        const stream = this.c1InterfaceClient.listStationLinks(req, {});
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

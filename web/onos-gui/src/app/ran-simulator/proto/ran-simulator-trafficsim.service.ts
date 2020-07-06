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
import {TrafficClient} from './github.com/onosproject/ran-simulator/api/trafficsim/TrafficsimServiceClientPb';
import {Observable, Subscriber} from 'rxjs';
import {MapLayout, Cell} from './github.com/onosproject/ran-simulator/api/types/types_pb';
import {
    ListRoutesRequest,
    ListRoutesResponse,
    ListCellsRequest,
    ListCellsResponse,
    ListUesResponse,
    MapLayoutRequest, SetNumberUEsRequest,
    SetNumberUEsResponse, ListUesRequest
} from './github.com/onosproject/ran-simulator/api/trafficsim/trafficsim_pb';
import * as grpcWeb from 'grpc-web';

@Injectable()
export class RanSimulatorTrafficsimService {

    trafficClient: TrafficClient;

    constructor(@Inject('ranSimulatorUrl') private ranSimulatorUrl: string) {
        this.trafficClient = new TrafficClient(ranSimulatorUrl);

        console.log('ran-simulator grpc-web Url ', ranSimulatorUrl);
    }

    requestGetMapLayout(): Observable<MapLayout> {
        const getMapLayoutObs = new Observable<MapLayout>( (observer: Subscriber<MapLayout>) => {
            const call = this.trafficClient.getMapLayout(new MapLayoutRequest(), {}, ((err, response) => {
                if (err) {
                    observer.error(err);
                } else {
                    observer.next(response);
                }
                call.on('error', (error: grpcWeb.Error) => {
                    observer.error(error);
                });
                call.on('end', () => {
                    observer.complete();
                });
            }));
        });
        return getMapLayoutObs;
    }

    requestListCells(asStream: boolean): Observable<ListCellsResponse> {
        const req = new ListCellsRequest();
        req.setSubscribe(asStream);
        const stream = this.trafficClient.listCells(req, {});

        const listTowersObs = new Observable<ListCellsResponse>((observer: Subscriber<ListCellsResponse>) => {
            stream.on('data', (tower: ListCellsResponse) => {
                observer.next(tower);
            });
            stream.on('error', (error: grpcWeb.Error) => {
                observer.error(error);
            });
            stream.on('end', () => {
                observer.complete();
            });
            // stream.on('status', (status: grpcWeb.Status) => {
            //     console.log('ListTowersRequest status', status.code, status.details, status.metadata);
            // });
            return () => stream.cancel();
        });
        return listTowersObs;
    }

    requestListRoutes(asStream: boolean): Observable<ListRoutesResponse> {
        const routeReq = new ListRoutesRequest();
        routeReq.setSubscribe(asStream);
        routeReq.setWithoutreplay(false);
        const stream = this.trafficClient.listRoutes(routeReq, {});

        const listRoutesObs = new Observable<ListRoutesResponse>((observer: Subscriber<ListRoutesResponse>) => {
            stream.on('data', (resp: ListRoutesResponse) => {
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

        return listRoutesObs;
    }

    requestListUes(asStream: boolean): Observable<ListUesResponse> {
        const ueReq = new ListUesRequest();
        ueReq.setSubscribe(asStream);
        ueReq.setWithoutreplay(false);
        const stream = this.trafficClient.listUes(ueReq, {});

        const listUesObs = new Observable<ListUesResponse>((observer: Subscriber<ListUesResponse>) => {
            stream.on('data', (resp: ListUesResponse) => {
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

        return listUesObs;
    }

    requestSetNumUes(numUEs: number): Observable<SetNumberUEsResponse> {
        const req = new SetNumberUEsRequest();
        req.setNumber(numUEs);
        const setNumUeObs = new Observable<SetNumberUEsResponse>((observer: Subscriber<SetNumberUEsResponse>) => {
            const call = this.trafficClient.setNumberUEs(req, {}, (err, resp) => {
                if (err) {
                    observer.error(err);
                } else {
                    observer.next(resp);
                }
                call.on('error', (error: grpcWeb.Error) => {
                    observer.error(error);
                });
                call.on('end', () => {
                    observer.complete();
                });
            });
        });
        return setNumUeObs;
    }
}

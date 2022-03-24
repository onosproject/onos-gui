/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {Inject, Injectable} from '@angular/core';
import * as grpcWeb from 'grpc-web';
import {Observable, Subscriber} from 'rxjs';
import {ConfigModelRegistryServiceClient} from './onos/configmodel/RegistryServiceClientPb';
import {ListModelsRequest, ListModelsResponse} from './onos/configmodel/registry_pb';

@Injectable()
export class ConfigModelRegistryService {

    registryServiceClient: ConfigModelRegistryServiceClient;

    constructor(
        private idToken: string,
        private onosConfigUrl: string
    ) {
        this.registryServiceClient = new ConfigModelRegistryServiceClient(onosConfigUrl);

        console.log('ConfigModel Registry Url ', onosConfigUrl);
    }

    requestList(): Observable<ListModelsResponse> {
        const listModelsRequest = new ListModelsRequest();
        console.log('Listing models');
        const listObs = new Observable<ListModelsResponse>((observer: Subscriber<ListModelsResponse>) => {
            const call = this.registryServiceClient.listModels(listModelsRequest, {
                Authorization: 'Bearer ' + this.idToken,
            }, (err, resp) => {
                if (err) {
                    observer.error(err);
                } else {
                    observer.next(resp);
                }
            });
            call.on('error', (error: grpcWeb.Error) => {
                observer.error(error);
            });
            call.on('end', () => {
                observer.complete();
            });
            call.on('status', (status: grpcWeb.Status) => {
                console.log('Compact changes status', status.code, status.details, status.metadata);
            });
        });
        return listObs;
    }
}

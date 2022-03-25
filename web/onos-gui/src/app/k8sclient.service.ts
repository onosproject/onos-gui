/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {from, Observable} from 'rxjs';
import {pluck, mergeMap, map} from 'rxjs/operators';
import {Meta} from '@angular/platform-browser';

const namespacesResource = '/api/v1/namespaces';
const serviceResource = '/services';

export interface K8sServicesMetadata {
    name: string;
    namespace: string;
    selfLink: string;
    uid: string;
    resourceVersion: string;
    creationTimestamp: string;
    labels: any;
}

export interface K8sServicesItem {
    metadata: K8sServicesMetadata;
    spec: any;
}

interface K8sServices {
    kind: string;
    apiVersion: string;
    metadata: K8sServicesMetadata;
    items: K8sServicesItem[];
}

@Injectable({
    providedIn: 'root'
})
export class K8sClientService {
    namespace: string;

    constructor(
        @Inject('kubernetes_api_proxy') private kubernetesApiUrl: string,
        private http: HttpClient,
        private meta: Meta,
    ) {
        const nsMeta = this.meta.getTag('name=namespace');
        this.namespace = nsMeta.content;
        console.log('Constructing k8s Client service', this.namespace, kubernetesApiUrl);
    }

    // Returns an observable of names of services running in the Kubernetes namespace
    // The 'get' returns a single JSON reply, from which we extract the items array
    // Then each item in the array is turned in to an Observable value
    // Finally the name is extracted from this Item
    monitorRunningServices(): Observable<string> {
        const fullUrl: string = this.kubernetesApiUrl + namespacesResource + '/' + this.namespace + serviceResource;
        return this.http.get<K8sServices>(fullUrl).pipe(
            pluck('items'),
            mergeMap((items: K8sServicesItem[]) => from(items)),
            map((item: K8sServicesItem) => item.metadata.name)
        );
    }
}

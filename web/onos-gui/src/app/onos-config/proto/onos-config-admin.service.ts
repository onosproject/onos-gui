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
    ConfigAdminServiceClient
} from './github.com/onosproject/onos-config/api/admin/AdminServiceClientPb';
import {
    CompactChangesRequest, CompactChangesResponse,
    ListModelsRequest, ListSnapshotsRequest,
    ModelInfo,
    RollbackRequest,
    RollbackResponse
} from './github.com/onosproject/onos-config/api/admin/admin_pb';
import * as grpcWeb from 'grpc-web';
import {Snapshot} from './github.com/onosproject/onos-config/api/types/snapshot/device/types_pb';
import * as google_protobuf_duration_pb from 'google-protobuf/google/protobuf/duration_pb';
import {Observable, Subscriber} from 'rxjs';
import {LoggedinService} from '../../loggedin.service';

@Injectable()
export class OnosConfigAdminService {

    adminServiceClient: ConfigAdminServiceClient;

    constructor(
        @Inject('loggedinService') public loggedinService: LoggedinService,
        private onosConfigUrl: string
    ) {
        this.adminServiceClient = new ConfigAdminServiceClient(onosConfigUrl);

        console.log('Config Admin Url ', onosConfigUrl);
    }

    requestRollback(nwChangeName: string, rollbackComment?: string): Observable<RollbackResponse> {
        const rollbackReq = new RollbackRequest();
        rollbackReq.setName(nwChangeName);
        if (rollbackComment) {
            rollbackReq.setComment(rollbackComment);
        } else {
            rollbackReq.setComment('Rolled back from GUI');
        }
        const rollbackObs = new Observable<RollbackResponse>((observer: Subscriber<RollbackResponse>) => {
            const call = this.adminServiceClient.rollbackNetworkChange(rollbackReq, {
                Authorization: 'Bearer ' + this.loggedinService.idToken,
            }, (err, resp) => {
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
                call.on('status', (status: grpcWeb.Status) => {
                    console.log('Rollback status', status.code, status.details, status.metadata);
                });
            });
        });
        console.log('network change', nwChangeName, 'rolled back');
        return rollbackObs;
    }

    requestListRegisteredModels(): Observable<ModelInfo> {
        const modelRequest = new ListModelsRequest();
        modelRequest.setVerbose(true);
        const stream = this.adminServiceClient.listRegisteredModels(modelRequest, {
            Authorization: 'Bearer ' + this.loggedinService.idToken,
        });
        console.log('ListRegisteredModels sent to', this.onosConfigUrl);

        const modelsObs = new Observable<ModelInfo>((observer: Subscriber<ModelInfo>) => {
            stream.on('data', (modelInfo: ModelInfo) => {
                observer.next(modelInfo);
            });
            stream.on('error', (error: grpcWeb.Error) => {
                observer.error(error);
            });
            stream.on('end', () => {
                observer.complete();
            });
            return () => stream.cancel();
        });
        return modelsObs;
    }

    requestSnapshots(wildcard: string): Observable<Snapshot> {
        const snapshotsRequest = new ListSnapshotsRequest();
        snapshotsRequest.setSubscribe(true);
        snapshotsRequest.setId(wildcard);
        const stream = this.adminServiceClient.listSnapshots(
            snapshotsRequest, {
                Authorization: 'Bearer ' + this.loggedinService.idToken,
            }
        );
        console.log('ListSnapshots sent to', this.onosConfigUrl);

        const snapshotObs = new Observable<Snapshot>((observer: Subscriber<Snapshot>) => {
            stream.on('data', (snapshot: Snapshot) => {
                observer.next(snapshot);
            });
            stream.on('error', (error: grpcWeb.Error) => {
                observer.error(error);
            });
            stream.on('end', () => {
                observer.complete();
            });
            return () => stream.cancel();
        });
        return snapshotObs;
    }

    requestCompactChanges(retensionSecs: number): Observable<CompactChangesResponse> {
        const retentionDuration = new google_protobuf_duration_pb.Duration();
        retentionDuration.setSeconds(retensionSecs);
        const compactRequest = new CompactChangesRequest();
        compactRequest.setRetentionPeriod(retentionDuration);
        console.log('Compacting changes older than', retensionSecs, 'second(s)');
        const compactchangesObs = new Observable<CompactChangesResponse>((observer: Subscriber<CompactChangesResponse>) => {
            const call = this.adminServiceClient.compactChanges(compactRequest, {
                Authorization: 'Bearer ' + this.loggedinService.idToken,
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
        return compactchangesObs;
    }
}

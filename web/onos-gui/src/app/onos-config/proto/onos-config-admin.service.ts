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
} from './github.com/onosproject/onos-config/api/admin/adminServiceClientPb';
import {
    CompactChangesRequest, CompactChangesResponse,
    ListModelsRequest, ListSnapshotsRequest,
    ModelInfo,
    RegisterResponse, RollbackRequest,
    RollbackResponse
} from './github.com/onosproject/onos-config/api/admin/admin_pb';
import * as grpcWeb from 'grpc-web';
import {Snapshot} from './github.com/onosproject/onos-config/api/types/snapshot/device/types_pb';
import * as google_protobuf_duration_pb from 'google-protobuf/google/protobuf/duration_pb';

// type NetChangeCallback = (r: NetChange) => void;
type ModelInfoCallback = (r: ModelInfo) => void;
type RollbackCallback = (e: grpcWeb.Error, r: RollbackResponse) => void;
type SnapshotCallback = (r: Snapshot) => void;
type CompactChangeCallback = (e: grpcWeb.Error, r: CompactChangesResponse) => void;

@Injectable()
export class OnosConfigAdminService {

    adminServiceClient: ConfigAdminServiceClient;

    constructor(@Inject('onosConfigUrl') private onosConfigUrl: string) {
        this.adminServiceClient = new ConfigAdminServiceClient(onosConfigUrl);

        console.log('Config Admin Service Connecting to ', onosConfigUrl);
    }

    requestRollback(nwChangeName: string, callback: RollbackCallback, rollbackComment?: string) {
        const rollbackReq = new RollbackRequest();
        rollbackReq.setName(nwChangeName);
        if (rollbackComment) {
            rollbackReq.setComment('Rolled back from GUI');
        }

        this.adminServiceClient.rollbackNetworkChange(rollbackReq, {}, callback);
        console.log('network change', nwChangeName, 'rolled back');
    }

    requestListRegisteredModels(callback: ModelInfoCallback) {
        const modelRequest = new ListModelsRequest();
        modelRequest.setVerbose(true);
        const stream = this.adminServiceClient.listRegisteredModels(modelRequest, {});
        console.log('ListRegisteredModels sent to', this.onosConfigUrl);
        stream.on('data', callback);
    }

    requestDeviceSnapshots(callback: SnapshotCallback) {
        const stream = this.adminServiceClient.listSnapshots(new ListSnapshotsRequest(), {});
        console.log('ListSnapshots sent to', this.onosConfigUrl);
        stream.on('data', callback);
    }

    requestCompactChanges(retensionSecs: number, callback: CompactChangeCallback) {
        const retentionDuration = new google_protobuf_duration_pb.Duration();
        retentionDuration.setSeconds(retensionSecs);
        const compactRequest = new CompactChangesRequest();
        compactRequest.setRetentionPeriod(retentionDuration);
        console.log('Compacting changes', retensionSecs);
        this.adminServiceClient.compactChanges(compactRequest, {}, callback);
    }
}

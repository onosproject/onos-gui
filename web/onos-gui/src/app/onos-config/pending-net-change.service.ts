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

import {Injectable} from '@angular/core';
import {
    ConfigChange,
    NetChange
} from './proto/github.com/onosproject/onos-config/pkg/northbound/admin/admin_pb';
import {Configuration} from './proto/github.com/onosproject/onos-config/pkg/northbound/diags/diags_pb';
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb';

export const PENDING = 'pending';
export const PENDING_U = 'Pending';

@Injectable({
    providedIn: 'root'
})
export class PendingNetChangeService {
    hasPendingChange: boolean = false;
    pendingNetChange: NetChange = undefined;
    pendingNewConfigName: string = undefined; // Only one can be added in a net change
    pendingNewConfiguration: Configuration;

    constructor() {
        this.pendingNetChange = new NetChange();
        this.pendingNetChange.setName(PENDING_U);
        this.pendingNetChange.setChangesList(Array(0));
        console.log('PendingNetChangeService constructed');
    }

    addPendingChange(pendingName?: string) {
        if (!this.hasPendingChange) {
            this.hasPendingChange = true;
            if (pendingName) {
                this.pendingNetChange.setName(pendingName);
            }
        }
    }

    addNewConfig(prefix: string, version: string, deviceType: string): string {
        const configName = prefix + '-' + version;
        if (this.pendingNewConfigName !== undefined) {
            console.log('Already have 1 new config in pending', configName, 'Rejected');
        }
        const now = Date.now();
        const nowTs = new google_protobuf_timestamp_pb.Timestamp();
        nowTs.setSeconds(now / 1000);
        this.pendingNewConfigName = configName;
        this.pendingNewConfiguration = new Configuration();
        this.pendingNewConfiguration.setName(configName);
        this.pendingNewConfiguration.setDeviceType(deviceType);
        this.pendingNewConfiguration.setVersion(version);
        this.pendingNewConfiguration.setDeviceId(prefix);
        this.pendingNewConfiguration.setCreated(nowTs);
        this.pendingNewConfiguration.setUpdated(nowTs);
        this.pendingNewConfiguration.setChangeIdsList(Array(1).fill(PENDING));
        this.pendingNewConfiguration['name'] = configName; // The key attribute for selection
        this.pendingNewConfiguration['version'] = version; // Needed to search by version
        this.pendingNewConfiguration['devicetype'] = deviceType; // Needed to search by devicetype
        this.pendingNewConfiguration['deviceid'] = prefix; // Needed to search by deviceid
        this.pendingNewConfiguration['pending'] = true;
        this.pendingNewConfiguration['created'] = now;
        this.pendingNewConfiguration['updated'] = now;
        console.log('New config created in pending', configName, prefix, version, deviceType, now, nowTs);
        const cc = new ConfigChange();
        cc.setId(configName);
        cc.setHash(PENDING);
        this.pendingNetChange.getChangesList().push(cc);
        return configName;
    }

    addToPendingChange(configName: string, path: string): boolean {
        if (!this.hasPendingChange) {
            return false;
        }
        const exists = this.pendingNetChange.getChangesList().filter(ch => ch.getId() === path);
        if (exists.length === 0) {
            const cc = new ConfigChange();
            cc.setId(configName);
            cc.setHash(PENDING);
            this.pendingNetChange.getChangesList().push(cc);
            console.log('Pending layer started with', path);
        } else {
            console.log('Pending layer extended with', path);
        }
    }

    deletePendingChange() {
        this.hasPendingChange = false;
        const name = this.pendingNetChange.getName();
        this.pendingNetChange = undefined;
        this.pendingNewConfigName = undefined;
        this.pendingNewConfiguration = undefined;
        console.log('Pending change deleted', name);
    }
}

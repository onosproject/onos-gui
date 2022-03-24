/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {Injectable} from '@angular/core';
import {
    ChangeValue,
    ChangeValueType,
    ConfigChange,
    NetChange
} from './proto/github.com/onosproject/onos-config/pkg/northbound/admin/admin_pb';
import {Configuration} from './proto/github.com/onosproject/onos-config/pkg/northbound/diags/diags_pb';
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb';
import {
    Path,
    PathElem,
    TypedValue,
    Update
} from './proto/github.com/openconfig/gnmi/proto/gnmi/gnmi_pb';
import {ChangeValueUtil, ValueDetails} from './change-value.util';
import {PathUtil} from './path.util';

export const PENDING = 'pending';
export const PENDING_U = 'Pending';

@Injectable({
    providedIn: 'root'
})
export class PendingNetChangeService {
    hasPendingChange: boolean = false;
    pendingNetChange: NetChange = undefined;
    pendingConfigValues: Map<string, Array<ChangeValue>>;
    pendingNewConfiguration: Configuration;

    constructor() {
        this.pendingNetChange = new NetChange();
        this.pendingNetChange.setName(PENDING_U);
        this.pendingNetChange.setChangesList(Array(0));
        this.pendingConfigValues = new Map<string, Array<ChangeValue>>();
        this.pendingNewConfiguration = undefined;
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
        const configExists = this.pendingNetChange.getChangesList().findIndex(ch => ch.getId() === configName);
        if (configExists > -1) {
            console.log('Config', configName, 'already exists in pending. Rejected');
            return;
        } else if (this.pendingNewConfiguration !== undefined) {
            console.log('Already have 1 new config in pending', this.pendingNewConfiguration.getName(), 'Rejected');
            return;
        }
        const now = Date.now();
        const nowTs = new google_protobuf_timestamp_pb.Timestamp();
        nowTs.setSeconds(now / 1000);
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

    addToPendingChange(configName: string, changeValue: ChangeValue): boolean {
        if (!this.hasPendingChange) {
            return false;
        }
        const exists = this.pendingNetChange.getChangesList().findIndex(ch => ch.getId() === configName);
        if (exists < 0) {
            const cc = new ConfigChange();
            cc.setId(configName);
            cc.setHash(PENDING);
            this.pendingNetChange.getChangesList().push(cc);
            console.log('Pending layer started with', changeValue.getPath());
        } else {
            console.log('Pending layer extended with', changeValue.getPath());
        }
        if (this.pendingConfigValues.get(configName) === undefined) {
            this.pendingConfigValues.set(configName, Array(1).fill(changeValue));
            return true;
        } else {
            this.pendingConfigValues.get(configName).push(changeValue);
            return false;
        }
    }

    deletePendingChange() {
        const name = this.pendingNetChange.getName();
        this.hasPendingChange = false;
        this.pendingNetChange = new NetChange();
        this.pendingNetChange.setName(PENDING_U);
        this.pendingNetChange.setChangesList(Array(0));
        this.pendingConfigValues = new Map<string, Array<ChangeValue>>();
        this.pendingNewConfiguration = undefined;
        console.log('Pending change deleted', name);
    }

    generateUpdates(): Array<Update> {
        const updates = Array<Update>(0);

        this.pendingConfigValues.forEach((changeValues: Array<ChangeValue>, configName: string) => {
            console.log('Creating gnmiUpdate for', configName, ' #Updates', changeValues.length);

            changeValues.forEach((cv: ChangeValue) => {
                const gnmiUpdate = new Update();
                const strValue = ChangeValueUtil.transform(<ValueDetails>{
                    value: cv.getValue(),
                    valueType: cv.getValueType(),
                    valueTypeOpts: cv.getTypeOptsList()
                }, 40);
                console.log('Adding', cv.getPath(), strValue);
                const gnmiPath = new Path();

                // have to extract the target name from the config name
                const targetName = configName.slice(0, configName.lastIndexOf('-'));
                gnmiPath.setTarget(targetName);
                const elemList = PathUtil.strPathToParts(cv.getPath());
                const gnmiElems = this.toGnmiPathElems(elemList);
                gnmiPath.setElemList(gnmiElems);

                gnmiUpdate.setPath(gnmiPath);
                const gnmiValue = new TypedValue();
                if (cv.getValueType() === ChangeValueType.STRING) {
                    gnmiValue.setStringVal(strValue[0]);
                }
                gnmiUpdate.setVal(gnmiValue);
                updates.push(gnmiUpdate);
            });
        });

        return updates;
    }

    toGnmiPathElems(txtPathElems: string[]): Array<PathElem> {
        const gnmiElemList = Array<PathElem>(0);
        for (const p of txtPathElems) {
            const e = new PathElem();
            const brktStart = p.indexOf('[');
            if (brktStart < 0) {
                e.setName(p);
            } else {
                const keyStr = p.slice(brktStart + 1, p.indexOf(']'));
                const keyPairs = keyStr.split(',');
                const gnmiKp = e.getKeyMap();
                for (const kp of keyPairs) {
                    const kv = kp.split('=');
                    if (kv.length === 2) {
                        gnmiKp.set(kv[0], kv[1]);
                    }
                }
                e.setName(p.slice(0, brktStart));
            }
            gnmiElemList.push(e);
        }

        return gnmiElemList;
    }
}

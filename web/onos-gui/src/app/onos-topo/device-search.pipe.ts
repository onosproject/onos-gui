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

import { Pipe, PipeTransform } from '@angular/core';
import { Device } from './proto/github.com/onosproject/onos-topo/api/device/device_pb';

@Pipe({
    name: 'deviceSearch',
    pure: false
})

export class DeviceSearchPipe implements PipeTransform {

    transform(devices: Map<String, Device>, queryBy: string, queryStr: string): any {
        console.log(queryBy + ' ' + queryStr);
        const filtered = new Map<String, Device>();
        if (!devices) {
            return devices;
        }
        if (!queryStr || queryStr === ' ' || !queryBy || queryBy === ' ') {
            return devices;
        }

        queryStr = queryStr.toLowerCase();
        const items = Array.from(devices.entries());
        items.filter(it => {
            switch (queryBy) {
                case 'id':
                    if (it[1].getId().toLowerCase().includes(queryStr)) {
                        filtered.set(it[0], it[1]);
                    }
                    break;
                case 'display':
                    if (it[1].getDisplayname().toLowerCase().includes(queryStr)) {
                        filtered.set(it[0], it[1]);
                    }
                    break;
                case 'version':
                    if (it[1].getVersion().toLowerCase().includes(queryStr)) {
                        filtered.set(it[0], it[1]);
                    }
                    break;
                case 'type':
                    if (it[1].getType().toLowerCase().includes(queryStr)) {
                        filtered.set(it[0], it[1]);
                    }
                    break;
                case 'address':
                    if (it[1].getAddress().toLowerCase().includes(queryStr)) {
                        filtered.set(it[0], it[1]);
                    }
                    break;
                case 'revision':
                    if (Number(queryStr)) {
                        if (it[1].getRevision() === Number(queryStr)) {
                            filtered.set(it[0], it[1]);
                        }
                    }
                    break;
                case 'target':
                    if (it[1].getTarget().includes(queryStr)) {
                        filtered.set(it[0], it[1]);
                    }
                    break;
                case 'timeout':
                    if (it[1].getTimeout().includes(queryStr)) {
                        filtered.set(it[0], it[1]);
                    }
                    break;
                default:
            }
        }
        );

        return filtered;
    }

}

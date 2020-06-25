/*
 * Copyright 2018-present Open Networking Foundation
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
import { Device } from '../onos-topo/proto/github.com/onosproject/onos-topo/api/device/device_pb';
import { TableFilter } from 'gui2-fw-lib';
// import { TableFilter } from './table.base';

/**
 * Only return the tabledata that matches filtering with some queries
 *
 * Note: the pipe is marked pure here as we need to filter on the
 * content of the filter object (it's not a primitive type)
 */
@Pipe({
    name: 'filter',
    pure: false
})
export class DeviceFilterPipe implements PipeTransform {
    /**
     * From an array of table items just return those that match the filter
     */
    transform(items: Map<String, Device>, tableDataFilter: TableFilter): Map<String, Device> {
        if (!items) {
            return new Map<String, Device>();
        }
        if (!tableDataFilter.queryStr) {
            return items;
        }

        const queryStr = tableDataFilter.queryStr.toLowerCase();

        // let filtered = new Map(items.entries().filter(([key, value]) => key >= 0));

        // unimplemented

        return new Map<String, Device>();
    }
}

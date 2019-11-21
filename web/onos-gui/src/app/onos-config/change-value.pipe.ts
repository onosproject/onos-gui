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

import {Pipe, PipeTransform} from '@angular/core';
import {ValueType} from './proto/github.com/onosproject/onos-config/api/types/change/device/types_pb';
import {ChangeValueUtil, ValueDetails} from './change-value.util';

@Pipe({
    name: 'changeValue',
    pure: false
})
export class ChangeValuePipe implements PipeTransform {

    // transform is the main API to call a pipe with
    transform(value: Uint8Array, valueType: ValueType, valueTypeOpts: Array<number>, maxLen: number = 15): string[] {
        if (value === null || value === undefined || value.length === 0) {
            return [];
        }
        return ChangeValueUtil.transform(<ValueDetails>{
            value: value,
            valueType: valueType,
            valueTypeOpts: valueTypeOpts,
        }, maxLen);
    }
}

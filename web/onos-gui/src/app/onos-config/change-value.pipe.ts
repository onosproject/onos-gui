/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {Pipe, PipeTransform} from '@angular/core';
import {
    TypedValue,
} from '../onos-api/onos/config/change/device/types_pb';
import {ChangeValueUtil} from './change-value.util';

@Pipe({
    name: 'changeValue',
    pure: false
})
export class ChangeValuePipe implements PipeTransform {

    // transform is the main API to call a pipe with
    transform(value: TypedValue, maxLen: number = 15): string[] {
        if (value === null || value === undefined || value.getBytes().length === 0) {
            return [];
        }
        return ChangeValueUtil.transform(value, maxLen);
    }
}

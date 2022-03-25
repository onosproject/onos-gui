/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {Pipe, PipeTransform} from '@angular/core';
import {Status} from '../onos-api/onos/config/change/types_pb';
import {StatusUtil} from './status.util';

@Pipe({
    name: 'changeStatus',
    pure: false
})
export class ChangeStatusPipe implements PipeTransform {

    transform(status: Status, args?: number[]): string[] {
        if (status === undefined || status === null) {
            return undefined;
        }
        const statusStrings =  StatusUtil.statusToStrings(status);

        if (args === undefined) {
            return statusStrings;
        }
        const result = new Array<string>();
        args.forEach((n: number) => {
            result.push(statusStrings[n]);
        });
        return result;
    }

}

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

import {TestBed} from '@angular/core/testing';

import {ChangeValueUtil, ValueDetails} from './change-value.util';
import {ChangeValueType} from './proto/github.com/onosproject/onos-config/pkg/northbound/admin/admin_pb';

describe('ChangeValueService', () => {
    const enc = new TextEncoder();

    beforeEach(() => {
            TestBed.configureTestingModule({
            });
        }
    );

    it('String value', () => {
        const ab = new ArrayBuffer(4);
        const stringArray = new Uint8Array(ab);
        stringArray[0] = 79;
        stringArray[1] = 78;
        stringArray[2] = 79;
        stringArray[3] = 83;

        const value = <ValueDetails>{
            value: stringArray,
            valueType: ChangeValueType.STRING,
            valueTypeOpts: Array(0),
        };

        const values = ChangeValueUtil.transform(value);
        // We're expecting 'ONOS'
        expect(values.length).toBe(1);
        expect(values[0].length).toEqual(4);
        expect(values[0]).toEqual('ONOS');
    });

    it('Long String value', () => {
        const ab = new ArrayBuffer(40);
        const stringArray = enc.encode('This is a test value that should be truncated'); // 45 long
        const value = <ValueDetails>{
            value: stringArray,
            valueType: ChangeValueType.STRING,
            valueTypeOpts: Array(0),
        };

        const values = ChangeValueUtil.transform(value);
        expect(values.length).toBe(1);
        expect(values[0].length).toEqual(17);
        expect(values[0]).toEqual('This is a test...');
    });

    it('Leaf list String value', () => {
        const ab = new ArrayBuffer(40);
        const stringArray = enc.encode('item1\nitem2\nitem3');
        const value = <ValueDetails>{
            value: stringArray,
            valueType: ChangeValueType.LEAFLIST_STRING,
            valueTypeOpts: Array(0),
        };
        const values = ChangeValueUtil.transform(value);
        expect(values.length).toBe(3);
        expect(values[0].length).toEqual(5);
        expect(values[0]).toEqual('item1');
        expect(values[1].length).toEqual(5);
        expect(values[1]).toEqual('item2');
        expect(values[2].length).toEqual(5);
        expect(values[2]).toEqual('item3');
    });

    it('Int value', () => {
        const ab = new ArrayBuffer(8);
        const intArr = new Uint8Array(ChangeValueUtil.longToByteArray(12345678));
        const value = <ValueDetails>{
            value: intArr,
            valueType: ChangeValueType.INT,
            valueTypeOpts: Array(0),
        };
        const values = ChangeValueUtil.transform(value);
        expect(values.length).toBe(1);
        expect(values[0].length).toBe(8);
        expect(values[0]).toEqual('12345678');
    });
});

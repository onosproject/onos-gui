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

import {ChangeValueUtil} from './change-value.util';
import {
    TypedValue,
    ValueType
} from './proto/github.com/onosproject/onos-config/api/types/change/device/types_pb';

describe('ChangeValueUtil', () => {
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

        const value = new TypedValue();
        value.setBytes(stringArray);
        value.setType(ValueType.STRING);
        value.setTypeOptsList(Array(0));
        const values = ChangeValueUtil.transform(value);
        // We're expecting 'ONOS'
        expect(values.length).toBe(1);
        expect(values[0].length).toEqual(4);
        expect(values[0]).toEqual('ONOS');
    });

    it('Long String value', () => {
        const ab = new ArrayBuffer(40);
        const stringArray = enc.encode('This is a test value that should be truncated'); // 45 long
        const value = new TypedValue();
        value.setBytes(stringArray);
        value.setType(ValueType.STRING);
        value.setTypeOptsList(Array(0));
        const values = ChangeValueUtil.transform(value);
        expect(values.length).toBe(1);
        expect(values[0].length).toEqual(17);
        expect(values[0]).toEqual('This is a test...');
    });

    it('Leaf list String value', () => {
        const ab = new ArrayBuffer(40);
        const stringArray = enc.encode('item1\nitem2\nitem3');
        const value = new TypedValue();
        value.setBytes(stringArray);
        value.setType(ValueType.LEAFLIST_STRING);
        value.setTypeOptsList(Array(0));
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
        const intArr = new Uint8Array(ChangeValueUtil.longToByteArray(12345678));
        const value = new TypedValue();
        value.setBytes(intArr);
        value.setType(ValueType.INT);
        value.setTypeOptsList(Array(0));
        const values = ChangeValueUtil.transform(value);
        expect(values.length).toBe(1);
        expect(values[0].length).toBe(8);
        expect(values[0]).toEqual('12345678');
    });

    it('UInt value', () => {
        const uint8Array = new Uint8Array([0xC, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0]);
        const value = new TypedValue();
        value.setBytes(uint8Array);
        value.setType(ValueType.UINT);
        value.setTypeOptsList(Array(0));
        const values = ChangeValueUtil.transform(value);
        expect(values.length).toBe(1);
        expect(values[0].length).toBe(2);
        expect(values[0]).toEqual('12');
    });

    it('Float value', () => {
        const intArr = new Uint8Array(ChangeValueUtil.floatToByteArray(2.1));
        const value = new TypedValue();
        value.setBytes(intArr);
        value.setType(ValueType.FLOAT);
        value.setTypeOptsList(Array(0));
        const values = ChangeValueUtil.transform(value);
        expect(values.length).toBe(1);
        expect(values[0].length).toBe(3);
        expect(values[0]).toEqual('2.1');
    });
});

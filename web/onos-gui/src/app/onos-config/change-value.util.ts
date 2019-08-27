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

import {ChangeValueType} from './proto/github.com/onosproject/onos-config/pkg/northbound/admin/admin_pb';

export interface ValueDetails {
    value: Uint8Array;
    valueType: ChangeValueType;
    valueTypeOpts: Array<number>;
}

/**
 * Just a utility class that transforms Value type to strings
 */
export class ChangeValueUtil {

    // transform is the main API to call a pipe with
    public static transform(value: ValueDetails, maxLen: number = 15): string[] {
        const dec = new TextDecoder(); // always utf-8

        if (value === undefined || value.value === undefined || value.value.length === 0) {
            return [];
        }
        let valueStrings: string[] = [];
        const dataIsLittleEndian = true;
        switch (value.valueType) {
            case ChangeValueType.BOOL:
                valueStrings = [value[0] ? 'true' : 'false'];
                break;
            case ChangeValueType.INT:
                const view1 = new DataView(value.value.buffer, 0, 8);
                valueStrings = [String(view1.getInt32(0, dataIsLittleEndian))];
                break;
            case ChangeValueType.UINT:
                const view2 = new DataView(value.value.buffer, 0, 8);
                valueStrings = [String(view2.getUint32(0, dataIsLittleEndian))];
                break;
            case ChangeValueType.FLOAT:
                const view3 = new DataView(value.value.buffer, 0, 8);
                valueStrings = [String(view3.getFloat32(0, dataIsLittleEndian))];
                break;
            case ChangeValueType.LEAFLIST_STRING:
                const leafList = dec.decode(value.value);
                valueStrings = leafList.split('\n');
                break;
            default: // Treat as string
                const str = dec.decode(value.value);
                valueStrings = [str.trim()];
        }
        for (const idx in valueStrings) {
            if (valueStrings[idx].length > maxLen && maxLen > 0) {
                valueStrings[idx] = valueStrings[idx].substr(0, maxLen).trim() + '...';
            }
        }
        return valueStrings;
    }

    // Inspired by https://stackoverflow.com/questions/8482309/converting-javascript-integer-to-byte-array-and-back
    public static longToByteArray (long: number): Uint8Array {
        // we want to represent the input as a 8-bytes array
        const byteArray = [0, 0, 0, 0, 0, 0, 0, 0];

        for ( let index = 0; index < byteArray.length; index ++ ) {
            const byte = long & 0xff;
            byteArray [ index ] = byte;
            long = (long - byte) / 256 ;
        }

        return new Uint8Array(byteArray);
    }

    public static byteArrayToLong(byteArray: Uint8Array): number {
        let value = 0;
        for ( let i = byteArray.length - 1; i >= 0; i--) {
            value = (value * 256) + byteArray[i];
        }

        return value;
    }
}

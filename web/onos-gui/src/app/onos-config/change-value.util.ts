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

import {ValueType} from './proto/github.com/onosproject/onos-config/api/types/change/device/types_pb';

export interface ValueDetails {
    value: Uint8Array;
    valueType: ValueType;
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
        const view = new DataView(value.value.buffer, value.value.byteOffset, value.value.byteLength);
        switch (value.valueType) {
            case ValueType.BOOL:
                valueStrings = (view.getInt8(0).valueOf() === 1) ? ['true'] : ['false'];
                break;
            case ValueType.INT:
                valueStrings = [String(view.getInt32(0, dataIsLittleEndian))];
                break;
            case ValueType.UINT:
                valueStrings = [String(view.getUint32(0, dataIsLittleEndian))];
                break;
            case ValueType.FLOAT:
                valueStrings = [String(view.getFloat64(0, dataIsLittleEndian))];
                break;
            case ValueType.LEAFLIST_STRING:
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
        const intArray = new Int32Array(1);
        intArray[0] = long;
        return new Uint8Array(intArray.buffer, 0, 4);
    }

    public static floatToByteArray (float: number): Uint8Array {
        // we want to represent the input as a 8-bytes array
        const floatArray = new Float64Array(1);
        floatArray[0] = float;
        return new Uint8Array(floatArray.buffer, 0, floatArray.buffer.byteLength);
    }
}

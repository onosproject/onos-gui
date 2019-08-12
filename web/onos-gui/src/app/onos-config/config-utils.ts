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

export class ConfigUtils {
    static valueAsString(bytes: Uint8Array, valueType: ChangeValueType): string {
        if (bytes === undefined || bytes.length === 0) {
            return '';
        }
        const view1 = new DataView(bytes.buffer, 0, 8);
        switch (valueType) {
            case ChangeValueType.BOOL:
                return bytes[0] ? 'true' : 'false';
            case ChangeValueType.INT:
                // TODO fix this for Int
                return String(view1.getInt32(0));
            case ChangeValueType.UINT:
                // TODO fix this for UInt
                return String(view1.getUint32(0));
            case ChangeValueType.FLOAT:
                // TODO fix this for Float
                return String(view1.getFloat32(0));
            default:
                return String.fromCharCode.apply(null, bytes);
        }
    }
}

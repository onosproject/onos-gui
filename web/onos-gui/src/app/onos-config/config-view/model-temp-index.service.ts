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

import {Injectable} from '@angular/core';
import {
    ModelInfo,
    ReadWritePath
} from '../proto/github.com/onosproject/onos-config/pkg/northbound/admin/admin_pb';

const EXTRACT_INDEX = /(=.+?[,\]])/;
const EXTRACT_INDEX_VALUE = /([^=,\]])+?/; // Causes ng test to stop running


/**
 * This is a service used to temporarily augment the RW paths of a model with
 * the indices of actual instance
 * e.g. if there is an interface [name=0/1] in some layer, then the RW paths
 * should list everything that's already under the interface [name=*] again
 * under this named interface.
 *
 * This is used by the layer-svg component
 * - the RW paths layer calls on addModelInfo() when it is loaded
 * - each one of the config layers calls on addIndex() with its real paths
 * - when RW Paths layer is made visible it calls on calculateExtraPaths()
 * - when the ConfigViewComponent is being destroyed - it calls clear all
 *
 * The service is not loaded until first used by a ConfigViewComponent
 * It stays alive even if this component is destroyed
 * It is reused again by other uses of the ConfigViewComponent
 **/
@Injectable()
export class ModelTempIndexService {

    indexNames: Array<string>;
    modelInfo: ModelInfo;
    extractIndex: RegExp;
    extractIndexValue: RegExp;

    constructor() {
        this.indexNames = Array(0);
        this.extractIndex = new RegExp(EXTRACT_INDEX, 'g');
        this.extractIndexValue = new RegExp(EXTRACT_INDEX_VALUE);
    }

    calculateExtraPaths(): Array<ReadWritePath> {
        const extraPaths = Array<ReadWritePath>(0);
        console.log('Calculating extra Model indices for',
            this.modelInfo.getName(), this.indexNames.length);

        this.indexNames.forEach((idxName) => {
            let match: string[];
            let idxNameWildcard = idxName;
            while (match = this.extractIndex.exec(idxName)) {
                const r1 = match[1].replace(/=.*,/, '=*,').replace(/=.*]/, '=*]');
                idxNameWildcard = idxNameWildcard.replace(match[1], r1);
            }
            this.modelInfo.getReadWritePathList().forEach((rwMp) => {
                if (rwMp.getPath().startsWith(idxNameWildcard)) {
                    const fullPath = rwMp.getPath().replace(idxNameWildcard, idxName);
                    const extraPath = new ReadWritePath();
                    extraPath.setPath(fullPath);
                    extraPath.setValueType(rwMp.getValueType());
                    extraPath.setDescription(rwMp.getDescription());
                    extraPath.setDefault(rwMp.getDefault());
                    extraPath.setLengthList(rwMp.getLengthList());
                    extraPath.setMandatory(rwMp.getMandatory());
                    extraPath.setRangeList(rwMp.getRangeList());
                    extraPath.setUnits(rwMp.getUnits());
                    extraPaths.push(extraPath);
                }
            });
        });
        return extraPaths;
    }

    clearAll() {
        const oldLen = this.indexNames.length;
        this.indexNames.length = 0;
        console.log('Model Index cleared', oldLen);
    }

    addIndex(abspath: string) {
        const hasIndex = abspath.lastIndexOf(']');
        const toLastIdx = abspath.slice(0, hasIndex + 1);
        if (hasIndex > 0 && !this.indexNames.includes(toLastIdx)) {
            this.indexNames.push(toLastIdx);
        }
    }

    addModelInfo(modelInfo: ModelInfo) {
        this.modelInfo = modelInfo;
    }
}

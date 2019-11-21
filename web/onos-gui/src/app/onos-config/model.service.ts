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
import {OnosConfigAdminService} from './proto/onos-config-admin.service';
import {
    ModelInfo,
} from './proto/github.com/onosproject/onos-config/api/admin/admin_pb';

@Injectable()
export class ModelService {
    modelInfoList: ModelInfo[] = [];

    constructor(private configAdminService: OnosConfigAdminService) {
        this.loadModelList();
    }

    loadModelList(): void {
        this.modelInfoList.length = 0;
        this.configAdminService.requestListRegisteredModels((modelInfo: ModelInfo) => {
            modelInfo['id'] = modelInfo.getName() + modelInfo.getVersion(); // To make it selectable
            modelInfo['name'] = modelInfo.getName(); // To make it selectable
            modelInfo['version'] = modelInfo.getVersion(); // To make it searchable by version
            modelInfo['numropaths'] = modelInfo.getReadOnlyPathList().length; // For display
            modelInfo['numrwpaths'] = modelInfo.getReadWritePathList().length; // For display
            modelInfo['numyangs'] = modelInfo.getModelDataList().length; // For display
            this.modelInfoList.push(modelInfo);
            console.log('Model info loaded', modelInfo.getName(), modelInfo.getVersion(), modelInfo.getModule(),
                modelInfo['numropaths'], modelInfo['numrwpaths'], modelInfo['numyangs']);
        });
    }
}

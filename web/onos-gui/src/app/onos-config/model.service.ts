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

import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ErrorCallback } from './device.service';
import {ConfigModelRegistryService} from '../onos-api/config-model-registry.service';
import {ConfigModel, ListModelsResponse} from '../onos-api/onos/configmodel/registry_pb';


@Injectable()
export class ModelService {
    modelInfoList: ConfigModel[] = [];
    modelInfoSub: Subscription;
    sortParams = {
        firstColName: 'name',
        firstCriteria: ModelService.modelSorterForward,
        firstCriteriaDir: 0
    };

    constructor(private configModelRegistryService: ConfigModelRegistryService) {
    }

    static modelSorterForward(a: ConfigModel, b: ConfigModel): number {
        return a < b ? -1 : (a > b) ? 1 : 0;
    }

    static modelSorterReverse(a: ConfigModel, b: ConfigModel): number {
        return a < b ? 1 : (a > b) ? -1 : 0;
    }

    sortParamsFirst(sortCriterion: string, sortDir: number) {
        sortDir === 0 ? (this.sortParams.firstCriteria = ModelService.modelSorterForward)
            : (this.sortParams.firstCriteria = ModelService.modelSorterReverse);
        this.sortParams.firstColName = sortCriterion;
        this.sortParams.firstCriteriaDir = sortDir;
    }

    switchSortCol(colName: string, direction: number): void {
        if (this.sortParams.firstColName === colName) {
            if (this.sortParams.firstCriteriaDir === 1) {
                return this.sortParamsFirst(colName, 0);
            } else {
                return this.sortParamsFirst(colName, 1);
            }
        } else {
            return this.sortParamsFirst(colName, direction);
        }
    }

    loadModelList(errCb: ErrorCallback): void {
        this.close();
        this.modelInfoList.length = 0;
        this.modelInfoSub = this.configModelRegistryService.requestList().subscribe(
            (listModelsResponse: ListModelsResponse) => {
                listModelsResponse.getModelsList().forEach((modelInfo: ConfigModel) => {
                    modelInfo['id'] = modelInfo.getName() + modelInfo.getVersion(); // To make it selectable
                    modelInfo['name'] = modelInfo.getName(); // To make it selectable
                    modelInfo['module'] = undefined; // To make it selectable
                    modelInfo['version'] = modelInfo.getVersion(); // To make it searchable by version
                    modelInfo['numyangs'] = modelInfo.getModulesList().length; // For display
                    this.modelInfoList.push(modelInfo);
                    console.log('Model info loaded', modelInfo.getName(), modelInfo.getVersion());
                });
            },
            (error) => {
                console.log('Error on list of Config Model Registry', error);
                errCb(error);
            });
    }

    close() {
        if (this.modelInfoSub) {
            this.modelInfoSub.unsubscribe();
        }
        console.log('Closed model service');
    }
}

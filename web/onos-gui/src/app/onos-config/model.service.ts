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
import { OnosConfigAdminService } from './proto/onos-config-admin.service';
import {
    ModelInfo,
} from './proto/github.com/onosproject/onos-config/api/admin/admin_pb';
import { Observable, Subscription } from 'rxjs';
import { ErrorCallback } from './device.service';


export enum ModelSortCriterion {
    NAME,
    VERSION,
    MODULE,
    NUMRWPATHS,
    NUMROPATHS,
    NUMYANGS
}

@Injectable()
export class ModelService {
    modelInfoList: ModelInfo[] = [];
    modelInfoSub: Subscription;
    modelSortColumn = ModelSortCriterion.NAME;
    sortParams = {
        firstCol: ModelSortCriterion.NAME,
        firstColName: 'name',
        firstCriteria: ModelService.modelSorterForward,
        firstCriteriaDir: 0,
        secondCol: ModelSortCriterion.VERSION,
        secondColName: 'version',
        secondCriteria: ModelService.modelSorterForward,
        secondCriteriaDir: 0,
    };

    constructor(private configAdminService: OnosConfigAdminService) {
    }

    static modelSorterForward(a: ModelInfo, b: ModelInfo): number {
        return a < b ? -1 : (a > b) ? 1 : 0;
    }

    static modelSorterReverse(a: ModelInfo, b: ModelInfo): number {
        return a < b ? 1 : (a > b) ? -1 : 0;
    }

    sortParamsFirst(sortCriterion: ModelSortCriterion, sortDir: number) {
        switch (sortCriterion * 2 | Number(sortDir).valueOf()) {
            case ModelSortCriterion.NAME * 2 | 1:
                console.log('in reverse NAME sort');
                this.sortParams.firstColName = 'name';
                this.sortParams.firstCriteria = ModelService.modelSorterReverse;
                this.sortParams.firstCriteriaDir = 1;
                break;
            case ModelSortCriterion.NAME * 2 | 0:
                console.log('in forward NAME sort');
                this.sortParams.firstColName = 'name';
                this.sortParams.firstCriteria = ModelService.modelSorterForward;
                this.sortParams.firstCriteriaDir = 0;
                break;
            case ModelSortCriterion.VERSION * 2 | 1:
                console.log('in reverse VERSION sort');
                this.sortParams.firstColName = 'version';
                this.sortParams.firstCriteria = ModelService.modelSorterReverse;
                this.sortParams.firstCriteriaDir = 1;
                break;
            case ModelSortCriterion.VERSION * 2 | 0:
                console.log('in forward VERSION sort');
                this.sortParams.firstColName = 'version';
                this.sortParams.firstCriteria = ModelService.modelSorterForward;
                this.sortParams.firstCriteriaDir = 0;
                break;
            case ModelSortCriterion.MODULE * 2 | 1:
                console.log('in reverse MODULE sort');
                this.sortParams.firstColName = 'module';
                this.sortParams.firstCriteria = ModelService.modelSorterReverse;
                this.sortParams.firstCriteriaDir = 1;
                break;
            case ModelSortCriterion.MODULE * 2 | 0:
                console.log('in forward MODULE sort');
                this.sortParams.firstColName = 'module';
                this.sortParams.firstCriteria = ModelService.modelSorterForward;
                this.sortParams.firstCriteriaDir = 0;
                break;
            case ModelSortCriterion.NUMRWPATHS * 2 | 1:
                console.log('in reverse NUMRWPATHS sort');
                this.sortParams.firstColName = 'numrwpaths';
                this.sortParams.firstCriteria = ModelService.modelSorterReverse;
                this.sortParams.firstCriteriaDir = 1;
                break;
            case ModelSortCriterion.NUMRWPATHS * 2 | 0:
                console.log('in forward NUMRWPATHS sort');
                this.sortParams.firstColName = 'numrwpaths';
                this.sortParams.firstCriteria = ModelService.modelSorterForward;
                this.sortParams.firstCriteriaDir = 0;
                break;
            case ModelSortCriterion.NUMROPATHS * 2 | 1:
                console.log('in reverse NUMROPATHS sort');
                this.sortParams.firstColName = 'numropaths';
                this.sortParams.firstCriteria = ModelService.modelSorterReverse;
                this.sortParams.firstCriteriaDir = 1;
                break;
            case ModelSortCriterion.NUMROPATHS * 2 | 0:
                console.log('in forward NUMROPATHS sort');
                this.sortParams.firstColName = 'numropaths';
                this.sortParams.firstCriteria = ModelService.modelSorterForward;
                this.sortParams.firstCriteriaDir = 0;
                break;
            case ModelSortCriterion.NUMYANGS * 2 | 1:
                console.log('in reverse NUMYANGS sort');
                this.sortParams.firstColName = 'numyangs';
                this.sortParams.firstCriteria = ModelService.modelSorterReverse;
                this.sortParams.firstCriteriaDir = 1;
                break;
            case ModelSortCriterion.NUMYANGS * 2 | 0:
                console.log('in forward NUMYANGS sort');
                this.sortParams.firstColName = 'numyangs';
                this.sortParams.firstCriteria = ModelService.modelSorterForward;
                this.sortParams.firstCriteriaDir = 0;
                break;
            default:
        }
    }

    sortParamsSecond(sortCriterion: ModelSortCriterion, sortDir: number) {
        switch (sortCriterion * 2 | Number(sortDir).valueOf()) {
            case ModelSortCriterion.NAME * 2 | 1:
                console.log('in reverse NAME sort');
                this.sortParams.secondColName = 'name';
                this.sortParams.secondCriteria = ModelService.modelSorterReverse;
                this.sortParams.secondCriteriaDir = 1;
                break;
            case ModelSortCriterion.NAME * 2 | 0:
                console.log('in forward NAME sort');
                this.sortParams.secondColName = 'name';
                this.sortParams.secondCriteria = ModelService.modelSorterForward;
                this.sortParams.secondCriteriaDir = 0;
                break;
            case ModelSortCriterion.VERSION * 2 | 1:
                console.log('in reverse VERSION sort');
                this.sortParams.secondColName = 'version';
                this.sortParams.secondCriteria = ModelService.modelSorterReverse;
                this.sortParams.secondCriteriaDir = 1;
                break;
            case ModelSortCriterion.VERSION * 2 | 0:
                console.log('in forward VERSION sort');
                this.sortParams.secondColName = 'version';
                this.sortParams.secondCriteria = ModelService.modelSorterForward;
                this.sortParams.firstCriteriaDir = 0;
                break;
            case ModelSortCriterion.MODULE * 2 | 1:
                console.log('in reverse MODULE sort');
                this.sortParams.secondColName = 'module';
                this.sortParams.secondCriteria = ModelService.modelSorterReverse;
                this.sortParams.secondCriteriaDir = 1;
                break;
            case ModelSortCriterion.MODULE * 2 | 0:
                console.log('in forward MODULE sort');
                this.sortParams.secondColName = 'module';
                this.sortParams.secondCriteria = ModelService.modelSorterForward;
                this.sortParams.secondCriteriaDir = 0;
                break;
            case ModelSortCriterion.NUMRWPATHS * 2 | 1:
                console.log('in reverse NUMRWPATHS sort');
                this.sortParams.secondColName = 'numrwpaths';
                this.sortParams.secondCriteria = ModelService.modelSorterReverse;
                this.sortParams.secondCriteriaDir = 1;
                break;
            case ModelSortCriterion.NUMRWPATHS * 2 | 0:
                console.log('in forward NUMRWPATHS sort');
                this.sortParams.secondColName = 'numrwpaths';
                this.sortParams.secondCriteria = ModelService.modelSorterForward;
                this.sortParams.secondCriteriaDir = 0;
                break;
            case ModelSortCriterion.NUMROPATHS * 2 | 1:
                console.log('in reverse NUMROPATHS sort');
                this.sortParams.secondColName = 'numropaths';
                this.sortParams.secondCriteria = ModelService.modelSorterReverse;
                this.sortParams.secondCriteriaDir = 1;
                break;
            case ModelSortCriterion.NUMROPATHS * 2 | 0:
                console.log('in forward NUMROPATHS sort');
                this.sortParams.secondColName = 'numropaths';
                this.sortParams.secondCriteria = ModelService.modelSorterForward;
                this.sortParams.secondCriteriaDir = 0;
                break;
            case ModelSortCriterion.NUMYANGS * 2 | 1:
                console.log('in reverse NUMYANGS sort');
                this.sortParams.secondColName = 'numyangs';
                this.sortParams.secondCriteria = ModelService.modelSorterReverse;
                this.sortParams.secondCriteriaDir = 1;
                break;
            case ModelSortCriterion.NUMYANGS * 2 | 0:
                console.log('in forward NUMYANGS sort');
                this.sortParams.secondColName = 'numyangs';
                this.sortParams.secondCriteria = ModelService.modelSorterForward;
                this.sortParams.secondCriteriaDir = 0;
                break;
            default:
        }
    }

    switchSortCol(colNameCriteria: ModelSortCriterion, direction: number): void {
        if (this.sortParams.firstCol === colNameCriteria) {
            if (this.sortParams.firstCriteriaDir === 1) {
                this.sortParamsFirst(colNameCriteria, 0);
                return;
            } else {
                this.sortParamsFirst(colNameCriteria, 1);
                return;
            }
        } else {
            this.sortParamsSecond(this.sortParams.firstCol, this.sortParams.firstCriteriaDir);
            this.sortParamsFirst(colNameCriteria, direction);
        }

        console.log('Sort params', this.sortParams);
    }


    loadModelList(errCb: ErrorCallback): void {
        this.close();
        this.modelInfoList.length = 0;
        this.modelInfoSub = this.configAdminService.requestListRegisteredModels().subscribe(
            (modelInfo: ModelInfo) => {
                modelInfo['id'] = modelInfo.getName() + modelInfo.getVersion(); // To make it selectable
                modelInfo['name'] = modelInfo.getName(); // To make it selectable
                modelInfo['module'] = modelInfo.getModule(); // To make it selectable
                modelInfo['version'] = modelInfo.getVersion(); // To make it searchable by version
                modelInfo['numropaths'] = modelInfo.getReadOnlyPathList().length; // For display
                modelInfo['numrwpaths'] = modelInfo.getReadWritePathList().length; // For display
                modelInfo['numyangs'] = modelInfo.getModelDataList().length; // For display
                this.modelInfoList.push(modelInfo);
                console.log('Model info loaded', modelInfo.getName(), modelInfo.getVersion(), modelInfo.getModule(),
                    modelInfo['numropaths'], modelInfo['numrwpaths'], modelInfo['numyangs']);
            },
            (error) => {
                console.log('Error on subscribe to registered models', error);
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

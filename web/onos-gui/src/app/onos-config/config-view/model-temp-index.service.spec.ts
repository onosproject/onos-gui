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

import {ModelTempIndexService} from './model-temp-index.service';
import {
    ModelInfo,
    ReadWritePath
} from '../../onos-api/onos/config/admin/admin_pb';
import {ValueType} from '../../onos-api/onos/config/change/device/types_pb';

describe('ModelTempIndexService', () => {
    const pathArray: Array<ReadWritePath> = Array(2);

    const rwPath1 = new ReadWritePath();
    rwPath1.setPath('/a/b[x=*,y=*]/c/d[z=*]/e');
    rwPath1.setDescription('Test leaf e');
    rwPath1.setValueType(ValueType.STRING);
    pathArray[0] = rwPath1;

    const rwPath2 = new ReadWritePath();
    rwPath2.setPath('/a/b[x=*,y=*]/c/d[z=*]/f');
    rwPath2.setDescription('Test leaf e');
    rwPath2.setValueType(ValueType.STRING);
    pathArray[1] = rwPath2;

    const rwPath3 = new ReadWritePath();
    rwPath3.setPath('/a/g/h/i');
    rwPath3.setDescription('Test leaf i');
    rwPath3.setValueType(ValueType.STRING);
    pathArray[2] = rwPath3;

    const rwPath4 = new ReadWritePath();
    rwPath4.setPath('/a/p[n=*]/q/r[n=*]/s');
    rwPath4.setDescription('Test leaf s');
    rwPath4.setValueType(ValueType.STRING);
    pathArray[3] = rwPath4;

    const testModelInfo = new ModelInfo();
    testModelInfo.setName('testModelInfo');
    testModelInfo.setReadWritePathList(pathArray);

    beforeEach(() => TestBed.configureTestingModule({
        providers: [
            {
                provide: ModelTempIndexService,
                useClass: ModelTempIndexService
            }
        ]
    }));

    it('should be created', () => {
        const service: ModelTempIndexService = TestBed.inject(ModelTempIndexService);
        expect(service).toBeTruthy();
    });

    it('should add model info', () => {
        const service: ModelTempIndexService = TestBed.inject(ModelTempIndexService);
        service.addModelInfo(testModelInfo);
        expect(service.modelInfo.getReadWritePathList().length).toBe(4);
    });

    it('should calculate extra paths', () => {
        const service: ModelTempIndexService = TestBed.inject(ModelTempIndexService);
        service.addModelInfo(testModelInfo);

        service.addIndex('/a/b[x=1,y=1]/c/d[z=1/0]/e');
        service.addIndex('/a/b[x=1,y=2]/c/d[z=1/0]/f');
        service.addIndex('/a/b[x=2,y=1]/c/d[z=1/0]/f');
        service.addIndex('/a/b[x=2,y=2]/c/d[z=1/0]/f');
        service.addIndex('/a/b[x=1,y=2]/c/d[z=2/0]/f');
        service.addIndex('/a/g/h/i');
        service.addIndex('/a/p[n=1]/q/r[n=1]/s');

        expect(service.indexNames.length).toEqual(6);

        const extraPaths = service.calculateExtraPaths();
        expect(extraPaths.length).toBe(11);
        expect(extraPaths[0].getPath()).toEqual('/a/b[x=1,y=1]/c/d[z=1/0]/e');
        expect(extraPaths[1].getPath()).toEqual('/a/b[x=1,y=1]/c/d[z=1/0]/f');
        expect(extraPaths[2].getPath()).toEqual('/a/b[x=1,y=2]/c/d[z=1/0]/e');
        expect(extraPaths[3].getPath()).toEqual('/a/b[x=1,y=2]/c/d[z=1/0]/f');
        expect(extraPaths[4].getPath()).toEqual('/a/b[x=2,y=1]/c/d[z=1/0]/e');
        expect(extraPaths[5].getPath()).toEqual('/a/b[x=2,y=1]/c/d[z=1/0]/f');
        expect(extraPaths[6].getPath()).toEqual('/a/b[x=2,y=2]/c/d[z=1/0]/e');
        expect(extraPaths[7].getPath()).toEqual('/a/b[x=2,y=2]/c/d[z=1/0]/f');
        expect(extraPaths[8].getPath()).toEqual('/a/b[x=1,y=2]/c/d[z=2/0]/e');
        expect(extraPaths[9].getPath()).toEqual('/a/b[x=1,y=2]/c/d[z=2/0]/f');
        expect(extraPaths[10].getPath()).toEqual('/a/p[n=1]/q/r[n=1]/s');
    });
});

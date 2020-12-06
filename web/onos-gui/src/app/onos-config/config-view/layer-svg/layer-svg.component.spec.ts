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

import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ChangeValueObj, LayerSvgComponent} from './layer-svg.component';
import {OnosConfigDiagsService} from '../../../onos-api/onos-config-diags.service';
import {ContainerSvgComponent} from '../container-svg/container-svg.component';
import {ChangeValuePipe} from '../../change-value.pipe';
import {ChangeDetectorRef} from '@angular/core';
import {PathUtil} from '../../path.util';
import {TypedValue} from '../../../onos-api/onos/config/change/device/types_pb';

class MockOnosConfigDiagsService {

}

describe('LayerSvgComponent', () => {
    let component: LayerSvgComponent;
    let fixture: ComponentFixture<LayerSvgComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                LayerSvgComponent,
                ContainerSvgComponent,
                ChangeValuePipe
            ],
            providers: [
                {
                    provide: OnosConfigDiagsService,
                    useClass: MockOnosConfigDiagsService
                },
                {provide: ChangeDetectorRef, useClass: ChangeDetectorRef},
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LayerSvgComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should be able to check parent', () => {
        const aPath = '/a/b[name=1/23]/e/f[idx=x/y]/g';
        component.reinitialize();
        const [parentpath, relpath] = PathUtil.strPathToParentChild(aPath);

        const cv = <ChangeValueObj>{
            relPath: relpath,
            value: new TypedValue(),
            removed: false,
            parentPath: parentpath,
        };

        expect(cv).toBeTruthy();

        component.nodelist.set(aPath, cv);
        expect(component.nodelist.size).toEqual(2);

        const checked = component.checkParentExists(aPath, parentpath);
        expect(!checked).toBeTruthy();
        expect(component.nodelist.size).toEqual(6);
    });

});

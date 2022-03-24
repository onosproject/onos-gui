/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

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

    beforeEach(waitForAsync(() => {
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

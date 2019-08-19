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
import {OnosConfigDiagsService} from '../../proto/onos-config-diags.service';
import {
    ConfigLink,
    ConfigNode,
    TreeLayoutService
} from '../../tree-layout.service';
import {DraggableDirective} from '../draggable/draggable.directive';
import {ContainerSvgComponent} from '../container-svg/container-svg.component';
import {ChangeValuePipe} from '../../change-value.pipe';
import {ChangeDetectorRef} from '@angular/core';
import {ChangeValueType} from '../../proto/github.com/onosproject/onos-config/pkg/northbound/admin/admin_pb';

class MockOnosConfigDiagsService {

}

class MockTreeLayoutService {
    public nodes: ConfigNode[];
    public links: ConfigLink[];

    constructor() {
        this.nodes = [];
        this.links = [];
    }
}

describe('LayerSvgComponent', () => {
    let component: LayerSvgComponent;
    let fixture: ComponentFixture<LayerSvgComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                LayerSvgComponent,
                DraggableDirective,
                ContainerSvgComponent,
                ChangeValuePipe
            ],
            providers: [
                {
                    provide: OnosConfigDiagsService,
                    useClass: MockOnosConfigDiagsService
                },
                {provide: TreeLayoutService, useClass: MockTreeLayoutService},
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

    it('should convert single leaf', () => {
        const [relpath, parentpath] = component.decomposePath('/a');

        expect(relpath).toEqual('a');
        expect(parentpath).toEqual('');
    });

    it('should convert simple path', () => {
        const [relpath, parentpath] = component.decomposePath('/a/b/c');

        expect(relpath).toEqual('c');
        expect(parentpath).toEqual('/a/b');
    });

    it('should convert indexed path last', () => {
        const [relpath, parentpath] = component.decomposePath('/a/b[name=123]');

        expect(relpath).toEqual('b[name=123]');
        expect(parentpath).toEqual('/a');
    });

    it('should convert indexed path not last', () => {
        const [relpath, parentpath] = component.decomposePath('/a/b[name=123]/d');

        expect(relpath).toEqual('d');
        expect(parentpath).toEqual('/a/b[name=123]');
    });

    it('should convert indexed path with slash in index last', () => {
        const [relpath, parentpath] = component.decomposePath('/a/b[name=1/23]');

        expect(relpath).toEqual('b[name=1/23]');
        expect(parentpath).toEqual('/a');
    });

    it('should convert indexed path with slash in index not last', () => {
        const [relpath, parentpath] = component.decomposePath('/a/b[name=1/23]/e');

        expect(relpath).toEqual('e');
        expect(parentpath).toEqual('/a/b[name=1/23]');
    });

    it('should convert double indexed path with slash in index not last', () => {
        const [relpath, parentpath] = component.decomposePath('/a/b[name=1/23]/e/f[idx=x/y]/g');

        expect(relpath).toEqual('g');
        expect(parentpath).toEqual('/a/b[name=1/23]/e/f[idx=x/y]');
    });



    it('should be able to check parent', () => {
        const aPath = '/a/b[name=1/23]/e/f[idx=x/y]/g';
        component.reinitialize();
        const fgNode = component.addToForceGraph(aPath);
        const [relpath, parentpath] = component.decomposePath(aPath);

        expect(fgNode.id).toEqual(aPath);

        const cv = <ChangeValueObj>{
            relPath: relpath,
            value: new Uint8Array(),
            valueType: ChangeValueType.EMPTY,
            valueTypeOpts: [],
            removed: false,
            parentPath: parentpath,
            node: fgNode
        };

        expect(cv).toBeTruthy();

        component.nodelist.set(aPath, cv);
        expect(component.nodelist.size).toEqual(2);
        expect(component.linkList.size).toEqual(0);

        const checked = component.checkParentExists(aPath, parentpath);
        expect(!checked).toBeTruthy();
        expect(component.nodelist.size).toEqual(6);
        expect(component.linkList.size).toEqual(5);
    });

});

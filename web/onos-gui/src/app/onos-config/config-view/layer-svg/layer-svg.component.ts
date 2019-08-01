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

import {
    Component, EventEmitter,
    Input,
    OnChanges, Output,
    SimpleChanges
} from '@angular/core';
import {OnosConfigDiagsService} from '../../proto/onos-config-diags.service';
import {
    Change
} from '../../proto/github.com/onosproject/onos-config/pkg/northbound/proto/diags_pb';
import {PENDING} from "../../pending-net-change.service";

export interface ChangeValueObj {
    path: string;
    value: string;
    removed: boolean;
    pathElems: string[];
}

@Component({
    selector: '[onos-layer-svg]',
    templateUrl: './layer-svg.component.html',
    styleUrls: ['./layer-svg.component.css']
})
export class LayerSvgComponent implements OnChanges {
    @Input() layerId: string = '';
    @Input() visible: boolean;
    @Output() editRequestedLayer = new EventEmitter<string>();
    changeValues: ChangeValueObj[] = [];
    description: string;
    changeTime: number = 0;
    offset: number = Math.random() * 200;
    allPaths: Map<string, string>;

    constructor(
        private diags: OnosConfigDiagsService,
    ) {
        this.allPaths = new Map<string, string>();
        console.log('Constructed LayerSvgComponent');
    }

    // the change name can be changes any time
    ngOnChanges(changes: SimpleChanges) {
        if (changes['layerId']) {
            const layerIdNew = changes['layerId'].currentValue;
            this.changeValues.length = 0;
            this.allPaths.clear();
            if (String(layerIdNew).startsWith(PENDING)) {
                console.log('Getting pending changes from service:', layerIdNew);
            } else {
                this.diags.requestChanges([layerIdNew], (change: Change) => {
                    // We're only expecting the 1 change as we only asked for 1
                    this.description = change.getDesc();
                    this.changeTime = Number(change.getTime()) * 1000;
                    for (const c of change.getChangevaluesList()) {
                        this.changeValues.push(<ChangeValueObj>{
                            path: c.getPath(),
                            value: c.getValue(),
                            removed: c.getRemoved(),
                            pathElems: this.decomposePath(c.getPath())
                        });
                        let basePath = c.getPath().substr(0, c.getPath().lastIndexOf('/'));
                        if (basePath === '') {
                            basePath = 'undefined';
                        }
                        this.allPaths.set(basePath, this.allPaths.get(basePath) + ',' + c.getValuetype());
                    }
                    console.log('Change response for ', layerIdNew, 'received', this.allPaths);
                });
            }
        }
    }

    decomposePath(path: string): string[] {
        const pathElems = path.split('/');
        return pathElems;
    }

    countParts(path: string): number {
        return path.split('/').length;
    }

    requestEditLayer(path: string, leaf: string, l1: string) {
        this.editRequestedLayer.emit(path + ',' + leaf + ',' + l1);
        console.log('Edit requested on layer', this.layerId, path, leaf, l1);
    }
}


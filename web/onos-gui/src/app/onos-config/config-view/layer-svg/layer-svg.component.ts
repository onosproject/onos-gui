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
    Component,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import {OnosConfigDiagsService} from '../../proto/onos-config-diags.service';
import {
    Change
} from '../../proto/github.com/onosproject/onos-config/pkg/northbound/proto/diags_pb';

export interface ChangeValueObj {
    path: string;
}

@Component({
    selector: '[onos-layer-svg]',
    templateUrl: './layer-svg.component.html',
    styleUrls: ['./layer-svg.component.css']
})
export class LayerSvgComponent implements OnChanges {
    @Input() layerId: string = '';
    @Input() visible: boolean;
    changeValues: ChangeValueObj[] = [];
    description: string;
    changeTime: number = 0;
    offset: number = Math.random() * 200;

    constructor(
        private diags: OnosConfigDiagsService
    ) {
        console.log('Constructed LayerSvgComponent');
    }

    // the change name can be changes any time
    ngOnChanges(changes: SimpleChanges) {
        if (changes['layerId']) {
            const layerIdNew = changes['layerId'].currentValue;
            this.changeValues.length = 0;
            this.diags.requestChanges([layerIdNew], (change: Change) => {
                // We're only expecting the 1 change as we only asked for 1
                this.description = change.getDesc();
                this.changeTime = Number(change.getTime()) * 1000;
                for (const c of change.getChangevaluesList()) {
                    this.changeValues.push(<ChangeValueObj>{path: c.getPath()});
                }
                console.log('Change response for ', layerIdNew, 'received');
            });
        }
    }
}

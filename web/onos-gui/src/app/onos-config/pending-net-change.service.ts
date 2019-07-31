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
import {NwChangeEntry} from './networkchanges/network-changes.component';

export const PENDING = 'pending';
export const PENDING_U = 'Pending';

@Injectable({
    providedIn: 'root'
})
export class PendingNetChangeService {
    hasPendingChange: boolean = false;
    pendingChangeName: string = PENDING_U;
    pendingChangeUser: string = 'gui-user';
    pendingChangesMap: NwChangeEntry[] = [];

    constructor() {
        console.log('PendingNetChangeService constructed');
    }

    addToPendingChange(configName: string, path: string) {
        if (!this.hasPendingChange) {
            this.hasPendingChange = true;
        }
        const exists = this.pendingChangesMap.filter(ch => ch.configId === configName);
        if (exists.length === 0) {
            this.pendingChangesMap.push(<NwChangeEntry>{
                configId: configName,
                changeId: PENDING,
            });
            console.log('Pending layer started with', path);
        } else {
            console.log('Pending layer extended with', path);
        }
    }

    deletePendingChange() {
        this.hasPendingChange = false;
        this.pendingChangesMap.length = 0;
        console.log('Pending change deleted', this.pendingChangeName);
    }
}

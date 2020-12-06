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
import * as grpcWeb from 'grpc-web';
import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';
import {OnosTopoDeviceService} from '../onos-api/onos-topo-device.service';
import {EventType, WatchResponse, Object as EntityObject} from '../onos-api/onos/topo/topo_pb';


@Injectable({
    providedIn: 'root'
})
export class TopoDeviceService {
    topoEntitySub: Subscription;
    entityList: Map<string, EntityObject>; // Expect <dev-id:dev-ver> as key
    relationshipsList: Map<string, EntityObject>;
    sortParams = {
        firstColName: 'id',
        firstCriteriaDir: 0
    };

    constructor(
        private onosTopoDeviceService: OnosTopoDeviceService
    ) {
        this.entityList = new Map<string, EntityObject>();
        this.relationshipsList = new Map<string, EntityObject>();
    }

    watchTopoEntity(errorCb: (e: grpcWeb.Error) => void, updateCb?: (type: EventType, entity: EntityObject) => void) {
        this.topoEntitySub = this.onosTopoDeviceService.requestListTopo().pipe(
            filter(x => x.getEvent().getObject().getType() === 1 || x.getEvent().getObject().getType() === 2)
        ).subscribe(
            (resp: WatchResponse) => {
                if (resp.getEvent().getObject().getType() === 1) {
                    const name = resp.getEvent().getObject().getId();
                    console.log('List Topo Entity response ', name);
                    if (!this.entityList.has(name) &&
                        (resp.getEvent().getType() === EventType.ADDED || resp.getEvent().getType() === EventType.NONE)) {
                        const added = this.addTopoEntity(resp.getEvent().getObject());
                        if (added && updateCb !== undefined) {
                            updateCb(resp.getEvent().getType(), resp.getEvent().getObject());
                        }
                    } else if (this.entityList.has(name) && resp.getEvent().getType() === EventType.REMOVED) {
                        const removed = this.removeEntity(resp.getEvent().getObject().getId());
                        if (removed && updateCb) {
                            updateCb(resp.getEvent().getType(), resp.getEvent().getObject());
                        }
                    } else if (resp.getEvent().getType() === EventType.UPDATED) {
                        const updated = resp.getEvent().getObject();
                        this.entityList.set(name, updated);
                    } else {
                        console.log('Unhandled Topo Entity update', resp.getEvent().getType(), resp.getEvent().getObject().getId());
                    }
                } else {
                    const name = resp.getEvent().getObject().getId();
                    console.log('List Topo Relations response ', name);
                    if (!this.relationshipsList.has(name) &&
                        (resp.getEvent().getType() === EventType.ADDED || resp.getEvent().getType() === EventType.NONE)) {
                        const added = this.addTopoRelation(resp.getEvent().getObject());
                        if (added && updateCb !== undefined) {
                            updateCb(resp.getEvent().getType(), resp.getEvent().getObject());
                        }
                    } else if (this.relationshipsList.has(name) && resp.getEvent().getType() === EventType.REMOVED) {
                        const removed = this.removeRelation(name);
                        if (removed && updateCb) {
                            updateCb(resp.getEvent().getType(), resp.getEvent().getObject());
                        }
                    } else if (resp.getEvent().getType() === EventType.UPDATED) {
                        const updated = resp.getEvent().getObject();
                        this.relationshipsList.set(name, updated);
                    } else {
                        console.log('Unhandled Topo Relations update', resp.getEvent().getType(), resp.getEvent().getObject().getId());
                    }
                }
            },
            (error) => {
                console.log('Error on topo entity subscription', error);
                errorCb(error);
            }
        );
    }

    removeEntity(name: string): boolean {
        if (this.entityList.has(name)) {
            this.entityList.delete(name);
            return true;
        }
        return false;
    }

    addTopoEntity(entityObj: EntityObject): boolean {
        const name = entityObj.getId();
        if (!this.entityList.has(name)) {
            this.entityList.set(name, entityObj);
            return true;
        }
        return false;
    }

    removeRelation(name: string): boolean {
        if (this.relationshipsList.has(name)) {
            this.relationshipsList.delete(name);
            return true;
        }
        return false;
    }

    addTopoRelation(obj: EntityObject): boolean {
        const name = obj.getId();
        if (!this.relationshipsList.has(name)) {
            this.relationshipsList.set(name, obj);
            return true;
        }
        return false;
    }

    stopWatchingTopoEntity() {
        this.entityList.clear();
        if (this.topoEntitySub) {
            this.topoEntitySub.unsubscribe();
        }
        console.log('Stopped watching topo entity');
    }

    stopWatchingTopoRelations() {
        this.relationshipsList.clear();
        if (this.topoEntitySub) {
            this.topoEntitySub.unsubscribe();
        }
        console.log('Stopped watching topo relations');
    }
}



/*
 * Copyright 2018-present Open Networking Foundation
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

import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  FnService, IconService,
  LogService, TableAnnots
} from 'gui2-fw-lib';
import { ActivatedRoute, Router } from '@angular/router';
import * as grpcWeb from 'grpc-web';
import { TopoDeviceService } from '../topodevice.service';
import { ConnectivityService } from '../../connectivity.service';
import { Object } from '../proto/github.com/onosproject/onos-topo/api/topo/topo_pb';

@Component({
  selector: 'onos-entity-list',
  templateUrl: './entity-list.component.html',
  styleUrls: [
    './entity-list.component.css',
    '../../fw/widget/table.css',
    '../../fw/widget/table.theme.css'
  ]
})

export class EntityListComponent implements OnInit, OnDestroy {
  selectedChange: Object;
  selId: string = undefined;
  public annots: TableAnnots;
  public queryBy = '';
  public queryStr = '';

  constructor(
    protected fs: FnService,
    protected log: LogService,
    protected as: ActivatedRoute,
    protected router: Router,
    protected is: IconService,
    public topoDeviceService: TopoDeviceService,
    private connectivityService: ConnectivityService
  ) {
    this.is.loadIconDef('switch');
    this.is.loadIconDef('xClose');

    this.annots = <TableAnnots>{
      noRowsMsg: 'No data found'
    };

    console.log('Constructed EntityListComponent');
  }

  ngOnInit() {
    console.log(this.topoDeviceService.entityList.size);

    this.connectivityService.hideVeil();
    this.topoDeviceService.watchTopoEntity((err: grpcWeb.Error) => {
      this.connectivityService.showVeil([
        'Topo Entity service gRPC error', String(err.code), err.message,
        'Please ensure onos-topo is reachable',
        'Choose a different application from the menu']);
    });
  }

  ngOnDestroy(): void {
    this.topoDeviceService.stopWatchingTopoEntity();
  }

  selectCallback(event, devId: string, entityObj: Object): void {
    this.selId = (this.selId === devId ? undefined : devId);
    this.selectedChange = entityObj;
  }

  deselectRow(event): void {
    this.selectedChange = undefined;
    this.selId = undefined;
  }

  onSort(colName: string) {
    // unimplemented
  }

  sortIcon(colName: string) {
    // unimplemented
  }


  printMapValue(map: Map<string, string>, attribute: string): string {
    if (map === undefined) {
      return '';
    } else {
      const attributes = JSON.parse(JSON.stringify(map));
      const attributes_map = JSON.parse(JSON.stringify(attributes['map_']));
      return attributes_map[attribute].value;
    }
  }

}



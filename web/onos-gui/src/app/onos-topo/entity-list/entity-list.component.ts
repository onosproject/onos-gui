/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FnService, IconService,
  LogService, TableAnnots
} from 'gui2-fw-lib';
import { ActivatedRoute, Router } from '@angular/router';
import * as grpcWeb from 'grpc-web';
import { TopoEntityService } from '../topo-entity.service';
import { Object } from '../../onos-api/onos/topo/topo_pb';
import { ConnectivityService } from '../../connectivity.service';

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
    public topoDeviceService: TopoEntityService,
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

  changeRow(event: string) {
    this.selId = event;
    this.selectedChange = this.topoDeviceService.entityList.get(event);
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
      if (attributes_map[attribute] !== undefined) {
        return attributes_map[attribute].value;
      }
    }
    return '';
  }

}



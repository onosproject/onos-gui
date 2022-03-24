/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {InjectionToken, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OnosTopoRoutingModule} from './onos-topo-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Gui2FwLibModule} from 'gui2-fw-lib';
import {grpc_web_topo_proxy} from '../../environments/environment';
import {OnosTopoEntityService} from '../onos-api/onos-topo-entity.service';
import {TopoEntityService} from './topo-entity.service';
import {EntityListComponent} from './entity-list/entity-list.component';
import {EntityDetailComponent} from './entity-detail/entity-detail.component';

const GRPC_WEB_TOPO_PROXY = new InjectionToken<string>('grpc.web.topo.proxy');
const ID_TOKEN = new InjectionToken<string>('auth.local.idtoken');

@NgModule({
    declarations: [EntityListComponent, EntityDetailComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        OnosTopoRoutingModule,
        Gui2FwLibModule,
    ],
    providers: [
        {
            provide: GRPC_WEB_TOPO_PROXY,
            useValue: grpc_web_topo_proxy
        },
        {
            provide: ID_TOKEN,
            useValue: localStorage.getItem('id_token')
        },
        {
            provide: OnosTopoEntityService,
            deps: [ID_TOKEN, GRPC_WEB_TOPO_PROXY],
        },
        {
            provide: TopoEntityService,
            useClass: TopoEntityService
        }
    ],
})
export class OnosTopoModule {
}

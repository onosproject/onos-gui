/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

/**
 * The set of Routes in the application - can be chosen from nav menu or
 * elsewhere like tabular icon for flows etc
 */
const onosRoutes: Routes = [
    {
        path: 'onos-config',
        loadChildren: './onos-config/onos-config.module#OnosConfigModule'
    },
    {
        path: 'onos-topo',
        loadChildren: './onos-topo/onos-topo.module#OnosTopoModule'
    },
    {
        path: 'onos-ric',
        loadChildren: './onos-ric/onos-ric.module#OnosRicModule'
    },
    {
        path: 'ran-simulator',
        loadChildren: './ran-simulator/ran-simulator.module#RanSimulatorModule'
    },
    {
        path: '',
        redirectTo: 'onos-topo',
        pathMatch: 'full'
    }
];

/**
 * ONOS GUI -- Main Routing Module - allows modules to be lazy loaded
 *
 * See https://angular.io/guide/lazy-loading-ngmodules
 * for the theory of operation
 */
@NgModule({
    imports: [
        RouterModule.forRoot(onosRoutes, { useHash: true, relativeLinkResolution: 'legacy' })
    ],
    exports: [RouterModule],
    providers: []
})
export class OnosRoutingModule {
}

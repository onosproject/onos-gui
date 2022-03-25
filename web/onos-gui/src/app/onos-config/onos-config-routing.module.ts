/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ModelsListComponent} from './models-list/models-list.component';
import {ConfigDashboardComponent} from './config-dashboard/config-dashboard.component';
import {ConfigViewComponent} from './config-view/config-view.component';

export const routes: Routes = [
    {
        path: 'configview/:configName',
        component: ConfigViewComponent
    },
    {
        path: 'dashboard',
        component: ConfigDashboardComponent
    },
    {
        path: 'models',
        component: ModelsListComponent
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OnosConfigRoutingModule {
}

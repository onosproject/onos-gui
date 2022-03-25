/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntityListComponent } from './entity-list/entity-list.component';

const routes: Routes = [
    {
        path: '',
        component: EntityListComponent,
        pathMatch: 'full'
    },
    {
        path: 'entity',
        component: EntityListComponent,
        pathMatch: 'full'
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OnosTopoRoutingModule {
}

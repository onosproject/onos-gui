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

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ReactiveFormsModule} from '@angular/forms';
import {OnosConfigDiagsService} from '../proto/onos-config-diags.service';
import {OnosConfigAdminService} from '../proto/onos-config-admin.service';
import {OnosConfigGnmiService} from '../proto/onos-config-gnmi.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    {provide: OnosConfigDiagsService, useValue: new OnosConfigDiagsService(window.location.host)},
    {provide: OnosConfigAdminService, useValue: new OnosConfigAdminService(window.location.host)},
    {provide: OnosConfigGnmiService, useValue: new OnosConfigGnmiService(window.location.host)},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

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

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OnosComponent} from './onos.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ConsoleLoggerService, Gui2FwLibModule, LogService} from 'gui2-fw-lib';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {OnosRoutingModule} from './onos-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NavComponent} from './nav/nav.component';
import {K8sClientService} from './k8sclient.service';
import {kubernetes_api_proxy} from '../environments/environment';
import { OAuthModule } from 'angular-oauth2-oidc';

@NgModule({
    declarations: [
        OnosComponent, NavComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        HttpClientModule,
        ReactiveFormsModule,
        OnosRoutingModule,
        OAuthModule.forRoot(),
        Gui2FwLibModule
    ],
    providers: [
        {provide: 'Window', useValue: window},
        {provide: LogService, useClass: ConsoleLoggerService},
        {provide: HttpClient, useClass: HttpClient},
        {provide: 'kubernetes_api_proxy', useValue: kubernetes_api_proxy},
        {provide: K8sClientService, useClass: K8sClientService}
    ],
    bootstrap: [OnosComponent]
})
export class OnosModule {
}

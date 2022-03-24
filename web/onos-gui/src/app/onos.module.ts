/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
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
import {OAuthModule, OAuthStorage} from 'angular-oauth2-oidc';

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
        {provide: K8sClientService, useClass: K8sClientService},
        {provide: OAuthStorage, useValue: localStorage},
    ],
    bootstrap: [OnosComponent]
})
export class OnosModule {
}

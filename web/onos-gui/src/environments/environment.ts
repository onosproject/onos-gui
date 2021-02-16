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

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {AuthConfig} from 'angular-oauth2-oidc';

export const environment = {
  production: false
};

export const kubernetes_api_proxy = 'http://localhost:8001';
export const grpc_web_topo_proxy = 'http://localhost:8081';
export const grpc_web_config_proxy = 'http://localhost:8082';
export const grpc_web_ric_proxy = 'http://localhost:8083';
export const grpc_web_sim_proxy = 'http://localhost:8084';

export const OIDC_AUTH_CLIENT_ID = 'onos-gui';
export const OIDC_ISSUER = undefined;

export const authConfig: AuthConfig = {
    issuer: OIDC_ISSUER,
    redirectUri: window.location.origin,
    clientId: OIDC_AUTH_CLIENT_ID,
    responseType: 'code',
    requireHttps: false,
    scope: 'openid profile email offline_access groups',
    showDebugInformation: true,
    timeoutFactor: 0.01,
    strictDiscoveryDocumentValidation: true,
};

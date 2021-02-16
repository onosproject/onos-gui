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

import {AuthConfig} from 'angular-oauth2-oidc';

export const environment = {
  production: true
};

export const kubernetes_api_proxy = 'http://' + window.location.host + '/kubernetes-api';
export const grpc_web_config_proxy = 'http://' + window.location.host + '/onos-config';
export const grpc_web_topo_proxy = 'http://' + window.location.host + '/onos-topo';
export const grpc_web_ric_proxy = 'http://' + window.location.host + '/onos-ric';
export const grpc_web_sim_proxy = 'http://' + window.location.host + '/ran-simulator';

export const OIDC_AUTH_CLIENT_ID = 'onos-gui';
export const OIDC_ISSUER = undefined;

export const authConfig: AuthConfig = {
    issuer: OIDC_ISSUER,
    redirectUri: window.location.origin,
    clientId: OIDC_AUTH_CLIENT_ID,
    responseType: 'code',
    requireHttps: false, // TODO: Change back to true
    scope: 'openid profile email offline_access groups',
    showDebugInformation: false,
    timeoutFactor: 0.01,
    strictDiscoveryDocumentValidation: true,
};

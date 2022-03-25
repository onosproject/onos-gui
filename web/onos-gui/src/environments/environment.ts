/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
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
export const grpc_web_modelregistry_proxy = 'http://localhost:8085';

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

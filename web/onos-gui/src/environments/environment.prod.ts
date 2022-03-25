/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
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
export const grpc_web_modelregistry_proxy = 'http://' + window.location.host + '/model-registry';

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

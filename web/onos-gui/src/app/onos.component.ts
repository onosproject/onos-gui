/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {Component, OnInit} from '@angular/core';
import {FnService, IconService, KeysService, LogService} from 'gui2-fw-lib';
import {ConnectivityService} from './connectivity.service';
import {
    AuthConfig, OAuthService
} from 'angular-oauth2-oidc';
import {Meta} from '@angular/platform-browser';
import {authConfig} from '../environments/environment';

const ID_TOKEN_CLAIMS_OBJ = 'id_token_claims_obj';

export interface IdTokClaims {
    at_hash: string;
    aud: string;
    email: string;
    email_verified: boolean;
    exp: number;
    groups: string[];
    iat: number;
    iss: string;
    name: string;
    nonce: string;
    sub: string;
}

@Component({
    selector: 'onos-root',
    templateUrl: './onos.component.html',
    styleUrls: ['./onos.component.css', './onos-theme.css']
})
export class OnosComponent implements OnInit {
    title = 'onos-gui';

    constructor(
        protected fs: FnService,
        protected ks: KeysService,
        protected log: LogService,
        protected is: IconService,
        public connectivity: ConnectivityService,
        private oauthService: OAuthService,
        private meta: Meta,
    ) {
        console.log('Constructed OnosComponent');

    }

    async ngOnInit(): Promise<boolean> {
        const issuerMeta = this.meta.getTag('name=openidcissuer');
        console.log('Starting onos.component with ', issuerMeta.content);
        if (issuerMeta.content !== undefined && issuerMeta.content !== '' && issuerMeta.content !== '$OPENIDCISSUER') {
            authConfig.issuer = issuerMeta.content;
        }
        if (authConfig.issuer !== undefined) {

            this.oauthService.configure(authConfig);

            return await this.oauthService.loadDiscoveryDocumentAndLogin(
                {customHashFragment: window.location.search}
            );
        }
    }

    get idTokClaims(): IdTokClaims {
        const idTokClaims = localStorage.getItem(ID_TOKEN_CLAIMS_OBJ);
        if (idTokClaims !== null) {
            return JSON.parse(idTokClaims) as IdTokClaims;
        }
        return {} as IdTokClaims;
    }
}

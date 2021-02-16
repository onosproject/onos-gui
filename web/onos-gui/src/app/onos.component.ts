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

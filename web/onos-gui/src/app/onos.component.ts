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

import {Component} from '@angular/core';
import {FnService, IconService, KeysService, LogService} from 'gui2-fw-lib';
import {ConnectivityService} from './connectivity.service';
import {
    AuthConfig, OAuthService
} from 'angular-oauth2-oidc';
import {Meta} from '@angular/platform-browser';
import {LoggedinService} from './loggedin.service';

export const authConfig: AuthConfig = {
    redirectUri: window.location.origin,
    clientId: 'onos-gui',
    responseType: 'code',
    requireHttps: false,
    scope: 'openid profile email offline_access',
    dummyClientSecret: 'ZXhhbXBsZS1hcHAtc2VjcmV0',
    showDebugInformation: true,
    timeoutFactor: 0.01
};

@Component({
    selector: 'onos-root',
    templateUrl: './onos.component.html',
    styleUrls: ['./onos.component.css', './onos-theme.css']
})
export class OnosComponent {
    title = 'onos-gui';

    constructor(
        protected fs: FnService,
        protected ks: KeysService,
        protected log: LogService,
        protected is: IconService,
        public connectivity: ConnectivityService,
        private oauthService: OAuthService,
        public loggedinService: LoggedinService,
        private meta: Meta,
    ) {
        const issuerMeta = this.meta.getTag('name=openidcissuer');
        this.is.loadIconDef('bird');
        if (issuerMeta.content !== undefined && issuerMeta.content !== '' && issuerMeta.content !== '$OPENIDCISSUER') {
            authConfig.issuer = issuerMeta.content;
            this.oauthService.configure(authConfig);
            this.oauthService.loadDiscoveryDocumentAndLogin().then(loggedIn => {
                this.loggedinService.email = this.oauthService.getIdentityClaims()['email'];
                this.loggedinService.username = this.oauthService.getIdentityClaims()['name'];
                this.loggedinService.accessToken = this.oauthService.getIdToken();
                this.loggedinService.idToken = this.oauthService.getAccessToken();
                console.log('Logged in ', loggedIn, this.oauthService.hasValidIdToken(),
                    'as', this.oauthService.getIdentityClaims()['name'],
                    '(' + this.oauthService.getIdentityClaims()['email'] + ')');
                return Promise.resolve();
            });
            console.log('Using OpenID Connect Provider issuer:', authConfig.issuer);
        }
        console.log('Constructed OnosComponent');
        // this.oauthService.events
        //     .pipe(filter(e => e.type === 'token_received'))
        //     .subscribe(_ => this.oauthService.loadUserProfile());
    }
}

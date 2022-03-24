/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ConnectivityService {

    vcd: any; // The veil Delegate

    constructor() {
    }

    showVeil(messages: string[]) {
        this.vcd.show(messages);
    }

    hideVeil() {
        this.vcd.enabled = false;
        this.vcd.messages = [];
        this.vcd.hide();
    }

    setVeilDelegate(veil: any) {
        this.vcd = veil;
    }
}

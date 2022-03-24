/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {ChangeValuePipe} from './change-value.pipe';
import { TestBed, waitForAsync } from '@angular/core/testing';
import {TypedValue} from '../onos-api/onos/config/change/device/types_pb';

describe('ChangeValuePipe', () => {

    let pipe: ChangeValuePipe;

    // synchronous beforeEach
    beforeEach(() => {
        TestBed.configureTestingModule({
        });

        pipe = new ChangeValuePipe();
    });

    it('create an instance', () => {

        expect(pipe).toBeTruthy();
    });

    it('Empty value', () => {
        const values = pipe.transform(new TypedValue());
        expect(values.length).toBe(0);
    });

});

/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeStatusPipe } from './change-status.pipe';

describe('ChangeStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new ChangeStatusPipe();
    expect(pipe).toBeTruthy();
  });
});

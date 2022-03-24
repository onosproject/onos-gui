/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NodeFilterPipe } from './node-filter.pipe';

describe('NodeFilterPipe', () => {
  it('create an instance', () => {
    const pipe = new NodeFilterPipe();
    expect(pipe).toBeTruthy();
  });
});

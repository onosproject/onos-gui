/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

export class Utils {
    static roundNumber(value: number, suffix: string = '', roundPlaces: number = 2): string {
        const scale = Math.pow(10, roundPlaces);
        return Math.round(value * scale) / scale + suffix;
    }
}

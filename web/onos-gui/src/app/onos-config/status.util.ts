/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
    Phase, Reason,
    State, Status
} from '../onos-api/onos/config/change/types_pb';

/**
 * StatusUtil is for convering status values to strings, so they can be used as styles
 */
export class StatusUtil {
    static statusToStrings(changeStatus: Status): string[] {
        let status = '';
        let phase = '';
        let reason = '';


        switch (changeStatus.getState()) {
            case State.PENDING:
                status = 'pending';
                break;
            case State.COMPLETE:
                status = 'complete';
                break;
            case State.FAILED:
                status = 'failed';
                break;
        }

        switch (changeStatus.getPhase()) {
            case Phase.CHANGE:
                phase = 'change';
                break;
            case Phase.ROLLBACK:
                phase = 'rollback';
                break;
        }

        switch (changeStatus.getReason()) {
            case Reason.ERROR:
                reason = 'error';
                break;
            case Reason.NONE:
                break;
        }

        return [status, phase, reason];
    }
}

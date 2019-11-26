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

import {
    Phase, Reason,
    State, Status
} from './proto/github.com/onosproject/onos-config/api/types/change/types_pb';

/**
 * StatusUtil is for convering status values to strings, so they can be used as styles
 */
export class StatusUtil {
    static statusToStrings(changeStatus: Status): string[] {
        let status = '';
        let phase = '';
        let reason = '';


        switch (changeStatus.getState()) {
            case State.RUNNING:
                status = 'running';
                break;
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

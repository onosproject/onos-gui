/*
 * Copyright 2020-present Open Networking Foundation
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

import {Component, OnDestroy, OnInit} from '@angular/core';
import {
    ChannelQuality, ECGI, StationInfo,
    UELinkInfo
} from '../proto/github.com/onosproject/onos-ric/api/nb/c1-interface_pb';
import {OnosRicC1Service} from '../proto/onos-ric-c1.service';
import {Subscription} from 'rxjs';
import * as grpcWeb from 'grpc-web';
import {ConnectivityService} from '../../connectivity.service';

const RefreshIntervalMs = 2000;
const HighlighFadeMs = 500;

@Component({
    selector: 'onos-uelinks',
    templateUrl: './uelinks.component.html',
    styleUrls: [
        './uelinks.component.css',
        '../../fw/widget/table.css',
        '../../fw/widget/table.theme.css'
    ]
})
export class UelinksComponent implements OnInit, OnDestroy {
    ueLinks: Map<string, UELinkInfo>;
    stations: Map<string, StationInfo>;
    ueHighlights: Array<string>;
    uelinksSub: Subscription;
    timer: any;
    selectedCell = '';
    selectedStation: StationInfo;

    constructor(
        private onosGuiRicService: OnosRicC1Service,
        private connectivityService: ConnectivityService
    ) {
        this.ueLinks = new Map<string, UELinkInfo>();
        this.stations = new Map<string, StationInfo>();
        this.ueHighlights = new Array<string>();
        console.log('Constructed UelinksComponent');
    }

    ngOnInit() {
        this.getUeLinks();
        this.getStations();
        this.timer = setInterval(() => {
            this.getUeLinks();
            this.getStations();
        }, RefreshIntervalMs);
    }

    getStations() {
        console.log('Connecting to onos-ric getStations()');
        this.uelinksSub = this.onosGuiRicService.requestListStations().subscribe(
            (stationInfo: StationInfo) => {
                this.stations.set(stationInfo.getEcgi().getEcid(), stationInfo);
            },
            (err => {
                this.connectivityService.showVeil([
                    'Stations service gRPC error', String(err.code), err.message,
                    'Please ensure onos-ric is reachable',
                    'Choose a different application from the menu']);
                console.error('Disconnected from onos-ric', err);
                clearTimeout(this.timer);
            })
        );
    }

    // For the moment we have to poll this, since subscribe is not yet implemented
    getUeLinks() {
        console.log('Connecting to onos-ric getUeLinks()');
        this.uelinksSub = this.onosGuiRicService.requestListUeLinks().subscribe(
            (uelink: UELinkInfo) => {
                const crnti = uelink.getCrnti();
                const old = this.ueLinks.get(crnti);
                let oldValues: Array<ChannelQuality>;
                this.ueLinks.set(crnti, uelink);
                // Compare the new set of values to old values - if it changed highlight it
                if (old !== undefined) {
                    oldValues = old.getChannelqualitiesList();
                    const idx = uelink.getChannelqualitiesList().findIndex((newCq) => {
                        const idx1 = oldValues.findIndex((oldCq) => {
                            return oldCq.getTargetecgi().getEcid() === newCq.getTargetecgi().getEcid() &&
                                oldCq.getCqihist() === newCq.getCqihist();
                        });
                        return idx1 >= 0;
                    });
                    if (idx < 0) {
                        this.ueHighlights.push(crnti);
                        setTimeout(() => {
                            const pos = this.ueHighlights.findIndex((ue) => crnti === ue);
                            this.ueHighlights.splice(pos, 1);
                        }, HighlighFadeMs);
                    }
                }
            },
            (err: grpcWeb.Error) => {
                this.connectivityService.showVeil([
                    'UE Links gRPC error', String(err.code), err.message,
                    'Please ensure onos-ric is reachable']);
                console.error('Disconnected from onos-ric', err);
                clearTimeout(this.timer);
            }
        );
    }

    ngOnDestroy(): void {
        clearTimeout(this.timer);
        this.uelinksSub.unsubscribe();
    }

    getQualForEcid(crnti: string, ecid: string): number {
        const chanQuality = this.ueLinks.get(crnti).getChannelqualitiesList()
            .find((cq: ChannelQuality) => cq.getTargetecgi().getEcid() === ecid);
        if (chanQuality !== undefined) {
            return chanQuality.getCqihist();
        }
        return undefined;
    }

    selectStation(ecgi: ECGI) {
        this.selectedCell = ecgi.getEcid();
        this.selectedStation = this.stations.get(ecgi.getEcid());
    }

}

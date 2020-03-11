/*
 * Copyright 2018-present Open Networking Foundation
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
import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {trigger, state, style, animate, transition} from '@angular/animations';

import {
    LionService,
    LogService,
    NavService
} from 'gui2-fw-lib';
import {K8sClientService} from '../k8sclient.service';
import {kubernetes_api_proxy} from '../../environments/environment';

export interface UiView {
    // id:  Must correspond to the path in that Routes[] for that module
    id: string;
    icon: string;
    label: string;
}

export interface NavSection {
    // title: The displayed title for the Nav Menu Section
    title: string;
    // service_name: The K8S service name
    service_name: string;
    // views: The list of Views shown when the service is enabled.
    views: Array<UiView>;
}

/**
 * ONOS GUI -- Navigation Module
 *
 * Note: While this NavComponent could arguably be moved to the gui2-fw-lib
 * it brings problems in recognizing the "routerlink" directives as being part
 * of this application. So for that reason Nav must remain here for routing to work
 */
@Component({
    selector: 'onos-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.theme.css', './nav.component.css'],
    animations: [
        trigger('navState', [
            state('false', style({
                transform: 'translateY(-100%)'
            })),
            state('true', style({
                transform: 'translateY(0%)'
            })),
            transition('0 => 1', animate('100ms ease-in')),
            transition('1 => 0', animate('100ms ease-out'))
        ])
    ],
})
export class NavComponent implements OnInit {
    navSections: NavSection[];

    constructor(
        private log: LogService,
        public ns: NavService,
        private k8s: K8sClientService,
    ) {
        this.navSections = new Array<NavSection>();
        this.navSections.push(this.createDummySection());
        this.log.debug('NavComponent constructed');
    }

    ngOnInit() {
        // Load the menu at startup and refresh every 10 seconds
        this.updateNav();
        setInterval(() => this.updateNav(), 5000);
    }

    updateNav() {
        const updatedSections = new Array<NavSection>();
        this.k8s.monitorRunningServices().subscribe(
            (resp: string) => {
                switch (resp) {
                    case 'onos-config':
                        updatedSections.push(this.createConfigSection());
                        break;
                    case 'onos-topo':
                        updatedSections.push(this.createTopoSection());
                        break;
                    case 'onos-ric':
                        updatedSections.push(this.createRicSection());
                        break;
                    // case 'ran-simulator':
                    //     updatedSections.push(this.createRanSimSection());
                    //     break;
                }
            },
            error => {
                console.log('K8S API not available');
                this.navSections.length = 0;
                this.navSections.push(this.createDummySection());
            },
            () => {
                this.navSections.length = 0;
                if (updatedSections.length > 0) {
                    this.navSections.push(...updatedSections);
                } else {
                    this.navSections.push(this.createDummySection());
                }
            }
        );
    }

    createConfigSection(): NavSection {
        const configNavSection = {
            title: 'Configuration',
            service_name: 'onos-config',
            views: new Array<UiView>()
        } as NavSection;
        configNavSection.views.push({
            id: 'dashboard',
            label: 'Dashboard'
        } as UiView);
        configNavSection.views.push({
            id: 'models',
            label: 'Models'
        } as UiView);

        return configNavSection;
    }

    createTopoSection(): NavSection {
        const topoNavSection = {
            title: 'Topology',
            service_name: 'onos-topo',
            views: new Array<UiView>()
        } as NavSection;
        topoNavSection.views.push({
            id: 'devices',
            label: 'Devices'
        } as UiView);

        return topoNavSection;
    }

    createRicSection(): NavSection {
        const ricNavSection = {
            title: 'RAN Controller',
            service_name: 'onos-ric',
            views: new Array<UiView>()
        } as NavSection;
        ricNavSection.views.push({
            id: 'uelinks',
            label: 'UE Links'
        } as UiView);

        return ricNavSection;
    }

    createRanSimSection(): NavSection {
        const ranSimNavSection = {
            title: 'RAN Simulator',
            service_name: 'ran-simulator',
            views: new Array<UiView>()
        } as NavSection;
        ranSimNavSection.views.push({
            id: 'mapview',
            label: 'Map View'
        } as UiView);

        return ranSimNavSection;
    }

    createDummySection(): NavSection {
        const dummyNavSection = {
            title: 'No Services Detected',
            service_name: '',
            views: new Array<UiView>()
        } as NavSection;

        return dummyNavSection;
    }
}

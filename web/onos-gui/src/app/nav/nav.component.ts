/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import {Component, OnInit, OnDestroy, ViewChild, Inject} from '@angular/core';
import { Meta } from '@angular/platform-browser';
import {trigger, state, style, animate, transition} from '@angular/animations';

import {
    LogService,
    NavService
} from 'gui2-fw-lib';
import {K8sClientService} from '../k8sclient.service';
import {Router} from '@angular/router';

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
    timer: any;
    configSection = this.createConfigSection();
    topoSection = this.createTopoSection();
    ricSection = this.createRicSection();
    ranSimSection = this.createRanSimSection();
    dummySection = this.createDummySection();

    constructor(
        private log: LogService,
        public ns: NavService,
        private k8s: K8sClientService,
        private meta: Meta,
        protected router: Router,
    ) {
        this.navSections = new Array<NavSection>();
        this.navSections.push(this.createDummySection());
        const nsMeta = this.meta.getTag('name=namespace');
        this.log.debug('NavComponent constructed', nsMeta.content);
    }

    ngOnInit() {
        // Load the menu at startup and refresh every 5 seconds
        this.updateNav(true);
        this.timer = setInterval(() => this.updateNav(false), 5000);
    }

    updateNav(init: boolean) {
        const updatedSections = new Array<NavSection>();
        this.k8s.monitorRunningServices().subscribe(
            (resp: string) => {
                switch (resp) {
                    case 'onos-config':
                        updatedSections.push(this.configSection);
                        break;
                    case 'onos-topo':
                        updatedSections.push(this.topoSection);
                        break;
                    case 'onos-ric':
                        updatedSections.push(this.ricSection);
                        break;
                    case 'ran-simulator':
                        updatedSections.push(this.ranSimSection);
                        break;
                }
            },
            error => {
                console.log('K8S API not available');
                this.navSections.length = 0;
                this.navSections.push(this.dummySection);
                clearInterval(this.timer); // Cancel retry - development mode
            },
            () => {
                this.navSections.length = 0;
                if (updatedSections.length > 0) {
                    this.navSections.push(...updatedSections);
                    if (init) {
                        const rsIdx = updatedSections.findIndex((ns) => ns.service_name === 'ran-simulator');
                        const ocIdx = updatedSections.findIndex((ns) => ns.service_name === 'onos-config');
                        // Default is onos-topo
                        if (rsIdx > -1) {
                            // if ran-sim exists use it instead
                            this.router.navigate(['ran-simulator']);
                        } else if (ocIdx > -1) {
                            // if not, but onos-config exists use it instead
                            this.router.navigate(['onos-config']);
                        }
                    }
                } else {
                    this.navSections.push(this.dummySection);
                }
            }
        );
    }

    private createConfigSection(): NavSection {
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

    private createTopoSection(): NavSection {
        const topoNavSection = {
            title: 'Topology',
            service_name: 'onos-topo',
            views: new Array<UiView>()
        } as NavSection;
        topoNavSection.views.push({
            id: 'entity',
            label: 'Entity'
        } as UiView);

        return topoNavSection;
    }

    private createRicSection(): NavSection {
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

    private createRanSimSection(): NavSection {
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

    private createDummySection(): NavSection {
        const dummyNavSection = {
            title: 'No Services Detected',
            service_name: '',
            views: new Array<UiView>()
        } as NavSection;

        return dummyNavSection;
    }
}

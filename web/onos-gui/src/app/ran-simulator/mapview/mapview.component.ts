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

import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ConnectivityService} from '../../connectivity.service';
import {RanSimulatorTrafficsimService} from '../proto/ran-simulator-trafficsim.service';
import * as L from 'leaflet';
import {
    Point,
    Tower
} from '../proto/github.com/onosproject/ran-simulator/api/types/types_pb';
import {Type} from '../proto/github.com/onosproject/ran-simulator/api/trafficsim/trafficsim_pb';

const CIRCLE_MIN_DIA = 200;
const CIRCLE_DEFAULT_DIA = 500;
const CIRCLE_MAX_DIA = 2000;
const FLASH_FOR_MS = 500;

const iconRetinaUrl = 'assets/sd-ran-a-letter-82.png';
const iconUrl = 'assets/sd-ran-a-letter-41.png';
const shadowUrl = 'assets/sd-ran-a-shadow-skew-41.png';
const iconDefault = L.icon({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
    iconSize: [40, 51],
    iconAnchor: [19, 25],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 50]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
    selector: 'onos-mapview',
    templateUrl: './mapview.component.html',
    styleUrls: ['./mapview.component.css']
})
export class MapviewComponent implements OnInit, OnDestroy, AfterViewInit {
    private map;
    zoom: number = 13;
    showRoutes = true;
    showMap = false;
    showPower = true;

    towerSub: Subscription;
    routesSub: Subscription;
    uesSub: Subscription;
    numRoutesOptions: number[] = [];
    numRoutes = 3;

    powerCircleMap: Map<string, L.circle>;
    towerMarkers: Map<string, L.marker>;

    constructor(
        private trafficSimService: RanSimulatorTrafficsimService,
        private connectivityService: ConnectivityService
    ) {
        this.powerCircleMap = new Map<string, L.circle>();
        this.towerMarkers = new Map<string, L.marker>();
    }

    ngOnInit() {
        this.connectivityService.hideVeil();
        this.trafficSimService.requestGetMapLayout().subscribe(
            (mapLayout) => {
                this.zoom = mapLayout.getZoom();
                this.showRoutes = mapLayout.getShowroutes();
                this.showMap = !mapLayout.getFade();
                this.showPower = mapLayout.getShowpower();
                this.numRoutesOptions = this.calculateNumUEsOptions(mapLayout.getMinUes(), mapLayout.getMaxUes());
                this.numRoutes = mapLayout.getCurrentRoutes();
                if (this.numRoutes === 0) { // TODO: Remove this hack to get around a bug
                    this.numRoutes = mapLayout.getMinUes();
                }
                this.initMap(mapLayout.getCenter(), mapLayout.getZoom());
            },
            (err) => {
                this.connectivityService.showVeil([
                    'GetMapLayout gRPC error', String(err.code), err.message,
                    'Please ensure ran-simulator is reachable',
                    'Choose a different application from the menu']);
                console.warn('Error connecting to ran-simulator', err);
            });
    }

    ngAfterViewInit(): void {
        this.towerSub = this.trafficSimService.requestListTowers().subscribe((resp) => {
            if (resp.getType() === Type.NONE || resp.getType() === Type.ADDED) {
                this.initTower(resp.getTower(), this.zoom);
            } else if (resp.getType() === Type.UPDATED) {
                this.updateTower(resp.getTower());
            } else if (resp.getType() === Type.REMOVED) {
                this.deleteTower(resp.getTower());
            } else {
                console.warn('Unhandled Route response type', resp.getType(), 'for', resp.getTower().getEcid());
            }
        }, err => {
            this.connectivityService.showVeil([
                'ListTowers gRPC error', String(err.code), err.message,
                'Please ensure ran-simulator is reachable',
                'Choose a different application from the menu']);
            console.error('Tower', err);
        });
    }

    ngOnDestroy(): void {
        if (this.towerSub !== undefined) {
            this.towerSub.unsubscribe();
        }
        if (this.routesSub !== undefined) {
            this.routesSub.unsubscribe();
        }
        if (this.uesSub !== undefined) {
            this.uesSub.unsubscribe();
        }
    }

    private initMap(centre: Point, zoom: number): void {
        console.log('Creating map at Lat,Lng: ', centre.getLat(), centre.getLng(), zoom);
        this.map = L.map('map', {
            center: [centre.getLat(), centre.getLng()],
            zoom: zoom
        });

        const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });

        tiles.addTo(this.map);
    }

    changeNumUes(numUEs: number) {
        this.trafficSimService.requestSetNumUes(numUEs).subscribe(
            (resp) => {
                console.log('Set successful', resp.getNumber());
            },
            (err) => {
                console.error('Setting num UEs failed', err);
            });
    }

    private calculateNumUEsOptions(min: number, max: number): number[] {
        const options = new Array<number>();
        options.push(min);
        for (let i = Math.log10(min) + 0.5; i < Math.log10(max); i = i + 0.5) {
            const next = Math.pow(10, i);
            options.push(Math.round(next / 10) * 10);
        }
        options.push(max);
        return options;
    }

    private initTower(tower: Tower, zoom: number): void {
        const towerMarker = L.marker([tower.getLocation().getLat(), tower.getLocation().getLng()],
            {title: tower.getEcid() + ' ' + this.roundNumber(tower.getTxpowerdb(), 'dB')});
        towerMarker.addTo(this.map);
        this.towerMarkers.set(tower.getEcid(), towerMarker);

        const powerCircle = L.circle([tower.getLocation().getLat(), tower.getLocation().getLng()],
            this.powerToRadius(tower.getTxpowerdb()),
            {
                fillOpacity: 0,
                color: tower.getColor(), // strokeColor
                weight: 0.9, // strokeWeight
                opacity: this.showPower ? 1 : 0 // strokeopacity
            });
        powerCircle.addTo(this.map);
        this.powerCircleMap.set(tower.getEcid(), powerCircle);
    }

    private updateTower(tower: Tower): void {
        console.log('Updated tower power', tower.getEcid(), this.roundNumber(tower.getTxpowerdb(), 'dB'));
        this.powerCircleMap.get(tower.getEcid()).setRadius(this.powerToRadius(tower.getTxpowerdb()));

        const previousIcon = this.towerMarkers.get(tower.getEcid()).getIcon();
        this.towerMarkers.get(tower.getEcid()).setIcon(L.icon({
            iconRetinaUrl,
            iconUrl,
            shadowUrl,
            iconSize: [60, 75],
            iconAnchor: [19, 25],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28],
            shadowSize: [41, 50]
        }));
        // TODO check this is effective
        this.towerMarkers.get(tower.getEcid()).setTitle(tower.getEcid() + ' ' + this.roundNumber(tower.getTxpowerdb(), 'dB'));
        setTimeout(() => {
            this.towerMarkers.get(tower.getEcid()).setIcon(previousIcon);
        }, FLASH_FOR_MS);
    }

    private deleteTower(tower: Tower) {
        this.towerMarkers.get(tower.getEcid()).remove();
        this.towerMarkers.delete(tower.getEcid());
        this.powerCircleMap.get(tower.getEcid()).remove();
        this.powerCircleMap.delete(tower.getEcid());
    }

    private powerToRadius(powerdB: number): number {
        const power = Math.pow(10, powerdB / 10);
        const distance = Math.sqrt(power) * CIRCLE_DEFAULT_DIA;
        // console.log('Power calc:', powerUnsigneddB, this.powerSigned(powerUnsigneddB), power, distance);
        if (distance < CIRCLE_MIN_DIA) {
            return CIRCLE_MIN_DIA;
        } else if (distance > CIRCLE_MAX_DIA) {
            return CIRCLE_MAX_DIA;
        }
        return distance;
    }

    private roundNumber(value: number, suffix: string = '', roundPlaces: number = 2): string {
        const scale = Math.pow(10, roundPlaces);
        return Math.round(value * scale) / scale + suffix;
    }

    updateRoutes(update: boolean) {
    }

    updateMap(update: boolean) {
    }

    updatePower(update: boolean) {
        this.powerCircleMap.forEach((pc) => {
            if (update) {
                pc.addTo(this.map);
            } else {
                pc.remove();
            }
        });
    }

}

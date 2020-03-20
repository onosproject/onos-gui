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
import {Subscription} from 'rxjs';
import {ConnectivityService} from '../../connectivity.service';
import {RanSimulatorTrafficsimService} from '../proto/ran-simulator-trafficsim.service';
import * as L from 'leaflet';
import {
    Point,
    Tower,
    Route,
    Ue,
} from '../proto/github.com/onosproject/ran-simulator/api/types/types_pb';
import {
    ListUesResponse,
    Type,
    UpdateType
} from '../proto/github.com/onosproject/ran-simulator/api/trafficsim/trafficsim_pb';

const CIRCLE_MIN_DIA = 200;
const CIRCLE_DEFAULT_DIA = 500;
const CIRCLE_MAX_DIA = 2000;
const FLASH_FOR_MS = 500;

export const CAR_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 47.032 47.032"><path style="fill: #000000; stroke-width: 1; stroke: #000001; transform-origin: 50% 50%; transform: rotate(0deg)"
 d="M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759
c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z
 M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713
v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336
h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805z"/></svg>`;

const iconRetinaUrl = 'assets/sd-ran-a-letter-82.png';
const iconUrl = 'assets/sd-ran-a-letter-41.png';
const shadowUrl = 'assets/sd-ran-a-shadow-skew-41.png';
const iconDefault = L.icon({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
    iconSize: [20, 25],
    iconAnchor: [10, 12],
    popupAnchor: [1, -34],
    tooltipAnchor: [10, -12],
    shadowSize: [20, 25]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
    selector: 'onos-mapview',
    templateUrl: './mapview.component.html',
    styleUrls: ['./mapview.component.css']
})
export class MapviewComponent implements OnInit, OnDestroy {
    private map: L.Map;
    private tiles: L.TileLayer;
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
    routePolylines: Map<string, L.polyline>;
    ueMap: Map<string, L.marker>;
    ueLineMap: Map<string, L.polyline>;

    constructor(
        private trafficSimService: RanSimulatorTrafficsimService,
        private connectivityService: ConnectivityService
    ) {
        this.powerCircleMap = new Map<string, L.circle>();
        this.towerMarkers = new Map<string, L.marker>();
        this.routePolylines = new Map<string, L.polyline>();
        this.ueMap = new Map<string, L.marker>();
        this.ueLineMap = new Map<string, L.polyline>();
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

                // Only after the map tiles have loaded can we start listening for streams
                this.startListeningTowers();
                this.startListeningRoutes();
                this.startListeningUEs();
            },
            (err) => {
                this.connectivityService.showVeil([
                    'GetMapLayout gRPC error', String(err.code), err.message,
                    'Please ensure ran-simulator is reachable',
                    'Choose a different application from the menu']);
                console.warn('Error connecting to ran-simulator', err);
            });
    }

    private startListeningTowers(): void {
        this.towerSub = this.trafficSimService.requestListTowers().subscribe((resp) => {
            if (resp.getType() === Type.NONE || resp.getType() === Type.ADDED) {
                this.initTower(resp.getTower(), this.zoom);
            } else if (resp.getType() === Type.UPDATED) {
                this.updateTower(resp.getTower());
            } else if (resp.getType() === Type.REMOVED) {
                this.deleteTower(resp.getTower());
            } else {
                console.warn('Unhandled Tower response type', resp.getType(), 'for', resp.getTower().getEcid());
            }
        }, err => {
            this.connectivityService.showVeil([
                'ListTowers gRPC error', String(err.code), err.message,
                'Please ensure ran-simulator is reachable',
                'Choose a different application from the menu']);
            console.error('Tower', err);
        });
    }

    private startListeningRoutes() {
        // Get the list of routes - we're doing this here because we need to wait until `map` object is populated
        this.routesSub = this.trafficSimService.requestListRoutes().subscribe((resp) => {
            if (resp.getType() === Type.NONE || resp.getType() === Type.ADDED) {
                this.initRoute(resp.getRoute());
            } else if (resp.getType() === Type.UPDATED) {
                this.updateRoute(resp.getRoute());
            } else if (resp.getType() === Type.REMOVED) {
                this.deleteRoute(resp.getRoute());
            } else {
                console.warn('Unhandled Route response type', resp.getType(), 'for', resp.getRoute().getName());
            }
        }, err => {
            this.connectivityService.showVeil([
                'ListRoutes gRPC error', String(err.code), err.message,
                'Please ensure ran-simulator is reachable',
                'Choose a different application from the menu']);
            console.error('Routes', err);
        });
    }

    private startListeningUEs() {
        this.uesSub = this.trafficSimService.requestListUes().subscribe((resp: ListUesResponse) => {
            if (resp.getType() === Type.NONE || resp.getType() === Type.ADDED) {
                this.initUe(resp.getUe());
            } else if (resp.getType() === Type.UPDATED) {
                this.updateUe(resp.getUe(), resp.getUpdateType());
            } else if (resp.getType() === Type.REMOVED) {
                this.ueMap.get(resp.getUe().getName()).remove();
                this.ueMap.delete(resp.getUe().getName());
                this.ueLineMap.get(resp.getUe().getName()).remove();
                this.ueLineMap.delete(resp.getUe().getName());
            } else {
                console.warn('Unhandled Ue response type', resp.getType(), 'for', resp.getUe().getName());
            }
        }, err => {
            this.connectivityService.showVeil([
                'ListRoutes gRPC error', String(err.code), err.message,
                'Please ensure ran-simulator is reachable',
                'Choose a different application from the menu']);
            console.error('UEs', err);
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
            zoom: zoom,
            renderer: L.svg()
        });

        this.tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: `&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>`,
            opacity: (this.showMap ? 0.8 : 0.3),
        });

        this.tiles.addTo(this.map);
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
            {title: tower.getEcid() + ' ' + this.roundNumber(tower.getTxpowerdb(), 'dB'),
             color: tower.getColor()});
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

    private initRoute(route: Route): void {
        const latLngs = new Array();
        route.getWaypointsList().forEach((point: Point) => {
            latLngs.push([point.getLat(), point.getLng()] as number[]);
        });
        const polyline = new L.polyline(latLngs, {
            color: route.getColor(),
            dashArray: [4],
            opacity: 0.8,
            weight: 2
        });
        this.routePolylines.set(route.getName(), polyline);
        polyline.addTo(this.map);
    }

    private updateRoute(route: Route) {
        console.log('Recalculate new route', route.getName());
        const latLngs = new Array();
        route.getWaypointsList().forEach((point: Point) => {
            latLngs.push([point.getLat(), point.getLng()] as number[]);
        });
        this.routePolylines.get(route.getName()).setLatLngs(latLngs);
        this.routePolylines.get(route.getName()).setStyle({
            color: route.getColor(),
        });
    }

    private deleteRoute(route: Route): void {
        const routePolyline = this.routePolylines.get(route.getName());
        routePolyline.remove();
        this.routePolylines.delete(route.getName());
    }

    private initUe(ue: Ue): void {
        const ueIcon = L.divIcon({
            html: CAR_ICON,
            className: 'ue-div-icon',
            iconSize: [20, 20],
            iconAnchor: [10, 10],
            popupAnchor: [0, -10],
        });

        const ueMarker = L.marker([ue.getPosition().getLat(), ue.getPosition().getLng()],
            {icon: ueIcon});
        ueMarker.bindPopup('<p>' + ue.getName() + '<br>Serving: ' +
            ue.getServingTower() + '<br>1st:' + ue.getTower1() +
            '<br>2nd:' + ue.getTower2() + '<br>3rd: ' + ue.getTower3() + '</p>').openPopup();
        this.ueMap.set(ue.getName(), ueMarker);
        ueMarker.addTo(this.map);

        const tower = this.towerMarkers.get(ue.getServingTower());
        let towerPos: L.LatLng;
        let towerColor: string;
        if (tower === undefined) { // May happen at startup - will be corrected on update
            towerPos = new L.LatLng(ue.getPosition().getLat(), ue.getPosition().getLng());
            towerColor = 'black';
        } else {
            towerPos = tower.getLatLng();
            towerColor = tower.options.color;
        }
        const ueLine = L.polyline([
                [ue.getPosition().getLat(), ue.getPosition().getLng()],
                towerPos
            ], {color: towerColor, weight: 2});
        this.ueLineMap.set(ue.getName(), ueLine);
        ueLine.addTo(this.map);
    }

    private updateUe(ue: Ue, updateType: UpdateType): void {
        const uePosition = new L.LatLng(ue.getPosition().getLat(), ue.getPosition().getLng());
        const servingTower = this.towerMarkers.get(ue.getServingTower());
        this.ueMap.get(ue.getName()).setLatLng(uePosition);
        const rotation = (270 - ue.getRotation()) + 'deg';
        const ueIcon = L.divIcon({
            html: CAR_ICON.replace('#000000', servingTower.options.color).replace('0deg', rotation),
            className: 'ue-div-icon',
            iconSize: [20, 20],
            iconAnchor: [10, 10],
            popupAnchor: [0, -10],
        });
        const ueIconLarge = L.divIcon({
            html: CAR_ICON.replace('#000000', servingTower.options.color).replace('0deg', rotation),
            className: 'ue-div-icon',
            iconSize: [30, 30],
            iconAnchor: [10, 10],
            popupAnchor: [0, -10],
        });
        if (updateType === UpdateType.HANDOVER) {
            this.ueMap.get(ue.getName()).setIcon(ueIconLarge);
            console.log('HANDOVER on', ue.getName(), 'to', ue.getServingTower());
            setTimeout(() => {
                this.ueMap.get(ue.getName()).setIcon(ueIcon);
            }, 2000);
        } else {
            this.ueMap.get(ue.getName()).setIcon(ueIcon);
        }

        this.ueLineMap.get(ue.getName()).setLatLngs([uePosition, servingTower.getLatLng()]);
        this.ueLineMap.get(ue.getName()).setStyle({color: servingTower.options.color});
    }

    updateRoutes(update: boolean) {
        this.routePolylines.forEach((r) => {
            if (update) {
                r.addTo(this.map);
            } else {
                r.remove();
            }
        });
    }

    updateMap(update: boolean) {
        if (update) {
            this.tiles.setOpacity(0.8);
        } else {
            this.tiles.setOpacity(0.3);
        }
        console.log('Map opacity set to', this.map.options.opacity);
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

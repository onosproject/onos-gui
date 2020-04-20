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
    Cell,
    Route,
    Ue, ECGI,
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
    connected = true;

    cellSub: Subscription;
    routesSub: Subscription;
    uesSub: Subscription;
    numRoutesOptions: number[] = [];
    numRoutes = 3;

    powerArcMap: Map<string, L.circle>;
    cellMarkers: Map<string, L.marker>;
    routePolylines: Map<number, L.polyline>;
    ueMap: Map<number, L.marker>;
    ueLineMap: Map<number, L.polyline>;

    constructor(
        private trafficSimService: RanSimulatorTrafficsimService,
        private connectivityService: ConnectivityService
    ) {
        this.powerArcMap = new Map<string, L.circle>();
        this.cellMarkers = new Map<string, L.marker>();
        this.routePolylines = new Map<number, L.polyline>();
        this.ueMap = new Map<number, L.marker>();
        this.ueLineMap = new Map<number, L.polyline>();
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
                this.startListeningCells(true);
                setTimeout(() => { // Wait for initial cells to arrive
                    this.startListeningRoutes(true);
                    this.startListeningUEs(true);
                }, 200);
            },
            (err) => {
                this.connectivityService.showVeil([
                    'GetMapLayout gRPC error', String(err.code), err.message,
                    'Please ensure ran-simulator is reachable',
                    'Choose a different application from the menu']);
                console.warn('Error connecting to ran-simulator', err);
            });
    }

    private startListeningCells(asStream: boolean): void {
        this.cellSub = this.trafficSimService.requestListCells(asStream).subscribe((resp) => {
            if (resp.getType() === Type.NONE || resp.getType() === Type.ADDED) {
                this.initCell(resp.getCell(), this.zoom);
            } else if (resp.getType() === Type.UPDATED) {
                this.updateCell(resp.getCell());
            } else if (resp.getType() === Type.REMOVED) {
                this.deleteCell(resp.getCell());
            } else {
                console.warn('Unhandled Cell response type', resp.getType(), 'for', resp.getCell().getEcgi());
            }
        }, err => {
            this.connectivityService.showVeil([
                'ListCells gRPC error', String(err.code), err.message,
                'Please ensure ran-simulator is reachable',
                'Choose a different application from the menu']);
            console.error('Cell', err);
        });
    }

    private startListeningRoutes(asStream: boolean) {
        // Get the list of routes - we're doing this here because we need to wait until `map` object is populated
        this.routesSub = this.trafficSimService.requestListRoutes(asStream).subscribe((resp) => {
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

    private startListeningUEs(asStream: boolean) {
        this.uesSub = this.trafficSimService.requestListUes(asStream).subscribe((resp: ListUesResponse) => {
            if (resp.getType() === Type.NONE || resp.getType() === Type.ADDED) {
                this.initUe(resp.getUe());
            } else if (resp.getType() === Type.UPDATED) {
                this.updateUe(resp.getUe(), resp.getUpdateType());
            } else if (resp.getType() === Type.REMOVED) {
                this.ueMap.get(resp.getUe().getImsi()).remove();
                this.ueMap.delete(resp.getUe().getImsi());
                this.ueLineMap.get(resp.getUe().getImsi()).remove();
                this.ueLineMap.delete(resp.getUe().getImsi());
            } else {
                console.warn('Unhandled Ue response type', resp.getType(), 'for', resp.getUe().getImsi());
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
        if (this.cellSub !== undefined) {
            this.cellSub.unsubscribe();
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

    private initCell(cell: Cell, zoom: number): void {
        const cellMarker = L.marker([cell.getLocation().getLat(), cell.getLocation().getLng()],
            {title: cell.getEcgi().getEcid() + ' ' + this.roundNumber(cell.getTxpowerdb(), 'dB'),
             color: cell.getColor()});
        cellMarker.addTo(this.map);
        this.cellMarkers.set(String(cell.getEcgi()), cellMarker);

        const powerCircle = L.circle([cell.getLocation().getLat(), cell.getLocation().getLng()],
            this.powerToRadius(cell.getTxpowerdb()),
            {
                fillOpacity: 0,
                color: cell.getColor(), // strokeColor
                weight: 0.9, // strokeWeight
                opacity: this.showPower ? 1 : 0 // strokeopacity
            });
        powerCircle.addTo(this.map);
        this.powerArcMap.set(String(cell.getEcgi()), powerCircle);
    }

    private updateCell(cell: Cell): void {
        console.log('Updated cell power', cell.getEcgi(), this.roundNumber(cell.getTxpowerdb(), 'dB'));
        this.powerArcMap.get(String(cell.getEcgi())).setRadius(this.powerToRadius(cell.getTxpowerdb()));

        const previousIcon = this.cellMarkers.get(String(cell.getEcgi())).getIcon();
        this.cellMarkers.get(String(cell.getEcgi())).setIcon(L.icon({
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
        this.cellMarkers.get(String(cell.getEcgi())).bindTooltip(cell.getEcgi() + ' ' + this.roundNumber(cell.getTxpowerdb(), 'dB'));
        setTimeout(() => {
            this.cellMarkers.get(String(cell.getEcgi())).setIcon(previousIcon);
        }, FLASH_FOR_MS);
    }

    private deleteCell(cell: Cell) {
        this.cellMarkers.get(String(cell.getEcgi())).remove();
        this.cellMarkers.delete(String(cell.getEcgi()));
        this.powerArcMap.get(String(cell.getEcgi())).remove();
        this.powerArcMap.delete(String(cell.getEcgi()));
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
        const latLngs = [];
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
        const servingCell = this.cellMarkers.get(String(ue.getServingTower()));
        const rotation = (270 - ue.getRotation()) + 'deg';
        const ueIcon = L.divIcon({
            html: CAR_ICON.replace('#000000', servingCell.options.color).replace('0deg', rotation),
            className: 'ue-div-icon',
            iconSize: [20, 20],
            iconAnchor: [10, 10],
            popupAnchor: [0, -10],
        });

        const ueMarker = L.marker([ue.getPosition().getLat(), ue.getPosition().getLng()],
            {icon: ueIcon});
        ueMarker.bindPopup('<p>' + ue.getImsi() + '<br>Imsi: ' +
            ue.getImsi() + '<br>Serving: ' +
            ue.getServingTower() + '<br>1st:' + ue.getTower1() +
            '<br>2nd:' + ue.getTower2() + '<br>3rd: ' + ue.getTower3() + '</p>').openPopup();
        this.ueMap.set(ue.getImsi(), ueMarker);
        ueMarker.addTo(this.map);

        let cellPos: L.LatLng;
        let cellColor: string;
        if (servingCell === undefined) { // May happen at startup - will be corrected on update
            cellPos = new L.LatLng(ue.getPosition().getLat(), ue.getPosition().getLng());
            cellColor = 'black';
        } else {
            cellPos = servingCell.getLatLng();
            cellColor = servingCell.options.color;
        }
        const ueLine = L.polyline([
                [ue.getPosition().getLat(), ue.getPosition().getLng()],
                cellPos
            ], {color: cellColor, weight: 2});
        this.ueLineMap.set(ue.getImsi(), ueLine);
        ueLine.addTo(this.map);
    }

    private updateUe(ue: Ue, updateType: UpdateType): void {
        const uePosition = new L.LatLng(ue.getPosition().getLat(), ue.getPosition().getLng());
        const servingCell = this.cellMarkers.get(String(ue.getServingTower()));
        this.ueMap.get(ue.getImsi()).setLatLng(uePosition);
        const rotation = (270 - ue.getRotation()) + 'deg';
        const ueIcon = L.divIcon({
            html: CAR_ICON.replace('#000000', servingCell.options.color).replace('0deg', rotation),
            className: 'ue-div-icon',
            iconSize: [20, 20],
            iconAnchor: [10, 10],
            popupAnchor: [0, -10],
        });
        const ueIconLarge = L.divIcon({
            html: CAR_ICON.replace('#000000', servingCell.options.color).replace('0deg', rotation),
            className: 'ue-div-icon',
            iconSize: [30, 30],
            iconAnchor: [10, 10],
            popupAnchor: [0, -10],
        });
        if (updateType === UpdateType.HANDOVER) {
            this.ueMap.get(ue.getImsi()).setIcon(ueIconLarge);
            console.log('HANDOVER on', ue.getImsi(), 'to', String(ue.getServingTower()));
            setTimeout(() => {
                if (this.ueMap.has(ue.getImsi())) { // might have disappeared in number is reduced
                    this.ueMap.get(ue.getImsi()).setIcon(ueIcon);
                }
            }, 2000);
        } else {
            this.ueMap.get(ue.getImsi()).setIcon(ueIcon);
        }

        this.ueLineMap.get(ue.getImsi()).setLatLngs([uePosition, servingCell.getLatLng()]);
        this.ueLineMap.get(ue.getImsi()).setStyle({color: servingCell.options.color});
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
        this.powerArcMap.forEach((pc) => {
            if (update) {
                pc.addTo(this.map);
            } else {
                pc.remove();
            }
        });
    }

    connectMap(connected: boolean) {
        if (connected) {
            console.log('Connected to gRPC streams');
            this.clearMapAndRefresh(true);
        } else {
            console.log('Disconnected from gRPC streams');
            this.uesSub.unsubscribe();
            this.routesSub.unsubscribe();
            this.cellSub.unsubscribe();
        }
    }

    refreshMap() {
        if (!this.connected) {
            this.clearMapAndRefresh(false);
        }
    }

    private clearMapAndRefresh(streaming: boolean) {
        if (!this.connected || streaming) {
            console.log('Clearing map and refreshing map. Streaming?', streaming);
            this.ueLineMap.forEach((u) => u.remove());
            this.ueLineMap.clear();
            this.ueMap.forEach((ue) => ue.remove());
            this.ueMap.clear();
            this.routePolylines.forEach((r) => r.remove());
            this.routePolylines.clear();
            this.powerArcMap.forEach((p) => p.remove());
            this.powerArcMap.clear();
            this.cellMarkers.forEach((t) => t.remove());
            this.cellMarkers.clear();

            this.startListeningCells(streaming);
            setTimeout(() => { // Wait for cells to finish
                this.startListeningRoutes(streaming);
                this.startListeningUEs(streaming);
            }, 200);
        }
    }
}

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
import 'leaflet-curve';
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
import {BeamCalculator} from './beam';
import {Utils} from './util';

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
const iconDefault = new L.Icon({
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

    cellMarkers: Map<string, L.Marker>;
    beamCurves: Map<string, L.Curve>;
    beamCalcs: Map<string, BeamCalculator>;
    centroidPLines: Map<string, L.Polyline>;
    routePolylines: Map<number, L.Polyline>;
    ueMap: Map<number, L.Marker>;
    ueLineMap: Map<number, L.Polyline>;

    constructor(
        private trafficSimService: RanSimulatorTrafficsimService,
        private connectivityService: ConnectivityService
    ) {
        this.cellMarkers = new Map<string, L.Marker>();
        this.beamCurves = new Map<string, L.Curve>();
        this.beamCalcs = new Map<string, BeamCalculator>();
        this.centroidPLines = new Map<string, L.Polyline>();
        this.routePolylines = new Map<number, L.Polyline>();
        this.ueMap = new Map<number, L.Marker>();
        this.ueLineMap = new Map<number, L.Polyline>();
    }

    private static calculateNumUEsOptions(min: number, max: number): number[] {
        const options = new Array<number>();
        options.push(min);
        for (let i = Math.log10(min) + 0.5; i < Math.log10(max); i = i + 0.5) {
            const next = Math.pow(10, i);
            options.push(Math.round(next / 10) * 10);
        }
        options.push(max);
        return options;
    }

    ngOnInit() {
        this.connectivityService.hideVeil();
        this.trafficSimService.requestGetMapLayout().subscribe(
            (mapLayout) => {
                this.zoom = mapLayout.getZoom();
                this.showRoutes = mapLayout.getShowroutes();
                this.showMap = !mapLayout.getFade();
                this.showPower = mapLayout.getShowpower();
                this.numRoutesOptions = MapviewComponent.calculateNumUEsOptions(mapLayout.getMinUes(), mapLayout.getMaxUes());
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
                this.initCell(resp.getCell());
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
        this.map = new L.Map('map', {
            center: [centre.getLat(), centre.getLng()],
            zoom: zoom,
            renderer: L.svg()
        });

        this.tiles = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
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

    private initCell(cell: Cell): void {
        const cellMarker = new L.Marker([cell.getLocation().getLat(), cell.getLocation().getLng()],
            {title: cell.getEcgi().getEcid() + ' ' + Utils.roundNumber(cell.getTxpowerdb(), 'dB')});
        cellMarker.addTo(this.map);
        this.cellMarkers.set(String(cell.getEcgi()), cellMarker);

        const beamCalc = new BeamCalculator(
            cell.getLocation(),
            cell.getSector().getAzimuth(),
            cell.getSector().getArc());
        const beamCurve = beamCalc.updateCentroid(cell.getSector().getCentroid());
        beamCurve.options.color = cell.getColor();
        beamCurve.addTo(this.map);
        this.beamCurves.set(String(cell.getEcgi()), beamCurve);
        this.beamCalcs.set(String(cell.getEcgi()), beamCalc);

        const centroidPLine = new L.Polyline([
            [cell.getLocation().getLat(), cell.getLocation().getLng()],
            [cell.getSector().getCentroid().getLat(), cell.getSector().getCentroid().getLng()]
        ], {
            color: cell.getColor(),
            dashArray: [5],
            opacity: 0.6,
            weight: 3
        });
        centroidPLine.addTo(this.map);
        this.centroidPLines.set(String(cell.getEcgi()), centroidPLine);
    }

    private updateCell(cell: Cell): void {
        console.log('Updated cell power', cell.getEcgi(), cell.getTxpowerdb(), 'dB. Centroid: ',
            cell.getSector().getCentroid().getLat(), cell.getSector().getCentroid().getLng());

        this.centroidPLines.get(String(cell.getEcgi())).setLatLngs([
            [cell.getLocation().getLat(), cell.getLocation().getLng()],
            [cell.getSector().getCentroid().getLat(), cell.getSector().getCentroid().getLng()]
        ]);

        const beamCurve = this.beamCalcs.get(String(cell.getEcgi())).updateCentroid(cell.getSector().getCentroid());
        beamCurve.options.color = cell.getColor();
        this.beamCurves.get(String(cell.getEcgi())).remove();
        this.beamCurves.set(String(cell.getEcgi()), beamCurve);
        beamCurve.addTo(this.map);

        const previousIcon = this.cellMarkers.get(String(cell.getEcgi())).getIcon();
        this.cellMarkers.get(String(cell.getEcgi())).setIcon(new L.Icon({
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
        this.cellMarkers.get(String(cell.getEcgi())).bindTooltip(cell.getEcgi() + ' ' + Utils.roundNumber(cell.getTxpowerdb(), 'dB'));
        setTimeout(() => {
            this.cellMarkers.get(String(cell.getEcgi())).setIcon(previousIcon);
        }, FLASH_FOR_MS);
    }

    private deleteCell(cell: Cell) {
        this.cellMarkers.get(String(cell.getEcgi())).remove();
        this.cellMarkers.delete(String(cell.getEcgi()));
        this.beamCurves.get(String(cell.getEcgi())).remove();
        this.beamCurves.delete(String(cell.getEcgi()));
        this.centroidPLines.get(String(cell.getEcgi())).remove();
        this.centroidPLines.delete(String(cell.getEcgi()));
    }

    private initRoute(route: Route): void {
        const latLngs: L.LatLng[] = [];
        route.getWaypointsList().forEach((point: Point) => {
            latLngs.push(new L.LatLng(point.getLat(), point.getLng()));
        });
        const polyline = new L.Polyline(latLngs, {
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
        const latLngs: L.LatLng[] = [];
        route.getWaypointsList().forEach((point: Point) => {
            latLngs.push(new L.LatLng(point.getLat(), point.getLng()));
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
        const servingCell = this.centroidPLines.get(String(ue.getServingTower()));
        const scColor = servingCell.options.color;
        const rotation = (270 - ue.getRotation()) + 'deg';
        const ueIcon = new L.DivIcon({
            html: CAR_ICON
                .replace('#000000', scColor)
                .replace('0deg', rotation),
            className: 'ue-div-icon',
            iconSize: [20, 20],
            iconAnchor: [10, 10],
            popupAnchor: [0, -10],
        });

        const ueMarker = new L.Marker([ue.getPosition().getLat(), ue.getPosition().getLng()],
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
            const cellCentroidPline = servingCell.getLatLngs() as L.LatLng[];
            cellPos = cellCentroidPline[1];
            cellColor = scColor;
        }
        const ueLine = new L.Polyline([
            [ue.getPosition().getLat(), ue.getPosition().getLng()],
            cellPos
        ], {color: cellColor, weight: 2});
        this.ueLineMap.set(ue.getImsi(), ueLine);
        ueLine.addTo(this.map);
    }

    private updateUe(ue: Ue, updateType: UpdateType): void {
        const uePosition = new L.LatLng(ue.getPosition().getLat(), ue.getPosition().getLng());
        const servingCell: L.Polyline = this.centroidPLines.get(String(ue.getServingTower()));
        const scColor = servingCell.options.color;
        this.ueMap.get(ue.getImsi()).setLatLng(uePosition);
        const rotation = (270 - ue.getRotation()) + 'deg';
        const ueIcon = new L.DivIcon({
            html: CAR_ICON
                .replace('#000000', scColor)
                .replace('0deg', rotation),
            className: 'ue-div-icon',
            iconSize: [20, 20],
            iconAnchor: [10, 10],
            popupAnchor: [0, -10],
        });
        const ueIconLarge = new L.DivIcon({
            html: CAR_ICON
                .replace('#000000', scColor)
                .replace('0deg', rotation),
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
        const cellCentroidPline = servingCell.getLatLngs() as L.LatLng[];
        this.ueLineMap.get(ue.getImsi()).setLatLngs([uePosition, cellCentroidPline[1]]);
        this.ueLineMap.get(ue.getImsi()).setStyle({color: scColor});
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
        console.log('Map opacity set to', this.tiles.options.opacity);
    }

    updatePower(update: boolean) {
        this.beamCurves.forEach((bc) => {
            if (update) {
                bc.addTo(this.map);
            } else {
                bc.remove();
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
            this.beamCurves.forEach((bc) => bc.remove());
            this.beamCurves.clear();
            this.centroidPLines.forEach((cm) => cm.remove());
            this.centroidPLines.clear();
            this.cellMarkers.forEach((t) => t.remove());
            this.cellMarkers.clear();

            this.startListeningCells(streaming);
            setTimeout(() => { // Wait for cells to finish
                this.startListeningRoutes(streaming);
                this.startListeningUEs(streaming);
            }, 200);
        }
    }

    adjustZoom(event: any) {
        console.log('Map zoomed', event);
    }
}

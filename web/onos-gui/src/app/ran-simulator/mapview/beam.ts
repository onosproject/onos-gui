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

import {Point} from '../proto/github.com/onosproject/ran-simulator/api/types/types_pb';
import * as L from 'leaflet';
import 'leaflet-curve';

interface Side {
    pts: L.LatLng[];
}

interface Hexagon {
    start: L.LatLng;
    sides: Side[];
}

const INITIAL_SCALE = 0.01;
const CENTROID_SCALE = 0.1;
const LEFT = 0;
const TOP = 1;
const RIGHT = 2;
const CP1 = 0;
const CP2 = 1;
const END = 2;

/**
 * Create a bezier cubic curve for the beam.
 * It is approximating a hexagonal shape - to start it's made of 3 identical polylines:
 *
 * the 3 are named left, top and right sides and are rotated 0, 120 and 240 degrees
 */
export class BeamCalculator {
    private readonly centre: Point;
    private readonly origCentroid: Point;
    private readonly origCentrDist: number;
    private readonly aspectRatio: number;
    private readonly rotationAngle: number;
    private readonly arc: number;
    beamCurve: L.Curve;

    constructor(centre: Point, azimuth: number, arc: number, centroid: Point, aspectRatio: number) {
        this.centre = centre;
        this.origCentroid = centroid;
        this.origCentrDist = Math.hypot(centroid.getLat() - this.centre.getLat(), centroid.getLng() - this.centre.getLng());
        this.arc = arc;
        this.rotationAngle = 90 - azimuth;
        this.aspectRatio = aspectRatio;

        const hex = this.calculateHexagon();

        const newHex = this.transformHexagon(this.centre, hex, this.arc);

        const rotated = this.rotateBeam(newHex, this.rotationAngle - 90, this.centre);

        const adjusted = this.aspectAdjust(rotated);

        this.beamCurve = this.convertHexToCurve(adjusted);
    }

    updateCentroid(centroid: Point): number {
        const scale = this.centroidScale(centroid);
        // Only scale pts 3-5, 7-8, 10-11
        for (let i = 3; i < 12; i++) {
            if (i === 6 || i === 9) {
                continue;
            }
            const lat: number = <number><unknown>(this.beamCurve.getPath()[i][0]);
            const scaledLat = (lat - this.centre.getLat()) * scale + this.centre.getLat();
            // @ts-ignore
            this.beamCurve.getPath()[i][0] = String(scaledLat);
            const lng: number = <number><unknown>(this.beamCurve.getPath()[i][1]);
            const scaledLng = (lng - this.centre.getLng()) * scale + this.centre.getLng();
            // @ts-ignore
            this.beamCurve.getPath()[i][1] = String(scaledLng);

            // console.log('Pt:', scale, lat, scaledLat, lng, scaledLng);
        }

        return scale;
    }

    private centroidScale(newCentroid: Point): number {
        const newDist = Math.hypot(newCentroid.getLat() - this.centre.getLat(), newCentroid.getLng() - this.centre.getLng());
        return newDist / this.origCentrDist;
    }

    private convertHexToCurve(hex: Hexagon): L.Curve {
        const beamCurve = L.curve(['M', [hex.start.lat, hex.start.lng], 'C',
                [hex.sides[LEFT].pts[CP1].lat, hex.sides[LEFT].pts[CP1].lng],
                [hex.sides[LEFT].pts[CP2].lat, hex.sides[LEFT].pts[CP2].lng],
                [hex.sides[LEFT].pts[END].lat, hex.sides[LEFT].pts[END].lng],
                'S', // Smooth to CP2 of previous
                [hex.sides[TOP].pts[CP2].lat, hex.sides[TOP].pts[CP2].lng],
                [hex.sides[TOP].pts[END].lat, hex.sides[TOP].pts[END].lng],
                'S', // Smooth to CP2 of previous
                [hex.sides[RIGHT].pts[CP2].lat, hex.sides[RIGHT].pts[CP2].lng],
                [hex.sides[RIGHT].pts[END].lat, hex.sides[RIGHT].pts[END].lng], 'Z'],
            {fill: true, stroke: false, opacity: 0.5}
        );

        return beamCurve;
    }

    private rotateBeam(hex: Hexagon, angle: number, centre?: Point): Hexagon {
        const sides = [];
        for (let i = LEFT; i <= RIGHT; i++) {
            sides[i] = {pts: []} as Side;
            for (let j = CP1; j <= END; j++) {
                sides[i].pts[j] = this.rotatePoint(hex.sides[i].pts[j], angle, centre);
            }
        }
        return {
            start: hex.start,
            sides: sides
        } as Hexagon;
    }

    private aspectAdjust(hex: Hexagon): Hexagon {
        const sides: Side[] = [];
        for (let i = LEFT; i <= RIGHT; i++) {
            sides[i] = {pts: []} as Side;
            for (let j = CP1; j <= END; j++) {
                sides[i].pts[j] = new L.LatLng(
                    hex.sides[i].pts[j].lat,
                    this.adjust(hex.sides[i].pts[j].lng, this.centre.getLng(), this.aspectRatio));
            }
        }
        return {
            start: new L.LatLng(hex.start.lat, hex.start.lng),
            sides: sides
        } as Hexagon;
    }

    private adjust(pointLng: number, centreLng: number, aspectRatio): number {
        return pointLng - (centreLng - pointLng) * aspectRatio;
    }

    private transformHexagon(to: Point, hex: Hexagon, arc: number = 60): Hexagon {
        const widthScale = arc / 60 / 1.5;
        const sides: Side[] = [];
        for (let i = LEFT; i <= RIGHT; i++) {
            sides[i] = {pts: []} as Side;
            for (let j = CP1; j <= END; j++) {
                sides[i].pts[j] = new L.LatLng(
                    (hex.sides[i].pts[j].lat + 1) * INITIAL_SCALE + to.getLat(),
                    hex.sides[i].pts[j].lng * INITIAL_SCALE + to.getLng());
            }
        }
        // exceptions to scale the beam width
        sides[LEFT].pts[CP2].lng = hex.sides[LEFT].pts[CP2].lng * INITIAL_SCALE * widthScale + to.getLng();
        sides[LEFT].pts[END].lng = hex.sides[LEFT].pts[END].lng * INITIAL_SCALE * widthScale + to.getLng();
        // sides[TOP].pts[CP1] - is not used in the end
        sides[TOP].pts[CP2].lng = hex.sides[TOP].pts[CP2].lng * INITIAL_SCALE * widthScale + to.getLng();
        sides[TOP].pts[END].lng = hex.sides[TOP].pts[END].lng * INITIAL_SCALE * widthScale + to.getLng();
        // sides[RIGHT].pts[CP1] - is not used in the end

        return {
            start: new L.LatLng((hex.start.lat + 1) * INITIAL_SCALE + to.getLat(), hex.start.lng * INITIAL_SCALE + to.getLng()),
            sides: sides,
        } as Hexagon;
    }

    private calculateHexagon(): Hexagon {
        const hex = {start: new L.LatLng(-1, 0), sides: []} as Hexagon;
        const side = this.standardSide();
        hex.sides[LEFT] = side;
        hex.sides[TOP] = this.rotateSide(side, -120);
        hex.sides[RIGHT] = this.rotateSide(side, -240);

        return hex;
    }

    private rotateSide(side: Side, angle: number): Side {
        return {
            pts: [
                this.rotatePoint(side.pts[CP1], angle),
                this.rotatePoint(side.pts[CP2], angle),
                this.rotatePoint(side.pts[END], angle),
            ]
        } as Side;
    }

    private rotatePoint(point: L.LatLng, angle: number, centre?: Point): L.LatLng {
        if (angle === 0) {
            return point;
        }
        if (centre === undefined) {
            centre = new Point();
            centre.setLat(0);
            centre.setLng(0);
        }
        const curAng = Math.atan2(point.lat - centre.getLat(), point.lng - centre.getLng());
        const radius = Math.hypot(point.lat - centre.getLat(), point.lng - centre.getLng());
        const newAng = curAng + angle * Math.PI / 180;
        return new L.LatLng(
            Math.fround(radius * Math.sin(newAng) + centre.getLat()),
            Math.fround(radius * Math.cos(newAng) + centre.getLng())
        );
    }

    /**
     * Each side is a cubic bezier curve
     * The centre is 0,0 and the start is 1 unit below the centre. The end is rotated
     * 120 degrees from this. The tension of the control points is 0.5 - increasing it
     * would give rounder corners.
     *
     *            O end
     *         /  \
     * cp2  o      \
     *              \
     * pts  o--------O
     *            start
     *
     */
    private standardSide(): Side {
        return {
            pts: [
                new L.LatLng(-1, -0.5),
                new L.LatLng(0.067, -1.116),
                new L.LatLng(0.5, -0.866)
            ]
        } as Side;
    }
}

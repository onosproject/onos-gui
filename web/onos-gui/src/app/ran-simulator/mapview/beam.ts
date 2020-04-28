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
const CENTROID_SCALE = 40;
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
    private readonly aspectRatio: number;
    private readonly rotationAngle: number;
    private readonly hex: Hexagon;
    private readonly arc: number;

    constructor(centre: Point, azimuth: number, arc: number) {
        this.centre = centre;
        this.arc = arc;
        this.rotationAngle = 90 - azimuth;
        this.aspectRatio = Math.cos(centre.getLat() * Math.PI / 180);

        this.hex = this.calculateHexagon();
    }

    updateCentroid(centroid: Point): L.Curve {
        const centroidDist = Math.hypot(centroid.getLat() - this.centre.getLat(), centroid.getLng() - centroid.getLat());
        console.log('Centroid dist', centroidDist);
        const newHex = this.transformHexagon(centroidDist / CENTROID_SCALE, this.centre, this.hex, this.arc);

        const rotated = this.rotateBeam(newHex, this.rotationAngle - 90, this.centre);

        const adjusted = this.aspectAdjust(rotated, this.centre, this.aspectRatio);

        return this.convertHexToCurve(adjusted);
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

    private aspectAdjust(hex: Hexagon, centre: Point, aspectRatio: number): Hexagon {
        const sides: Side[] = [];
        for (let i = LEFT; i <= RIGHT; i++) {
            sides[i] = {pts: []} as Side;
            for (let j = CP1; j <= END; j++) {
                sides[i].pts[j] = new L.LatLng(
                    hex.sides[i].pts[j].lat,
                    this.adjust(hex.sides[i].pts[j].lng, centre.getLng(), aspectRatio));
            }
        }
        return {
            start: new L.LatLng(hex.start.lat, this.adjust(hex.start.lng, centre.getLng(), aspectRatio)),
            sides: sides } as Hexagon;
    }

    private adjust(pointLng: number, centreLng: number, aspectRatio): number {
        return pointLng - (centreLng - pointLng) * aspectRatio;
    }

    private transformHexagon(lengthScale: number, to: Point, hex: Hexagon, arc: number = 60): Hexagon {
        const widthScale = arc / 60;
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
        sides[LEFT].pts[CP2].lat = (hex.sides[LEFT].pts[CP2].lat + 1) * INITIAL_SCALE * lengthScale + to.getLat();
        sides[LEFT].pts[END].lng = hex.sides[LEFT].pts[END].lng * INITIAL_SCALE * widthScale + to.getLng();
        sides[LEFT].pts[END].lat = (hex.sides[LEFT].pts[END].lat + 1) * INITIAL_SCALE * lengthScale + to.getLat();
        // sides[TOP].pts[CP1] - is not used in the end
        sides[TOP].pts[CP2].lng = hex.sides[TOP].pts[CP2].lng * INITIAL_SCALE * widthScale + to.getLng();
        sides[TOP].pts[CP2].lat = (hex.sides[TOP].pts[CP2].lat + 1) * INITIAL_SCALE * lengthScale + to.getLat();
        sides[TOP].pts[END].lng = hex.sides[TOP].pts[END].lng * INITIAL_SCALE * widthScale + to.getLng();
        sides[TOP].pts[END].lat = (hex.sides[TOP].pts[END].lat + 1) * INITIAL_SCALE * lengthScale + to.getLat();
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

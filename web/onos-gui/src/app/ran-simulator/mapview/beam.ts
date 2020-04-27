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
    cp1: L.LatLng;
    cp2: L.LatLng;
    end: L.LatLng;
}

interface Hexagon {
    start: L.LatLng;
    leftSide: Side;
    topSide: Side;
    rightSide: Side;
}

/**
 * Create a bezier cubic curve for the beam.
 * It is approximating a hexagonal shape - to start it's made of 3 identical polylines:
 *
 * the 3 are named left, top and right sides and are rotated 0, 120 and 240 degrees
 */
export class BeamCalculator {

    beamCurve: L.Curve;
    aspectRatio: number;

    constructor(centre: Point, centroid: Point) {
        this.aspectRatio = Math.cos(centre.getLat());
        this.beamCurve = this.calculateBeam(centre, centroid, 60);
    }

    calculateBeam(centre: Point, centroid: Point, arc: number): any {
        const hex = this.calculateHexagon();
        const rotationAngle = 180 * Math.atan2(centroid.getLat() - centre.getLat(), centroid.getLng() - centre.getLng()) / Math.PI;

        const newHex = this.transformHexagon(0.008, centre, hex);

        const rotated = this.rotateBeam(newHex, rotationAngle - 90, centre);

        const adjusted = this.aspectAdjust(rotated, centre, this.aspectRatio);

        const beamCurve = this.convertHexToCurve(adjusted);

        // console.log('Hexagon', rotationAngle, this.aspectRatio, hex, rotated, newHex, adjusted, beamCurve);

        return beamCurve;
    }

    private convertHexToCurve(hex: Hexagon): L.Path {
        const beamCurve = L.curve(['M', [hex.start.lat, hex.start.lng], 'C',
            [hex.leftSide.cp1.lat, hex.leftSide.cp1.lng],
            [hex.leftSide.cp2.lat, hex.leftSide.cp2.lng],
            [hex.leftSide.end.lat, hex.leftSide.end.lng],
            [hex.topSide.cp1.lat, hex.topSide.cp1.lng],
            [hex.topSide.cp2.lat, hex.topSide.cp2.lng],
            [hex.topSide.end.lat, hex.topSide.end.lng],
            [hex.rightSide.cp1.lat, hex.rightSide.cp1.lng],
            [hex.rightSide.cp2.lat, hex.rightSide.cp2.lng],
            [hex.rightSide.end.lat, hex.rightSide.end.lng], 'Z'],
            {color: 'red', fill: true, stroke: false, opacity: 0.5 }
        );

        return beamCurve;
    }

    private rotateBeam(hex: Hexagon, angle: number, centre?: Point): Hexagon {
        return {
            start: hex.start,
            leftSide: {
                cp1: this.rotatePoint(hex.leftSide.cp1, angle, centre),
                cp2: this.rotatePoint(hex.leftSide.cp2, angle, centre),
                end: this.rotatePoint(hex.leftSide.end, angle, centre)
            },
            topSide: {
                cp1: this.rotatePoint(hex.topSide.cp1, angle, centre),
                cp2: this.rotatePoint(hex.topSide.cp2, angle, centre),
                end: this.rotatePoint(hex.topSide.end, angle, centre)
            },
            rightSide: {
                cp1: this.rotatePoint(hex.rightSide.cp1, angle, centre),
                cp2: this.rotatePoint(hex.rightSide.cp2, angle, centre),
                end: this.rotatePoint(hex.rightSide.end, angle, centre)
            }
        } as Hexagon;
    }

    private aspectAdjust(hex: Hexagon, centre: Point, aspectRatio: number): Hexagon {
        return {
            start: new L.LatLng(hex.start.lat, this.adjust(hex.start.lng, centre.getLng(), aspectRatio)),
            leftSide: {
                cp1: new L.LatLng(
                    hex.leftSide.cp1.lat,
                    this.adjust(hex.leftSide.cp1.lng, centre.getLng(), aspectRatio)),
                cp2: new L.LatLng(
                    hex.leftSide.cp2.lat,
                    this.adjust(hex.leftSide.cp2.lng, centre.getLng(), aspectRatio)),
                end: new L.LatLng(
                    hex.leftSide.end.lat,
                    this.adjust(hex.leftSide.end.lng, centre.getLng(), aspectRatio)),
            } as Side,
            topSide: {
                cp1: new L.LatLng(
                    hex.topSide.cp1.lat,
                    this.adjust(hex.topSide.cp1.lng, centre.getLng(), aspectRatio)),
                cp2: new L.LatLng(
                    hex.topSide.cp2.lat,
                    this.adjust(hex.topSide.cp2.lng, centre.getLng(), aspectRatio)),
                end: new L.LatLng(
                    hex.topSide.end.lat,
                    this.adjust(hex.topSide.end.lng, centre.getLng(), aspectRatio)),
            } as Side,
            rightSide: {
                cp1: new L.LatLng(
                    hex.rightSide.cp1.lat,
                    this.adjust(hex.rightSide.cp1.lng, centre.getLng(), aspectRatio)),
                cp2: new L.LatLng(
                    hex.rightSide.cp2.lat,
                    this.adjust(hex.rightSide.cp2.lng, centre.getLng(), aspectRatio)),
                end: new L.LatLng(
                    hex.rightSide.end.lat,
                    this.adjust(hex.rightSide.end.lng, centre.getLng(), aspectRatio)),
            } as Side,
        } as Hexagon;
    }

    private adjust(pointLng: number, centreLng: number, aspectRatio): number {
        return pointLng + (centreLng - pointLng) * aspectRatio;
    }

    private transformHexagon(scale: number, to: Point, hex: Hexagon): Hexagon {
        return {
            start: new L.LatLng((hex.start.lat + 1) * scale + to.getLat(), hex.start.lng * scale + to.getLng()),
            leftSide: {
                cp1: new L.LatLng(
                    (hex.leftSide.cp1.lat + 1) * scale + to.getLat(),
                    hex.leftSide.cp1.lng * scale + to.getLng()),
                cp2: new L.LatLng(
                    (hex.leftSide.cp2.lat + 1) * scale + to.getLat(),
                    hex.leftSide.cp2.lng * scale + to.getLng()),
                end: new L.LatLng(
                    (hex.leftSide.end.lat + 1) * scale + to.getLat(),
                    hex.leftSide.end.lng * scale + to.getLng()),
            } as Side,
            topSide: {
                cp1: new L.LatLng(
                    (hex.topSide.cp1.lat + 1) * scale + to.getLat(),
                    hex.topSide.cp1.lng * scale + to.getLng()),
                cp2: new L.LatLng(
                    (hex.topSide.cp2.lat + 1) * scale + to.getLat(),
                    hex.topSide.cp2.lng * scale + to.getLng()),
                end: new L.LatLng(
                    (hex.topSide.end.lat + 1) * scale + to.getLat(),
                    hex.topSide.end.lng * scale + to.getLng()),
            } as Side,
            rightSide: {
                cp1: new L.LatLng(
                    (hex.rightSide.cp1.lat + 1) * scale + to.getLat(),
                    hex.rightSide.cp1.lng * scale + to.getLng()),
                cp2: new L.LatLng(
                    (hex.rightSide.cp2.lat + 1) * scale + to.getLat(),
                    hex.rightSide.cp2.lng * scale + to.getLng()),
                end: new L.LatLng((
                    hex.rightSide.end.lat + 1) * scale + to.getLat(),
                    hex.rightSide.end.lng * scale + to.getLng()),
            } as Side,
        } as Hexagon;
    }

    private calculateHexagon(): Hexagon {
        const hex = {start: new L.LatLng(-1, 0)} as Hexagon;
        const side = this.standardSide();
        hex.leftSide = side;
        hex.topSide = this.rotateSide(side, -120);
        hex.rightSide = this.rotateSide(side, -240);

        return hex;
    }

    private rotateSide(side: Side, angle: number): Side {
        return {
            cp1: this.rotatePoint(side.cp1, angle),
            cp2: this.rotatePoint(side.cp2, angle),
            end: this.rotatePoint(side.end, angle),
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
     * cp1  o--------O
     *            start
     *
     */
    private standardSide(): Side {
        return {
            cp1: new L.LatLng(-1, -0.5),
            cp2: new L.LatLng(0.067, -1.116),
            end: new L.LatLng(0.5, -0.866)
        } as Side;
    }
}

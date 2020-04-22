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
 * Points are start, cp1, cp2, tip, cp4, end=start
 * cp3 is mirrored from cp2 by 'S'
 * See https://www.w3.org/TR/SVG/paths.html#PathDataCubicBezierCommands
 *            tip
 * cp2 o-------O-------o  cp3
 *          /     \
 *         |      |
 *         \      /
 *          \    /
 * cp1   o----O----o  cp4
 *         start=end
 * Example:
 *  <svg xmlns:svg="http://www.w3.org/2000/svg" width="300" height="300" viewBox="-150 -150 300 300">
 *     <path fill-opacity="0.3" fill="#7B7D7D" stroke-width="0" transform="rotate(0 0 0)"
 *          d="M 0 0 C -20 0, -140 -100, 0 -100 S 20 0, 0 0">
 *     </path>
 * </svg>
 * @param azimuth The rotation of the beam
 * @param arc The width of the beam in degrees
 * @param power The power level
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

    rotatePoint(point: L.LatLng, angle: number, centre?: Point): L.LatLng {
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

    private standardSide(): Side {
        return {
            cp1: new L.LatLng(-1, -0.5),
            cp2: new L.LatLng(0.067, -1.116),
            end: new L.LatLng(0.5, -0.866)
        } as Side;
    }

    // based on a hex centred at 0,0 with internal radius 1.0
    private calculateLeftSide(arc: number = 60): Side {
        const tension = 0.5;
        const alpha = arc / 2;
        const startX = 0, startY = -1;

        const side = {
            cp1: new L.LatLng(-1, -tension),
            end: new L.LatLng(
                Math.sin(alpha * Math.PI / 180),
                -Math.cos(alpha * Math.PI / 180)
            )
        } as Side;
        side.cp2 = new L.LatLng(
            side.end.lat - tension * Math.sin((90 - alpha) * Math.PI / 180),
            side.end.lng - tension * Math.cos((90 - alpha) * Math.PI / 180)
        );

        return side;
    }


    // static calculateBeam(azimuth: number, arc: number, power: number, color: string): string {
    //     const BOXSIZE = 300; // If changed, must also update iconSize and iconAnchor of L.divIcon
    //
    //     const dist = this.powerToCentroid(power);
    //     const radius = this.radiusFromCentroid(dist, arc);
    //     const tipy = -radius;
    //     const alpha = 2 * Math.PI * arc / 2 / 360;
    //     const cp1x = tipy * Math.tan(alpha) / 3;
    //     const cp2x = tipy * Math.tan(alpha);
    //     const svgPrefix = '<svg xmlns:svg="http://www.w3.org/2000/svg" width="' + BOXSIZE + '" height="' + BOXSIZE + '"';
    //     const viewBox = ' viewBox="' + (BOXSIZE / -2) + ' ' + (BOXSIZE / -2) + ' ' + BOXSIZE + ' ' + BOXSIZE + '">';
    //     const pathPrefix = '<path fill-opacity="0.3"' +
    //         ' fill="' + color + '"' +
    //         ' stroke-width="0"' +
    //         ' transform="rotate(' + azimuth + ' 0 0)"';
    //     const data = ' d="M 0 0' + // start
    //         ' C ' + cp1x + ' 0,' + // cp1
    //         ' ' + cp2x + ' ' + tipy + ',' + // cp2
    //         ' 0 ' + tipy + // tip
    //         ' S ' + // cp3 is mirrored from cp2
    //         '' + -cp1x + ' 0, ' + // cp4
    //         '0 0' + // end = start
    //         '"/>';
    //     const svgSuffix = '</svg>';
    //     return svgPrefix + viewBox + pathPrefix + data + svgSuffix;
    // }

    /**
     * Use the centroid of a circular sector
     * Inverse of value for Circular Sector- ref https://en.wikipedia.org/wiki/List_of_centroids
     * @param centroid dist from centre to centroid of sector
     * @param arc The arc of the sector in degrees
     */
    // static radiusFromCentroid(centroid: number, arc: number) {
    //     const alpha = 2 * Math.PI * arc / 360 / 2;
    //     return 3 * alpha * centroid / 2 / Math.sin(alpha);
    // }

    /**
     * Convert the power in dB to a distance, based on a fudge factor
     * @param powerdB the power of the cell
     */
    // static powerToCentroid(powerdB: number): number {
    //     const power = Math.pow(10, powerdB / 10);
    //     const distance = Math.sqrt(power) * DIST_SCALE;
    //     // console.log('Power calc:', powerUnsigneddB, this.powerSigned(powerUnsigneddB), power, distance);
    //     if (distance < CIRCLE_MIN_DIA) {
    //         return CIRCLE_MIN_DIA;
    //     } else if (distance > CIRCLE_MAX_DIA) {
    //         return CIRCLE_MAX_DIA;
    //     }
    //     return distance;
    // }

    /**
     * Calculate the Lat, Lng of the centroid of the sector
     * @param centre the location of the tower
     * @param dist the dist of the centroid to the tower
     * @param azimuth the angle between north and the centroid clockwise degrees
     */
    // static centroidPosition(centre: Point, dist: number, azimuth: number): Point {
    //     const azRads = 2 * Math.PI * (90 - azimuth) / 360;
    //
    //     const centroid = new Point();
    //     centroid.setLat(centre.getLat() + Math.sin(azRads) * dist);
    //     centroid.setLng(centre.getLng() + Math.cos(azRads) * dist);
    //     return centroid;
    // }
}

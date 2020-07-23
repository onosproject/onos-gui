// Code generated by GENERATOR. DO NOT EDIT.

// Code generated by GENERATOR. DO NOT EDIT.

import * as jspb from "google-protobuf"

import * as gogoproto_gogo_pb from '../../../../../gogoproto/gogo_pb';

export class Point extends jspb.Message {
  getLat(): number;
  setLat(value: number): void;

  getLng(): number;
  setLng(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Point.AsObject;
  static toObject(includeInstance: boolean, msg: Point): Point.AsObject;
  static serializeBinaryToWriter(message: Point, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Point;
  static deserializeBinaryFromReader(message: Point, reader: jspb.BinaryReader): Point;
}

export namespace Point {
  export type AsObject = {
    lat: number,
    lng: number,
  }
}

export class Sector extends jspb.Message {
  getAzimuth(): number;
  setAzimuth(value: number): void;

  getArc(): number;
  setArc(value: number): void;

  getCentroid(): Point | undefined;
  setCentroid(value?: Point): void;
  hasCentroid(): boolean;
  clearCentroid(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Sector.AsObject;
  static toObject(includeInstance: boolean, msg: Sector): Sector.AsObject;
  static serializeBinaryToWriter(message: Sector, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Sector;
  static deserializeBinaryFromReader(message: Sector, reader: jspb.BinaryReader): Sector;
}

export namespace Sector {
  export type AsObject = {
    azimuth: number,
    arc: number,
    centroid?: Point.AsObject,
  }
}

export class Route extends jspb.Message {
  getName(): number;
  setName(value: number): void;

  getWaypointsList(): Array<Point>;
  setWaypointsList(value: Array<Point>): void;
  clearWaypointsList(): void;
  addWaypoints(value?: Point, index?: number): Point;

  getColor(): string;
  setColor(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Route.AsObject;
  static toObject(includeInstance: boolean, msg: Route): Route.AsObject;
  static serializeBinaryToWriter(message: Route, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Route;
  static deserializeBinaryFromReader(message: Route, reader: jspb.BinaryReader): Route;
}

export namespace Route {
  export type AsObject = {
    name: number,
    waypointsList: Array<Point.AsObject>,
    color: string,
  }
}

export class Ue extends jspb.Message {
  getImsi(): number;
  setImsi(value: number): void;

  getType(): string;
  setType(value: string): void;

  getPosition(): Point | undefined;
  setPosition(value?: Point): void;
  hasPosition(): boolean;
  clearPosition(): void;

  getRotation(): number;
  setRotation(value: number): void;

  getServingTower(): ECGI | undefined;
  setServingTower(value?: ECGI): void;
  hasServingTower(): boolean;
  clearServingTower(): void;

  getServingTowerStrength(): number;
  setServingTowerStrength(value: number): void;

  getTower1(): ECGI | undefined;
  setTower1(value?: ECGI): void;
  hasTower1(): boolean;
  clearTower1(): void;

  getTower1Strength(): number;
  setTower1Strength(value: number): void;

  getTower2(): ECGI | undefined;
  setTower2(value?: ECGI): void;
  hasTower2(): boolean;
  clearTower2(): void;

  getTower2Strength(): number;
  setTower2Strength(value: number): void;

  getTower3(): ECGI | undefined;
  setTower3(value?: ECGI): void;
  hasTower3(): boolean;
  clearTower3(): void;

  getTower3Strength(): number;
  setTower3Strength(value: number): void;

  getCrnti(): string;
  setCrnti(value: string): void;

  getAdmitted(): boolean;
  setAdmitted(value: boolean): void;

  getMetrics(): UeMetrics | undefined;
  setMetrics(value?: UeMetrics): void;
  hasMetrics(): boolean;
  clearMetrics(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Ue.AsObject;
  static toObject(includeInstance: boolean, msg: Ue): Ue.AsObject;
  static serializeBinaryToWriter(message: Ue, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Ue;
  static deserializeBinaryFromReader(message: Ue, reader: jspb.BinaryReader): Ue;
}

export namespace Ue {
  export type AsObject = {
    imsi: number,
    type: string,
    position?: Point.AsObject,
    rotation: number,
    servingTower?: ECGI.AsObject,
    servingTowerStrength: number,
    tower1?: ECGI.AsObject,
    tower1Strength: number,
    tower2?: ECGI.AsObject,
    tower2Strength: number,
    tower3?: ECGI.AsObject,
    tower3Strength: number,
    crnti: string,
    admitted: boolean,
    metrics?: UeMetrics.AsObject,
  }
}

export class UeMetrics extends jspb.Message {
  getHoLatency(): number;
  setHoLatency(value: number): void;

  getHoReportTimestamp(): number;
  setHoReportTimestamp(value: number): void;

  getIsfirst(): boolean;
  setIsfirst(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UeMetrics.AsObject;
  static toObject(includeInstance: boolean, msg: UeMetrics): UeMetrics.AsObject;
  static serializeBinaryToWriter(message: UeMetrics, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UeMetrics;
  static deserializeBinaryFromReader(message: UeMetrics, reader: jspb.BinaryReader): UeMetrics;
}

export namespace UeMetrics {
  export type AsObject = {
    hoLatency: number,
    hoReportTimestamp: number,
    isfirst: boolean,
  }
}

export class ECGI extends jspb.Message {
  getEcid(): string;
  setEcid(value: string): void;

  getPlmnid(): string;
  setPlmnid(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ECGI.AsObject;
  static toObject(includeInstance: boolean, msg: ECGI): ECGI.AsObject;
  static serializeBinaryToWriter(message: ECGI, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ECGI;
  static deserializeBinaryFromReader(message: ECGI, reader: jspb.BinaryReader): ECGI;
}

export namespace ECGI {
  export type AsObject = {
    ecid: string,
    plmnid: string,
  }
}

export class Cell extends jspb.Message {
  getEcgi(): ECGI | undefined;
  setEcgi(value?: ECGI): void;
  hasEcgi(): boolean;
  clearEcgi(): void;

  getLocation(): Point | undefined;
  setLocation(value?: Point): void;
  hasLocation(): boolean;
  clearLocation(): void;

  getSector(): Sector | undefined;
  setSector(value?: Sector): void;
  hasSector(): boolean;
  clearSector(): void;

  getColor(): string;
  setColor(value: string): void;

  getMaxues(): number;
  setMaxues(value: number): void;

  getNeighborsList(): Array<ECGI>;
  setNeighborsList(value: Array<ECGI>): void;
  clearNeighborsList(): void;
  addNeighbors(value?: ECGI, index?: number): ECGI;

  getTxpowerdb(): number;
  setTxpowerdb(value: number): void;

  getCrntimapMap(): jspb.Map<string, number>;
  clearCrntimapMap(): void;

  getCrntiindex(): number;
  setCrntiindex(value: number): void;

  getPort(): number;
  setPort(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Cell.AsObject;
  static toObject(includeInstance: boolean, msg: Cell): Cell.AsObject;
  static serializeBinaryToWriter(message: Cell, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Cell;
  static deserializeBinaryFromReader(message: Cell, reader: jspb.BinaryReader): Cell;
}

export namespace Cell {
  export type AsObject = {
    ecgi?: ECGI.AsObject,
    location?: Point.AsObject,
    sector?: Sector.AsObject,
    color: string,
    maxues: number,
    neighborsList: Array<ECGI.AsObject>,
    txpowerdb: number,
    crntimapMap: Array<[string, number]>,
    crntiindex: number,
    port: number,
  }
}

export class MapLayout extends jspb.Message {
  getCenter(): Point | undefined;
  setCenter(value?: Point): void;
  hasCenter(): boolean;
  clearCenter(): void;

  getZoom(): number;
  setZoom(value: number): void;

  getFade(): boolean;
  setFade(value: boolean): void;

  getShowroutes(): boolean;
  setShowroutes(value: boolean): void;

  getShowpower(): boolean;
  setShowpower(value: boolean): void;

  getMinUes(): number;
  setMinUes(value: number): void;

  getMaxUes(): number;
  setMaxUes(value: number): void;

  getCurrentRoutes(): number;
  setCurrentRoutes(value: number): void;

  getLocationsscale(): number;
  setLocationsscale(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MapLayout.AsObject;
  static toObject(includeInstance: boolean, msg: MapLayout): MapLayout.AsObject;
  static serializeBinaryToWriter(message: MapLayout, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MapLayout;
  static deserializeBinaryFromReader(message: MapLayout, reader: jspb.BinaryReader): MapLayout;
}

export namespace MapLayout {
  export type AsObject = {
    center?: Point.AsObject,
    zoom: number,
    fade: boolean,
    showroutes: boolean,
    showpower: boolean,
    minUes: number,
    maxUes: number,
    currentRoutes: number,
    locationsscale: number,
  }
}


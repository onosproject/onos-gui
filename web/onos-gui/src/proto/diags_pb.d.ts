/*
 * Copyright 2019-present Open Networking Foundation
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

import * as jspb from "google-protobuf"

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb';

export class ChangesRequest extends jspb.Message {
  getChangeidsList(): Array<string>;
  setChangeidsList(value: Array<string>): void;
  clearChangeidsList(): void;
  addChangeids(value: string, index?: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChangesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ChangesRequest): ChangesRequest.AsObject;
  static serializeBinaryToWriter(message: ChangesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChangesRequest;
  static deserializeBinaryFromReader(message: ChangesRequest, reader: jspb.BinaryReader): ChangesRequest;
}

export namespace ChangesRequest {
  export type AsObject = {
    changeidsList: Array<string>,
  }
}

export class ConfigRequest extends jspb.Message {
  getDeviceidsList(): Array<string>;
  setDeviceidsList(value: Array<string>): void;
  clearDeviceidsList(): void;
  addDeviceids(value: string, index?: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ConfigRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ConfigRequest): ConfigRequest.AsObject;
  static serializeBinaryToWriter(message: ConfigRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ConfigRequest;
  static deserializeBinaryFromReader(message: ConfigRequest, reader: jspb.BinaryReader): ConfigRequest;
}

export namespace ConfigRequest {
  export type AsObject = {
    deviceidsList: Array<string>,
  }
}

export class ChangeValue extends jspb.Message {
  getPath(): string;
  setPath(value: string): void;

  getValue(): Uint8Array | string;
  getValue_asU8(): Uint8Array;
  getValue_asB64(): string;
  setValue(value: Uint8Array | string): void;

  getValuetype(): ChangeValueType;
  setValuetype(value: ChangeValueType): void;

  getTypeoptsList(): Array<number>;
  setTypeoptsList(value: Array<number>): void;
  clearTypeoptsList(): void;
  addTypeopts(value: number, index?: number): void;

  getRemoved(): boolean;
  setRemoved(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChangeValue.AsObject;
  static toObject(includeInstance: boolean, msg: ChangeValue): ChangeValue.AsObject;
  static serializeBinaryToWriter(message: ChangeValue, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChangeValue;
  static deserializeBinaryFromReader(message: ChangeValue, reader: jspb.BinaryReader): ChangeValue;
}

export namespace ChangeValue {
  export type AsObject = {
    path: string,
    value: Uint8Array | string,
    valuetype: ChangeValueType,
    typeoptsList: Array<number>,
    removed: boolean,
  }
}

export class Change extends jspb.Message {
  getTime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setTime(value?: google_protobuf_timestamp_pb.Timestamp): void;
  hasTime(): boolean;
  clearTime(): void;

  getId(): string;
  setId(value: string): void;

  getDesc(): string;
  setDesc(value: string): void;

  getChangevaluesList(): Array<ChangeValue>;
  setChangevaluesList(value: Array<ChangeValue>): void;
  clearChangevaluesList(): void;
  addChangevalues(value?: ChangeValue, index?: number): ChangeValue;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Change.AsObject;
  static toObject(includeInstance: boolean, msg: Change): Change.AsObject;
  static serializeBinaryToWriter(message: Change, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Change;
  static deserializeBinaryFromReader(message: Change, reader: jspb.BinaryReader): Change;
}

export namespace Change {
  export type AsObject = {
    time?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    id: string,
    desc: string,
    changevaluesList: Array<ChangeValue.AsObject>,
  }
}

export class Configuration extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getDeviceid(): string;
  setDeviceid(value: string): void;

  getVersion(): string;
  setVersion(value: string): void;

  getDevicetype(): string;
  setDevicetype(value: string): void;

  getCreated(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreated(value?: google_protobuf_timestamp_pb.Timestamp): void;
  hasCreated(): boolean;
  clearCreated(): void;

  getUpdated(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdated(value?: google_protobuf_timestamp_pb.Timestamp): void;
  hasUpdated(): boolean;
  clearUpdated(): void;

  getChangeidsList(): Array<string>;
  setChangeidsList(value: Array<string>): void;
  clearChangeidsList(): void;
  addChangeids(value: string, index?: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Configuration.AsObject;
  static toObject(includeInstance: boolean, msg: Configuration): Configuration.AsObject;
  static serializeBinaryToWriter(message: Configuration, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Configuration;
  static deserializeBinaryFromReader(message: Configuration, reader: jspb.BinaryReader): Configuration;
}

export namespace Configuration {
  export type AsObject = {
    name: string,
    deviceid: string,
    version: string,
    devicetype: string,
    created?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updated?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    changeidsList: Array<string>,
  }
}

export enum ChangeValueType { 
  EMPTY = 0,
  STRING = 1,
  INT = 2,
  UINT = 3,
  BOOL = 4,
  DECIMAL = 5,
  FLOAT = 6,
  BYTES = 7,
  LEAFLIST_STRING = 8,
  LEAFLIST_INT = 9,
  LEAFLIST_UINT = 10,
  LEAFLIST_BOOL = 11,
  LEAFLIST_DECIMAL = 12,
  LEAFLIST_FLOAT = 13,
  LEAFLIST_BYTES = 14,
}

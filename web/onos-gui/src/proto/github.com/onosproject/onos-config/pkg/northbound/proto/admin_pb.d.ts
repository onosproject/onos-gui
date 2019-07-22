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
import * as github_com_openconfig_gnmi_proto_gnmi_gnmi_pb from '../../../../../../github.com/openconfig/gnmi/proto/gnmi/gnmi_pb';

export class NetworkChangesRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NetworkChangesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: NetworkChangesRequest): NetworkChangesRequest.AsObject;
  static serializeBinaryToWriter(message: NetworkChangesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NetworkChangesRequest;
  static deserializeBinaryFromReader(message: NetworkChangesRequest, reader: jspb.BinaryReader): NetworkChangesRequest;
}

export namespace NetworkChangesRequest {
  export type AsObject = {
  }
}

export class ConfigChange extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getHash(): string;
  setHash(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ConfigChange.AsObject;
  static toObject(includeInstance: boolean, msg: ConfigChange): ConfigChange.AsObject;
  static serializeBinaryToWriter(message: ConfigChange, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ConfigChange;
  static deserializeBinaryFromReader(message: ConfigChange, reader: jspb.BinaryReader): ConfigChange;
}

export namespace ConfigChange {
  export type AsObject = {
    id: string,
    hash: string,
  }
}

export class NetChange extends jspb.Message {
  getTime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setTime(value?: google_protobuf_timestamp_pb.Timestamp): void;
  hasTime(): boolean;
  clearTime(): void;

  getName(): string;
  setName(value: string): void;

  getUser(): string;
  setUser(value: string): void;

  getChangesList(): Array<ConfigChange>;
  setChangesList(value: Array<ConfigChange>): void;
  clearChangesList(): void;
  addChanges(value?: ConfigChange, index?: number): ConfigChange;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NetChange.AsObject;
  static toObject(includeInstance: boolean, msg: NetChange): NetChange.AsObject;
  static serializeBinaryToWriter(message: NetChange, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NetChange;
  static deserializeBinaryFromReader(message: NetChange, reader: jspb.BinaryReader): NetChange;
}

export namespace NetChange {
  export type AsObject = {
    time?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    name: string,
    user: string,
    changesList: Array<ConfigChange.AsObject>,
  }
}

export class ModelInfo extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getVersion(): string;
  setVersion(value: string): void;

  getModeldataList(): Array<github_com_openconfig_gnmi_proto_gnmi_gnmi_pb.ModelData>;
  setModeldataList(value: Array<github_com_openconfig_gnmi_proto_gnmi_gnmi_pb.ModelData>): void;
  clearModeldataList(): void;
  addModeldata(value?: github_com_openconfig_gnmi_proto_gnmi_gnmi_pb.ModelData, index?: number): github_com_openconfig_gnmi_proto_gnmi_gnmi_pb.ModelData;

  getModule(): string;
  setModule(value: string): void;

  getSchemaentryList(): Array<SchemaEntry>;
  setSchemaentryList(value: Array<SchemaEntry>): void;
  clearSchemaentryList(): void;
  addSchemaentry(value?: SchemaEntry, index?: number): SchemaEntry;

  getReadonlypathList(): Array<string>;
  setReadonlypathList(value: Array<string>): void;
  clearReadonlypathList(): void;
  addReadonlypath(value: string, index?: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ModelInfo.AsObject;
  static toObject(includeInstance: boolean, msg: ModelInfo): ModelInfo.AsObject;
  static serializeBinaryToWriter(message: ModelInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ModelInfo;
  static deserializeBinaryFromReader(message: ModelInfo, reader: jspb.BinaryReader): ModelInfo;
}

export namespace ModelInfo {
  export type AsObject = {
    name: string,
    version: string,
    modeldataList: Array<github_com_openconfig_gnmi_proto_gnmi_gnmi_pb.ModelData.AsObject>,
    module: string,
    schemaentryList: Array<SchemaEntry.AsObject>,
    readonlypathList: Array<string>,
  }
}

export class RegisterRequest extends jspb.Message {
  getSofile(): string;
  setSofile(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RegisterRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RegisterRequest): RegisterRequest.AsObject;
  static serializeBinaryToWriter(message: RegisterRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RegisterRequest;
  static deserializeBinaryFromReader(message: RegisterRequest, reader: jspb.BinaryReader): RegisterRequest;
}

export namespace RegisterRequest {
  export type AsObject = {
    sofile: string,
  }
}

export class SchemaEntry extends jspb.Message {
  getSchemapath(): string;
  setSchemapath(value: string): void;

  getSchemajson(): string;
  setSchemajson(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SchemaEntry.AsObject;
  static toObject(includeInstance: boolean, msg: SchemaEntry): SchemaEntry.AsObject;
  static serializeBinaryToWriter(message: SchemaEntry, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SchemaEntry;
  static deserializeBinaryFromReader(message: SchemaEntry, reader: jspb.BinaryReader): SchemaEntry;
}

export namespace SchemaEntry {
  export type AsObject = {
    schemapath: string,
    schemajson: string,
  }
}

export class RegisterResponse extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getVersion(): string;
  setVersion(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RegisterResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RegisterResponse): RegisterResponse.AsObject;
  static serializeBinaryToWriter(message: RegisterResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RegisterResponse;
  static deserializeBinaryFromReader(message: RegisterResponse, reader: jspb.BinaryReader): RegisterResponse;
}

export namespace RegisterResponse {
  export type AsObject = {
    name: string,
    version: string,
  }
}

export class ListModelsRequest extends jspb.Message {
  getVerbose(): boolean;
  setVerbose(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListModelsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListModelsRequest): ListModelsRequest.AsObject;
  static serializeBinaryToWriter(message: ListModelsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListModelsRequest;
  static deserializeBinaryFromReader(message: ListModelsRequest, reader: jspb.BinaryReader): ListModelsRequest;
}

export namespace ListModelsRequest {
  export type AsObject = {
    verbose: boolean,
  }
}

export class RollbackRequest extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getComment(): string;
  setComment(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RollbackRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RollbackRequest): RollbackRequest.AsObject;
  static serializeBinaryToWriter(message: RollbackRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RollbackRequest;
  static deserializeBinaryFromReader(message: RollbackRequest, reader: jspb.BinaryReader): RollbackRequest;
}

export namespace RollbackRequest {
  export type AsObject = {
    name: string,
    comment: string,
  }
}

export class RollbackResponse extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RollbackResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RollbackResponse): RollbackResponse.AsObject;
  static serializeBinaryToWriter(message: RollbackResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RollbackResponse;
  static deserializeBinaryFromReader(message: RollbackResponse, reader: jspb.BinaryReader): RollbackResponse;
}

export namespace RollbackResponse {
  export type AsObject = {
    message: string,
  }
}

export class DeviceInfo extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getAddress(): string;
  setAddress(value: string): void;

  getTarget(): string;
  setTarget(value: string): void;

  getVersion(): string;
  setVersion(value: string): void;

  getUser(): string;
  setUser(value: string): void;

  getPassword(): string;
  setPassword(value: string): void;

  getCapath(): string;
  setCapath(value: string): void;

  getCertpath(): string;
  setCertpath(value: string): void;

  getKeypath(): string;
  setKeypath(value: string): void;

  getPlain(): boolean;
  setPlain(value: boolean): void;

  getInsecure(): boolean;
  setInsecure(value: boolean): void;

  getTimeout(): number;
  setTimeout(value: number): void;

  getDevicetype(): string;
  setDevicetype(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeviceInfo.AsObject;
  static toObject(includeInstance: boolean, msg: DeviceInfo): DeviceInfo.AsObject;
  static serializeBinaryToWriter(message: DeviceInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeviceInfo;
  static deserializeBinaryFromReader(message: DeviceInfo, reader: jspb.BinaryReader): DeviceInfo;
}

export namespace DeviceInfo {
  export type AsObject = {
    id: string,
    address: string,
    target: string,
    version: string,
    user: string,
    password: string,
    capath: string,
    certpath: string,
    keypath: string,
    plain: boolean,
    insecure: boolean,
    timeout: number,
    devicetype: string,
  }
}

export class DeviceResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeviceResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DeviceResponse): DeviceResponse.AsObject;
  static serializeBinaryToWriter(message: DeviceResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeviceResponse;
  static deserializeBinaryFromReader(message: DeviceResponse, reader: jspb.BinaryReader): DeviceResponse;
}

export namespace DeviceResponse {
  export type AsObject = {
  }
}

export class GetDevicesRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetDevicesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetDevicesRequest): GetDevicesRequest.AsObject;
  static serializeBinaryToWriter(message: GetDevicesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetDevicesRequest;
  static deserializeBinaryFromReader(message: GetDevicesRequest, reader: jspb.BinaryReader): GetDevicesRequest;
}

export namespace GetDevicesRequest {
  export type AsObject = {
  }
}

export class DeviceSummaryRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeviceSummaryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeviceSummaryRequest): DeviceSummaryRequest.AsObject;
  static serializeBinaryToWriter(message: DeviceSummaryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeviceSummaryRequest;
  static deserializeBinaryFromReader(message: DeviceSummaryRequest, reader: jspb.BinaryReader): DeviceSummaryRequest;
}

export namespace DeviceSummaryRequest {
  export type AsObject = {
  }
}

export class DeviceSummaryResponse extends jspb.Message {
  getCount(): number;
  setCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeviceSummaryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DeviceSummaryResponse): DeviceSummaryResponse.AsObject;
  static serializeBinaryToWriter(message: DeviceSummaryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeviceSummaryResponse;
  static deserializeBinaryFromReader(message: DeviceSummaryResponse, reader: jspb.BinaryReader): DeviceSummaryResponse;
}

export namespace DeviceSummaryResponse {
  export type AsObject = {
    count: number,
  }
}


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

export class Extension extends jspb.Message {
  getRegisteredExt(): RegisteredExtension | undefined;
  setRegisteredExt(value?: RegisteredExtension): void;
  hasRegisteredExt(): boolean;
  clearRegisteredExt(): void;

  getMasterArbitration(): MasterArbitration | undefined;
  setMasterArbitration(value?: MasterArbitration): void;
  hasMasterArbitration(): boolean;
  clearMasterArbitration(): void;

  getExtCase(): Extension.ExtCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Extension.AsObject;
  static toObject(includeInstance: boolean, msg: Extension): Extension.AsObject;
  static serializeBinaryToWriter(message: Extension, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Extension;
  static deserializeBinaryFromReader(message: Extension, reader: jspb.BinaryReader): Extension;
}

export namespace Extension {
  export type AsObject = {
    registeredExt?: RegisteredExtension.AsObject,
    masterArbitration?: MasterArbitration.AsObject,
  }

  export enum ExtCase { 
    EXT_NOT_SET = 0,
    REGISTERED_EXT = 1,
    MASTER_ARBITRATION = 2,
  }
}

export class RegisteredExtension extends jspb.Message {
  getId(): ExtensionID;
  setId(value: ExtensionID): void;

  getMsg(): Uint8Array | string;
  getMsg_asU8(): Uint8Array;
  getMsg_asB64(): string;
  setMsg(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RegisteredExtension.AsObject;
  static toObject(includeInstance: boolean, msg: RegisteredExtension): RegisteredExtension.AsObject;
  static serializeBinaryToWriter(message: RegisteredExtension, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RegisteredExtension;
  static deserializeBinaryFromReader(message: RegisteredExtension, reader: jspb.BinaryReader): RegisteredExtension;
}

export namespace RegisteredExtension {
  export type AsObject = {
    id: ExtensionID,
    msg: Uint8Array | string,
  }
}

export class MasterArbitration extends jspb.Message {
  getRole(): Role | undefined;
  setRole(value?: Role): void;
  hasRole(): boolean;
  clearRole(): void;

  getElectionId(): Uint128 | undefined;
  setElectionId(value?: Uint128): void;
  hasElectionId(): boolean;
  clearElectionId(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MasterArbitration.AsObject;
  static toObject(includeInstance: boolean, msg: MasterArbitration): MasterArbitration.AsObject;
  static serializeBinaryToWriter(message: MasterArbitration, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MasterArbitration;
  static deserializeBinaryFromReader(message: MasterArbitration, reader: jspb.BinaryReader): MasterArbitration;
}

export namespace MasterArbitration {
  export type AsObject = {
    role?: Role.AsObject,
    electionId?: Uint128.AsObject,
  }
}

export class Uint128 extends jspb.Message {
  getHigh(): number;
  setHigh(value: number): void;

  getLow(): number;
  setLow(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Uint128.AsObject;
  static toObject(includeInstance: boolean, msg: Uint128): Uint128.AsObject;
  static serializeBinaryToWriter(message: Uint128, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Uint128;
  static deserializeBinaryFromReader(message: Uint128, reader: jspb.BinaryReader): Uint128;
}

export namespace Uint128 {
  export type AsObject = {
    high: number,
    low: number,
  }
}

export class Role extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Role.AsObject;
  static toObject(includeInstance: boolean, msg: Role): Role.AsObject;
  static serializeBinaryToWriter(message: Role, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Role;
  static deserializeBinaryFromReader(message: Role, reader: jspb.BinaryReader): Role;
}

export namespace Role {
  export type AsObject = {
    id: string,
  }
}

export enum ExtensionID { 
  EID_UNSET = 0,
  EID_EXPERIMENTAL = 999,
}

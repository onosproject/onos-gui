// Code generated by GENERATOR. DO NOT EDIT.

import * as jspb from "google-protobuf"

import * as gogoproto_gogo_pb from '../../../gogoproto/gogo_pb';
import * as onos_config_admin_admin_pb from '../../../onos/config/admin/admin_pb';
import * as onos_config_change_device_types_pb from '../../../onos/config/change/device/types_pb';
import * as onos_config_change_network_types_pb from '../../../onos/config/change/network/types_pb';

export class OpStateRequest extends jspb.Message {
  getDeviceid(): string;
  setDeviceid(value: string): void;

  getSubscribe(): boolean;
  setSubscribe(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OpStateRequest.AsObject;
  static toObject(includeInstance: boolean, msg: OpStateRequest): OpStateRequest.AsObject;
  static serializeBinaryToWriter(message: OpStateRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OpStateRequest;
  static deserializeBinaryFromReader(message: OpStateRequest, reader: jspb.BinaryReader): OpStateRequest;
}

export namespace OpStateRequest {
  export type AsObject = {
    deviceid: string,
    subscribe: boolean,
  }
}

export class OpStateResponse extends jspb.Message {
  getType(): onos_config_admin_admin_pb.Type;
  setType(value: onos_config_admin_admin_pb.Type): void;

  getPathvalue(): onos_config_change_device_types_pb.PathValue | undefined;
  setPathvalue(value?: onos_config_change_device_types_pb.PathValue): void;
  hasPathvalue(): boolean;
  clearPathvalue(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OpStateResponse.AsObject;
  static toObject(includeInstance: boolean, msg: OpStateResponse): OpStateResponse.AsObject;
  static serializeBinaryToWriter(message: OpStateResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OpStateResponse;
  static deserializeBinaryFromReader(message: OpStateResponse, reader: jspb.BinaryReader): OpStateResponse;
}

export namespace OpStateResponse {
  export type AsObject = {
    type: onos_config_admin_admin_pb.Type,
    pathvalue?: onos_config_change_device_types_pb.PathValue.AsObject,
  }
}

export class ListNetworkChangeRequest extends jspb.Message {
  getSubscribe(): boolean;
  setSubscribe(value: boolean): void;

  getChangeid(): string;
  setChangeid(value: string): void;

  getWithoutreplay(): boolean;
  setWithoutreplay(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListNetworkChangeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListNetworkChangeRequest): ListNetworkChangeRequest.AsObject;
  static serializeBinaryToWriter(message: ListNetworkChangeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListNetworkChangeRequest;
  static deserializeBinaryFromReader(message: ListNetworkChangeRequest, reader: jspb.BinaryReader): ListNetworkChangeRequest;
}

export namespace ListNetworkChangeRequest {
  export type AsObject = {
    subscribe: boolean,
    changeid: string,
    withoutreplay: boolean,
  }
}

export class ListNetworkChangeResponse extends jspb.Message {
  getChange(): onos_config_change_network_types_pb.NetworkChange | undefined;
  setChange(value?: onos_config_change_network_types_pb.NetworkChange): void;
  hasChange(): boolean;
  clearChange(): void;

  getType(): Type;
  setType(value: Type): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListNetworkChangeResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListNetworkChangeResponse): ListNetworkChangeResponse.AsObject;
  static serializeBinaryToWriter(message: ListNetworkChangeResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListNetworkChangeResponse;
  static deserializeBinaryFromReader(message: ListNetworkChangeResponse, reader: jspb.BinaryReader): ListNetworkChangeResponse;
}

export namespace ListNetworkChangeResponse {
  export type AsObject = {
    change?: onos_config_change_network_types_pb.NetworkChange.AsObject,
    type: Type,
  }
}

export class ListDeviceChangeRequest extends jspb.Message {
  getSubscribe(): boolean;
  setSubscribe(value: boolean): void;

  getDeviceId(): string;
  setDeviceId(value: string): void;

  getDeviceVersion(): string;
  setDeviceVersion(value: string): void;

  getWithoutreplay(): boolean;
  setWithoutreplay(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListDeviceChangeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListDeviceChangeRequest): ListDeviceChangeRequest.AsObject;
  static serializeBinaryToWriter(message: ListDeviceChangeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListDeviceChangeRequest;
  static deserializeBinaryFromReader(message: ListDeviceChangeRequest, reader: jspb.BinaryReader): ListDeviceChangeRequest;
}

export namespace ListDeviceChangeRequest {
  export type AsObject = {
    subscribe: boolean,
    deviceId: string,
    deviceVersion: string,
    withoutreplay: boolean,
  }
}

export class ListDeviceChangeResponse extends jspb.Message {
  getChange(): onos_config_change_device_types_pb.DeviceChange | undefined;
  setChange(value?: onos_config_change_device_types_pb.DeviceChange): void;
  hasChange(): boolean;
  clearChange(): void;

  getType(): Type;
  setType(value: Type): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListDeviceChangeResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListDeviceChangeResponse): ListDeviceChangeResponse.AsObject;
  static serializeBinaryToWriter(message: ListDeviceChangeResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListDeviceChangeResponse;
  static deserializeBinaryFromReader(message: ListDeviceChangeResponse, reader: jspb.BinaryReader): ListDeviceChangeResponse;
}

export namespace ListDeviceChangeResponse {
  export type AsObject = {
    change?: onos_config_change_device_types_pb.DeviceChange.AsObject,
    type: Type,
  }
}

export enum Type { 
  NONE = 0,
  ADDED = 1,
  UPDATED = 2,
  REMOVED = 3,
}

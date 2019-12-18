// Code generated by GENERATOR. DO NOT EDIT.

import * as jspb from "google-protobuf"

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb';
import * as gogoproto_gogo_pb from '../../../../../../../gogoproto/gogo_pb';
import * as github_com_onosproject_onos$config_api_types_change_types_pb from '../../../../../../../github.com/onosproject/onos-config/api/types/change/types_pb';
import * as github_com_onosproject_onos$config_api_types_change_device_types_pb from '../../../../../../../github.com/onosproject/onos-config/api/types/change/device/types_pb';

export class NetworkChange extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getIndex(): number;
  setIndex(value: number): void;

  getRevision(): number;
  setRevision(value: number): void;

  getStatus(): github_com_onosproject_onos$config_api_types_change_types_pb.Status | undefined;
  setStatus(value?: github_com_onosproject_onos$config_api_types_change_types_pb.Status): void;
  hasStatus(): boolean;
  clearStatus(): void;

  getCreated(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreated(value?: google_protobuf_timestamp_pb.Timestamp): void;
  hasCreated(): boolean;
  clearCreated(): void;

  getUpdated(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdated(value?: google_protobuf_timestamp_pb.Timestamp): void;
  hasUpdated(): boolean;
  clearUpdated(): void;

  getChangesList(): Array<github_com_onosproject_onos$config_api_types_change_device_types_pb.Change>;
  setChangesList(value: Array<github_com_onosproject_onos$config_api_types_change_device_types_pb.Change>): void;
  clearChangesList(): void;
  addChanges(value?: github_com_onosproject_onos$config_api_types_change_device_types_pb.Change, index?: number): github_com_onosproject_onos$config_api_types_change_device_types_pb.Change;

  getRefsList(): Array<DeviceChangeRef>;
  setRefsList(value: Array<DeviceChangeRef>): void;
  clearRefsList(): void;
  addRefs(value?: DeviceChangeRef, index?: number): DeviceChangeRef;

  getDeleted(): boolean;
  setDeleted(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NetworkChange.AsObject;
  static toObject(includeInstance: boolean, msg: NetworkChange): NetworkChange.AsObject;
  static serializeBinaryToWriter(message: NetworkChange, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NetworkChange;
  static deserializeBinaryFromReader(message: NetworkChange, reader: jspb.BinaryReader): NetworkChange;
}

export namespace NetworkChange {
  export type AsObject = {
    id: string,
    index: number,
    revision: number,
    status?: github_com_onosproject_onos$config_api_types_change_types_pb.Status.AsObject,
    created?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updated?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    changesList: Array<github_com_onosproject_onos$config_api_types_change_device_types_pb.Change.AsObject>,
    refsList: Array<DeviceChangeRef.AsObject>,
    deleted: boolean,
  }
}

export class DeviceChangeRef extends jspb.Message {
  getDeviceChangeId(): string;
  setDeviceChangeId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeviceChangeRef.AsObject;
  static toObject(includeInstance: boolean, msg: DeviceChangeRef): DeviceChangeRef.AsObject;
  static serializeBinaryToWriter(message: DeviceChangeRef, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeviceChangeRef;
  static deserializeBinaryFromReader(message: DeviceChangeRef, reader: jspb.BinaryReader): DeviceChangeRef;
}

export namespace DeviceChangeRef {
  export type AsObject = {
    deviceChangeId: string,
  }
}


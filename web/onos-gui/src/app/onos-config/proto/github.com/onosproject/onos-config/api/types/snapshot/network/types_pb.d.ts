// Code generated by protoc-gen-go. DO NOT EDIT.

import * as jspb from "google-protobuf"

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb';
import * as gogoproto_gogo_pb from '../../../../../../../gogoproto/gogo_pb';
import * as github_com_onosproject_onos$config_api_types_snapshot_types_pb from '../../../../../../../github.com/onosproject/onos-config/api/types/snapshot/types_pb';

export class NetworkSnapshot extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getIndex(): number;
  setIndex(value: number): void;

  getRevision(): number;
  setRevision(value: number): void;

  getStatus(): github_com_onosproject_onos$config_api_types_snapshot_types_pb.Status | undefined;
  setStatus(value?: github_com_onosproject_onos$config_api_types_snapshot_types_pb.Status): void;
  hasStatus(): boolean;
  clearStatus(): void;

  getRetention(): github_com_onosproject_onos$config_api_types_snapshot_types_pb.RetentionOptions | undefined;
  setRetention(value?: github_com_onosproject_onos$config_api_types_snapshot_types_pb.RetentionOptions): void;
  hasRetention(): boolean;
  clearRetention(): void;

  getCreated(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreated(value?: google_protobuf_timestamp_pb.Timestamp): void;
  hasCreated(): boolean;
  clearCreated(): void;

  getUpdated(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdated(value?: google_protobuf_timestamp_pb.Timestamp): void;
  hasUpdated(): boolean;
  clearUpdated(): void;

  getRefsList(): Array<DeviceSnapshotRef>;
  setRefsList(value: Array<DeviceSnapshotRef>): void;
  clearRefsList(): void;
  addRefs(value?: DeviceSnapshotRef, index?: number): DeviceSnapshotRef;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NetworkSnapshot.AsObject;
  static toObject(includeInstance: boolean, msg: NetworkSnapshot): NetworkSnapshot.AsObject;
  static serializeBinaryToWriter(message: NetworkSnapshot, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NetworkSnapshot;
  static deserializeBinaryFromReader(message: NetworkSnapshot, reader: jspb.BinaryReader): NetworkSnapshot;
}

export namespace NetworkSnapshot {
  export type AsObject = {
    id: string,
    index: number,
    revision: number,
    status?: github_com_onosproject_onos$config_api_types_snapshot_types_pb.Status.AsObject,
    retention?: github_com_onosproject_onos$config_api_types_snapshot_types_pb.RetentionOptions.AsObject,
    created?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updated?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    refsList: Array<DeviceSnapshotRef.AsObject>,
  }
}

export class DeviceSnapshotRef extends jspb.Message {
  getDeviceSnapshotId(): string;
  setDeviceSnapshotId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeviceSnapshotRef.AsObject;
  static toObject(includeInstance: boolean, msg: DeviceSnapshotRef): DeviceSnapshotRef.AsObject;
  static serializeBinaryToWriter(message: DeviceSnapshotRef, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeviceSnapshotRef;
  static deserializeBinaryFromReader(message: DeviceSnapshotRef, reader: jspb.BinaryReader): DeviceSnapshotRef;
}

export namespace DeviceSnapshotRef {
  export type AsObject = {
    deviceSnapshotId: string,
  }
}


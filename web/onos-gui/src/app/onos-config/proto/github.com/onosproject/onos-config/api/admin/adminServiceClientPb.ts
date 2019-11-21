/**
 * @fileoverview gRPC-Web generated client stub for onos.config.admin
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


import * as grpcWeb from 'grpc-web';

import * as google_protobuf_duration_pb from 'google-protobuf/google/protobuf/duration_pb';
import * as gogoproto_gogo_pb from '../../../../../gogoproto/gogo_pb';
import * as github_com_openconfig_gnmi_proto_gnmi_gnmi_pb from '../../../../../github.com/openconfig/gnmi/proto/gnmi/gnmi_pb';
import * as github_com_onosproject_onos$config_api_types_change_device_types_pb from '../../../../../github.com/onosproject/onos-config/api/types/change/device/types_pb';
import * as github_com_onosproject_onos$config_api_types_snapshot_device_types_pb from '../../../../../github.com/onosproject/onos-config/api/types/snapshot/device/types_pb';

import {
  Chunk,
  CompactChangesRequest,
  CompactChangesResponse,
  GetSnapshotRequest,
  ListModelsRequest,
  ListSnapshotsRequest,
  ModelInfo,
  RegisterResponse,
  RollbackRequest,
  RollbackResponse} from './admin_pb';

export class ConfigAdminServiceClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: string; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'text';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname;
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodInfoListRegisteredModels = new grpcWeb.AbstractClientBase.MethodInfo(
    ModelInfo,
    (request: ListModelsRequest) => {
      return request.serializeBinary();
    },
    ModelInfo.deserializeBinary
  );

  listRegisteredModels(
    request: ListModelsRequest,
    metadata?: grpcWeb.Metadata) {
    return this.client_.serverStreaming(
      this.hostname_ +
        '/onos.config.admin.ConfigAdminService/ListRegisteredModels',
      request,
      metadata || {},
      this.methodInfoListRegisteredModels);
  }

  methodInfoRollbackNetworkChange = new grpcWeb.AbstractClientBase.MethodInfo(
    RollbackResponse,
    (request: RollbackRequest) => {
      return request.serializeBinary();
    },
    RollbackResponse.deserializeBinary
  );

  rollbackNetworkChange(
    request: RollbackRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: RollbackResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/onos.config.admin.ConfigAdminService/RollbackNetworkChange',
      request,
      metadata || {},
      this.methodInfoRollbackNetworkChange,
      callback);
  }

  methodInfoGetSnapshot = new grpcWeb.AbstractClientBase.MethodInfo(
    github_com_onosproject_onos$config_api_types_snapshot_device_types_pb.Snapshot,
    (request: GetSnapshotRequest) => {
      return request.serializeBinary();
    },
    github_com_onosproject_onos$config_api_types_snapshot_device_types_pb.Snapshot.deserializeBinary
  );

  getSnapshot(
    request: GetSnapshotRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: github_com_onosproject_onos$config_api_types_snapshot_device_types_pb.Snapshot) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/onos.config.admin.ConfigAdminService/GetSnapshot',
      request,
      metadata || {},
      this.methodInfoGetSnapshot,
      callback);
  }

  methodInfoListSnapshots = new grpcWeb.AbstractClientBase.MethodInfo(
    github_com_onosproject_onos$config_api_types_snapshot_device_types_pb.Snapshot,
    (request: ListSnapshotsRequest) => {
      return request.serializeBinary();
    },
    github_com_onosproject_onos$config_api_types_snapshot_device_types_pb.Snapshot.deserializeBinary
  );

  listSnapshots(
    request: ListSnapshotsRequest,
    metadata?: grpcWeb.Metadata) {
    return this.client_.serverStreaming(
      this.hostname_ +
        '/onos.config.admin.ConfigAdminService/ListSnapshots',
      request,
      metadata || {},
      this.methodInfoListSnapshots);
  }

  methodInfoCompactChanges = new grpcWeb.AbstractClientBase.MethodInfo(
    CompactChangesResponse,
    (request: CompactChangesRequest) => {
      return request.serializeBinary();
    },
    CompactChangesResponse.deserializeBinary
  );

  compactChanges(
    request: CompactChangesRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: CompactChangesResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/onos.config.admin.ConfigAdminService/CompactChanges',
      request,
      metadata || {},
      this.methodInfoCompactChanges,
      callback);
  }

}


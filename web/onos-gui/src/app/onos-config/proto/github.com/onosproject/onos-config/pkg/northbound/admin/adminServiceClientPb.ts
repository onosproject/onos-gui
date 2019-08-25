/**
 * @fileoverview gRPC-Web generated client stub for proto
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


import * as grpcWeb from 'grpc-web';

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb';

import * as github_com_openconfig_gnmi_proto_gnmi_gnmi_pb from '../../../../../../github.com/openconfig/gnmi/proto/gnmi/gnmi_pb';

import {
  Chunk,
  ListModelsRequest,
  ModelInfo,
  NetChange,
  NetworkChangesRequest,
  RegisterRequest,
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

  methodInfoRegisterModel = new grpcWeb.AbstractClientBase.MethodInfo(
    RegisterResponse,
    (request: RegisterRequest) => {
      return request.serializeBinary();
    },
    RegisterResponse.deserializeBinary
  );

  registerModel(
    request: RegisterRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: RegisterResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/proto.ConfigAdminService/RegisterModel',
      request,
      metadata || {},
      this.methodInfoRegisterModel,
      callback);
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
        '/proto.ConfigAdminService/ListRegisteredModels',
      request,
      metadata || {},
      this.methodInfoListRegisteredModels);
  }

  methodInfoGetNetworkChanges = new grpcWeb.AbstractClientBase.MethodInfo(
    NetChange,
    (request: NetworkChangesRequest) => {
      return request.serializeBinary();
    },
    NetChange.deserializeBinary
  );

  getNetworkChanges(
    request: NetworkChangesRequest,
    metadata?: grpcWeb.Metadata) {
    return this.client_.serverStreaming(
      this.hostname_ +
        '/proto.ConfigAdminService/GetNetworkChanges',
      request,
      metadata || {},
      this.methodInfoGetNetworkChanges);
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
        '/proto.ConfigAdminService/RollbackNetworkChange',
      request,
      metadata || {},
      this.methodInfoRollbackNetworkChange,
      callback);
  }

}


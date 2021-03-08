/**
 * @fileoverview gRPC-Web generated client stub for onos.configmodel
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


import * as grpcWeb from 'grpc-web';

import {
  DeleteModelRequest,
  DeleteModelResponse,
  GetModelRequest,
  GetModelResponse,
  ListModelsRequest,
  ListModelsResponse,
  PushModelRequest,
  PushModelResponse} from './registry_pb';

export class ConfigModelRegistryServiceClient {
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

  methodInfoGetModel = new grpcWeb.AbstractClientBase.MethodInfo(
    GetModelResponse,
    (request: GetModelRequest) => {
      return request.serializeBinary();
    },
    GetModelResponse.deserializeBinary
  );

  getModel(
    request: GetModelRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: GetModelResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/onos.configmodel.ConfigModelRegistryService/GetModel',
      request,
      metadata || {},
      this.methodInfoGetModel,
      callback);
  }

  methodInfoListModels = new grpcWeb.AbstractClientBase.MethodInfo(
    ListModelsResponse,
    (request: ListModelsRequest) => {
      return request.serializeBinary();
    },
    ListModelsResponse.deserializeBinary
  );

  listModels(
    request: ListModelsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: ListModelsResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/onos.configmodel.ConfigModelRegistryService/ListModels',
      request,
      metadata || {},
      this.methodInfoListModels,
      callback);
  }

  methodInfoPushModel = new grpcWeb.AbstractClientBase.MethodInfo(
    PushModelResponse,
    (request: PushModelRequest) => {
      return request.serializeBinary();
    },
    PushModelResponse.deserializeBinary
  );

  pushModel(
    request: PushModelRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: PushModelResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/onos.configmodel.ConfigModelRegistryService/PushModel',
      request,
      metadata || {},
      this.methodInfoPushModel,
      callback);
  }

  methodInfoDeleteModel = new grpcWeb.AbstractClientBase.MethodInfo(
    DeleteModelResponse,
    (request: DeleteModelRequest) => {
      return request.serializeBinary();
    },
    DeleteModelResponse.deserializeBinary
  );

  deleteModel(
    request: DeleteModelRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: DeleteModelResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/onos.configmodel.ConfigModelRegistryService/DeleteModel',
      request,
      metadata || {},
      this.methodInfoDeleteModel,
      callback);
  }

}


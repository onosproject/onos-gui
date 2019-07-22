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
  DeviceInfo,
  DeviceResponse,
  DeviceSummaryRequest,
  DeviceSummaryResponse,
  GetDevicesRequest,
  ListModelsRequest,
  ModelInfo,
  NetChange,
  NetworkChangesRequest,
  RegisterRequest,
  RegisterResponse,
  RollbackRequest,
  RollbackResponse} from './admin_pb';

export class AdminServiceClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: string; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'binary';

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
        '/proto.AdminService/RegisterModel',
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
        '/proto.AdminService/ListRegisteredModels',
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
        '/proto.AdminService/GetNetworkChanges',
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
        '/proto.AdminService/RollbackNetworkChange',
      request,
      metadata || {},
      this.methodInfoRollbackNetworkChange,
      callback);
  }

}

export class DeviceInventoryServiceClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: string; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'binary';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname;
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodInfoGetDeviceSummary = new grpcWeb.AbstractClientBase.MethodInfo(
    DeviceSummaryResponse,
    (request: DeviceSummaryRequest) => {
      return request.serializeBinary();
    },
    DeviceSummaryResponse.deserializeBinary
  );

  getDeviceSummary(
    request: DeviceSummaryRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: DeviceSummaryResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/proto.DeviceInventoryService/GetDeviceSummary',
      request,
      metadata || {},
      this.methodInfoGetDeviceSummary,
      callback);
  }

  methodInfoAddOrUpdateDevice = new grpcWeb.AbstractClientBase.MethodInfo(
    DeviceResponse,
    (request: DeviceInfo) => {
      return request.serializeBinary();
    },
    DeviceResponse.deserializeBinary
  );

  addOrUpdateDevice(
    request: DeviceInfo,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: DeviceResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/proto.DeviceInventoryService/AddOrUpdateDevice',
      request,
      metadata || {},
      this.methodInfoAddOrUpdateDevice,
      callback);
  }

  methodInfoRemoveDevice = new grpcWeb.AbstractClientBase.MethodInfo(
    DeviceResponse,
    (request: DeviceInfo) => {
      return request.serializeBinary();
    },
    DeviceResponse.deserializeBinary
  );

  removeDevice(
    request: DeviceInfo,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: DeviceResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/proto.DeviceInventoryService/RemoveDevice',
      request,
      metadata || {},
      this.methodInfoRemoveDevice,
      callback);
  }

  methodInfoGetDevices = new grpcWeb.AbstractClientBase.MethodInfo(
    DeviceInfo,
    (request: GetDevicesRequest) => {
      return request.serializeBinary();
    },
    DeviceInfo.deserializeBinary
  );

  getDevices(
    request: GetDevicesRequest,
    metadata?: grpcWeb.Metadata) {
    return this.client_.serverStreaming(
      this.hostname_ +
        '/proto.DeviceInventoryService/GetDevices',
      request,
      metadata || {},
      this.methodInfoGetDevices);
  }

}


/**
 * @fileoverview gRPC-Web generated client stub for topo.device
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


import * as grpcWeb from 'grpc-web';

import * as google_protobuf_duration_pb from 'google-protobuf/google/protobuf/duration_pb';


import {
  AddRequest,
  AddResponse,
  GetRequest,
  GetResponse,
  ListRequest,
  ListResponse,
  RemoveRequest,
  RemoveResponse,
  UpdateRequest,
  UpdateResponse} from './device_pb';

export class DeviceServiceClient {
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

  methodInfoAdd = new grpcWeb.AbstractClientBase.MethodInfo(
    AddResponse,
    (request: AddRequest) => {
      return request.serializeBinary();
    },
    AddResponse.deserializeBinary
  );

  add(
    request: AddRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: AddResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/topo.device.DeviceService/Add',
      request,
      metadata || {},
      this.methodInfoAdd,
      callback);
  }

  methodInfoUpdate = new grpcWeb.AbstractClientBase.MethodInfo(
    UpdateResponse,
    (request: UpdateRequest) => {
      return request.serializeBinary();
    },
    UpdateResponse.deserializeBinary
  );

  update(
    request: UpdateRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: UpdateResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/topo.device.DeviceService/Update',
      request,
      metadata || {},
      this.methodInfoUpdate,
      callback);
  }

  methodInfoGet = new grpcWeb.AbstractClientBase.MethodInfo(
    GetResponse,
    (request: GetRequest) => {
      return request.serializeBinary();
    },
    GetResponse.deserializeBinary
  );

  get(
    request: GetRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: GetResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/topo.device.DeviceService/Get',
      request,
      metadata || {},
      this.methodInfoGet,
      callback);
  }

  methodInfoList = new grpcWeb.AbstractClientBase.MethodInfo(
    ListResponse,
    (request: ListRequest) => {
      return request.serializeBinary();
    },
    ListResponse.deserializeBinary
  );

  list(
    request: ListRequest,
    metadata?: grpcWeb.Metadata) {
    return this.client_.serverStreaming(
      this.hostname_ +
        '/topo.device.DeviceService/List',
      request,
      metadata || {},
      this.methodInfoList);
  }

  methodInfoRemove = new grpcWeb.AbstractClientBase.MethodInfo(
    RemoveResponse,
    (request: RemoveRequest) => {
      return request.serializeBinary();
    },
    RemoveResponse.deserializeBinary
  );

  remove(
    request: RemoveRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: RemoveResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/topo.device.DeviceService/Remove',
      request,
      metadata || {},
      this.methodInfoRemove,
      callback);
  }

}


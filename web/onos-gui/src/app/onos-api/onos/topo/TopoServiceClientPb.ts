/**
 * @fileoverview gRPC-Web generated client stub for onos.topo
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


import * as grpcWeb from 'grpc-web';

import * as gogoproto_gogo_pb from '../../gogoproto/gogo_pb';

import {
  CreateRequest,
  CreateResponse,
  DeleteRequest,
  DeleteResponse,
  GetRequest,
  GetResponse,
  ListRequest,
  ListResponse,
  UpdateRequest,
  UpdateResponse,
  WatchRequest,
  WatchResponse} from './topo_pb';

export class TopoClient {
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

  methodInfoCreate = new grpcWeb.AbstractClientBase.MethodInfo(
    CreateResponse,
    (request: CreateRequest) => {
      return request.serializeBinary();
    },
    CreateResponse.deserializeBinary
  );

  create(
    request: CreateRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: CreateResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/onos.topo.Topo/Create',
      request,
      metadata || {},
      this.methodInfoCreate,
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
        '/onos.topo.Topo/Get',
      request,
      metadata || {},
      this.methodInfoGet,
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
        '/onos.topo.Topo/Update',
      request,
      metadata || {},
      this.methodInfoUpdate,
      callback);
  }

  methodInfoDelete = new grpcWeb.AbstractClientBase.MethodInfo(
    DeleteResponse,
    (request: DeleteRequest) => {
      return request.serializeBinary();
    },
    DeleteResponse.deserializeBinary
  );

  delete(
    request: DeleteRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: DeleteResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/onos.topo.Topo/Delete',
      request,
      metadata || {},
      this.methodInfoDelete,
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
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: ListResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/onos.topo.Topo/List',
      request,
      metadata || {},
      this.methodInfoList,
      callback);
  }

  methodInfoWatch = new grpcWeb.AbstractClientBase.MethodInfo(
    WatchResponse,
    (request: WatchRequest) => {
      return request.serializeBinary();
    },
    WatchResponse.deserializeBinary
  );

  watch(
    request: WatchRequest,
    metadata?: grpcWeb.Metadata) {
    return this.client_.serverStreaming(
      this.hostname_ +
        '/onos.topo.Topo/Watch',
      request,
      metadata || {},
      this.methodInfoWatch);
  }

}


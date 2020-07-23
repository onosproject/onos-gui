/**
 * @fileoverview gRPC-Web generated client stub for topo
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


import * as grpcWeb from 'grpc-web';

import * as gogoproto_gogo_pb from '../../../../../gogoproto/gogo_pb';

import {
  DeleteRequest,
  DeleteResponse,
  GetRequest,
  GetResponse,
  ListRequest,
  ListResponse,
  SetRequest,
  SetResponse,
  SubscribeRequest,
  SubscribeResponse} from './topo_pb';

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

  methodInfoSet = new grpcWeb.AbstractClientBase.MethodInfo(
    SetResponse,
    (request: SetRequest) => {
      return request.serializeBinary();
    },
    SetResponse.deserializeBinary
  );

  set(
    request: SetRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: SetResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/topo.Topo/Set',
      request,
      metadata || {},
      this.methodInfoSet,
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
        '/topo.Topo/Get',
      request,
      metadata || {},
      this.methodInfoGet,
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
        '/topo.Topo/Delete',
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
    metadata?: grpcWeb.Metadata) {
    return this.client_.serverStreaming(
      this.hostname_ +
        '/topo.Topo/List',
      request,
      metadata || {},
      this.methodInfoList);
  }

  methodInfoSubscribe = new grpcWeb.AbstractClientBase.MethodInfo(
    SubscribeResponse,
    (request: SubscribeRequest) => {
      return request.serializeBinary();
    },
    SubscribeResponse.deserializeBinary
  );

  subscribe(
    request: SubscribeRequest,
    metadata?: grpcWeb.Metadata) {
    return this.client_.serverStreaming(
      this.hostname_ +
        '/topo.Topo/Subscribe',
      request,
      metadata || {},
      this.methodInfoSubscribe);
  }

}


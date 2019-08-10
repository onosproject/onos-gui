/**
 * @fileoverview gRPC-Web generated client stub for proto
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


import * as grpcWeb from 'grpc-web';

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb';

import {
  Change,
  ChangeValue,
  ChangesRequest,
  ConfigRequest,
  Configuration,
  OpStateRequest} from './diags_pb';

export class ConfigDiagsClient {
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

  methodInfoGetChanges = new grpcWeb.AbstractClientBase.MethodInfo(
    Change,
    (request: ChangesRequest) => {
      return request.serializeBinary();
    },
    Change.deserializeBinary
  );

  getChanges(
    request: ChangesRequest,
    metadata?: grpcWeb.Metadata) {
    return this.client_.serverStreaming(
      this.hostname_ +
        '/proto.ConfigDiags/GetChanges',
      request,
      metadata || {},
      this.methodInfoGetChanges);
  }

  methodInfoGetConfigurations = new grpcWeb.AbstractClientBase.MethodInfo(
    Configuration,
    (request: ConfigRequest) => {
      return request.serializeBinary();
    },
    Configuration.deserializeBinary
  );

  getConfigurations(
    request: ConfigRequest,
    metadata?: grpcWeb.Metadata) {
    return this.client_.serverStreaming(
      this.hostname_ +
        '/proto.ConfigDiags/GetConfigurations',
      request,
      metadata || {},
      this.methodInfoGetConfigurations);
  }

}

export class OpStateDiagsClient {
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

  methodInfoGetOpState = new grpcWeb.AbstractClientBase.MethodInfo(
    ChangeValue,
    (request: OpStateRequest) => {
      return request.serializeBinary();
    },
    ChangeValue.deserializeBinary
  );

  getOpState(
    request: OpStateRequest,
    metadata?: grpcWeb.Metadata) {
    return this.client_.serverStreaming(
      this.hostname_ +
        '/proto.OpStateDiags/GetOpState',
      request,
      metadata || {},
      this.methodInfoGetOpState);
  }

}


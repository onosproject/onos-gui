/**
 * @fileoverview gRPC-Web generated client stub for proto
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


import * as grpcWeb from 'grpc-web';

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb';

import * as github_com_onosproject_onos$config_pkg_northbound_admin_admin_pb from '../../../../../../github.com/onosproject/onos-config/pkg/northbound/admin/admin_pb';

import {
  ChangesRequest,
  ConfigRequest,
  Configuration,
  OpStateRequest,
  OpStateResponse} from './diags_pb';

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
    options['format'] = 'text';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname;
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodInfoGetChanges = new grpcWeb.AbstractClientBase.MethodInfo(
    github_com_onosproject_onos$config_pkg_northbound_admin_admin_pb.Change,
    (request: ChangesRequest) => {
      return request.serializeBinary();
    },
    github_com_onosproject_onos$config_pkg_northbound_admin_admin_pb.Change.deserializeBinary
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
    options['format'] = 'text';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname;
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodInfoGetOpState = new grpcWeb.AbstractClientBase.MethodInfo(
    OpStateResponse,
    (request: OpStateRequest) => {
      return request.serializeBinary();
    },
    OpStateResponse.deserializeBinary
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


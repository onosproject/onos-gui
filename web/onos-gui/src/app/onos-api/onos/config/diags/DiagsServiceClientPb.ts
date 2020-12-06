// GENERATED CODE -- DO NOT EDIT!
/**
 * @fileoverview gRPC-Web generated client stub for onos.config.diags
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


import * as grpcWeb from 'grpc-web';

import * as gogoproto_gogo_pb from '../../../gogoproto/gogo_pb';
import * as onos_config_admin_admin_pb from '../../../onos/config/admin/admin_pb';
import * as onos_config_change_device_types_pb from '../../../onos/config/change/device/types_pb';
import * as onos_config_change_network_types_pb from '../../../onos/config/change/network/types_pb';

import {
  ListDeviceChangeRequest,
  ListDeviceChangeResponse,
  ListNetworkChangeRequest,
  ListNetworkChangeResponse,
  OpStateRequest,
  OpStateResponse} from './diags_pb';

export class ChangeServiceClient {
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

  methodInfoListNetworkChanges = new grpcWeb.AbstractClientBase.MethodInfo(
    ListNetworkChangeResponse,
    (request: ListNetworkChangeRequest) => {
      return request.serializeBinary();
    },
    ListNetworkChangeResponse.deserializeBinary
  );

  listNetworkChanges(
    request: ListNetworkChangeRequest,
    metadata?: grpcWeb.Metadata) {
    return this.client_.serverStreaming(
      this.hostname_ +
        '/onos.config.diags.ChangeService/ListNetworkChanges',
      request,
      metadata || {},
      this.methodInfoListNetworkChanges);
  }

  methodInfoListDeviceChanges = new grpcWeb.AbstractClientBase.MethodInfo(
    ListDeviceChangeResponse,
    (request: ListDeviceChangeRequest) => {
      return request.serializeBinary();
    },
    ListDeviceChangeResponse.deserializeBinary
  );

  listDeviceChanges(
    request: ListDeviceChangeRequest,
    metadata?: grpcWeb.Metadata) {
    return this.client_.serverStreaming(
      this.hostname_ +
        '/onos.config.diags.ChangeService/ListDeviceChanges',
      request,
      metadata || {},
      this.methodInfoListDeviceChanges);
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
        '/onos.config.diags.OpStateDiags/GetOpState',
      request,
      metadata || {},
      this.methodInfoGetOpState);
  }

}


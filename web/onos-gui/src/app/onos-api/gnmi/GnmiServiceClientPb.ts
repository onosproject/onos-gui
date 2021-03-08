/**
 * @fileoverview gRPC-Web generated client stub for gnmi
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


import * as grpcWeb from 'grpc-web';

import * as google_protobuf_any_pb from 'google-protobuf/google/protobuf/any_pb';
import * as google_protobuf_descriptor_pb from 'google-protobuf/google/protobuf/descriptor_pb';
// import * as github_com_openconfig_gnmi_proto_gnmi_ext_gnmi_ext_pb from '../github.com/openconfig/gnmi/proto/gnmi_ext/gnmi_ext_pb';

import {
  CapabilityRequest,
  CapabilityResponse,
  GetRequest,
  GetResponse,
  SetRequest,
  SetResponse,
  SubscribeRequest,
  SubscribeResponse} from './gnmi_pb';

export class gNMIClient {
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

  methodInfoCapabilities = new grpcWeb.AbstractClientBase.MethodInfo(
    CapabilityResponse,
    (request: CapabilityRequest) => {
      return request.serializeBinary();
    },
    CapabilityResponse.deserializeBinary
  );

  capabilities(
    request: CapabilityRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: CapabilityResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/gnmi.gNMI/Capabilities',
      request,
      metadata || {},
      this.methodInfoCapabilities,
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
        '/gnmi.gNMI/Get',
      request,
      metadata || {},
      this.methodInfoGet,
      callback);
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
        '/gnmi.gNMI/Set',
      request,
      metadata || {},
      this.methodInfoSet,
      callback);
  }

}


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

import {
  Change,
  ChangesRequest,
  ConfigRequest,
  Configuration} from './diags_pb';

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


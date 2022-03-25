#!/bin/sh

# SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
#
# SPDX-License-Identifier: Apache-2.0

proto_imports=".:${GOPATH}/src/github.com/gogo/protobuf/protobuf:${GOPATH}/src/github.com/gogo/protobuf:${GOPATH}/src/github.com/google/protobuf/src:${GOPATH}/src:${GOPATH}/src/github.com/onosproject/onos-api/proto:${GOPATH}/src/github.com/openconfig/gnmi/proto"
OUT_DIR=web/onos-gui/src/app
# Warning this required protoc v3.9.0 or greater
protoc -I=$proto_imports --js_out=import_style=commonjs:$OUT_DIR/onos-api \
  --grpc-web_out=import_style=typescript,mode=grpcwebtext:$OUT_DIR/onos-api \
  onos/config/change/types.proto
protoc -I=$proto_imports --js_out=import_style=commonjs:$OUT_DIR/onos-api \
  --grpc-web_out=import_style=typescript,mode=grpcwebtext:$OUT_DIR/onos-api \
  onos/config/change/device/types.proto
protoc -I=$proto_imports --js_out=import_style=commonjs:$OUT_DIR/onos-api \
  --grpc-web_out=import_style=typescript,mode=grpcwebtext:$OUT_DIR/onos-api \
  onos/config/change/network/types.proto
protoc -I=$proto_imports --js_out=import_style=commonjs:$OUT_DIR/onos-api \
  --grpc-web_out=import_style=typescript,mode=grpcwebtext:$OUT_DIR/onos-api \
  onos/config/snapshot/types.proto
protoc -I=$proto_imports --js_out=import_style=commonjs:$OUT_DIR/onos-api \
  --grpc-web_out=import_style=typescript,mode=grpcwebtext:$OUT_DIR/onos-api \
  onos/config/snapshot/device/types.proto
protoc -I=$proto_imports --js_out=import_style=commonjs:$OUT_DIR/onos-api \
  --grpc-web_out=import_style=typescript,mode=grpcwebtext:$OUT_DIR/onos-api \
  onos/config/snapshot/network/types.proto
protoc -I=$proto_imports --js_out=import_style=commonjs:$OUT_DIR/onos-api \
  --grpc-web_out=import_style=typescript,mode=grpcwebtext:$OUT_DIR/onos-api \
  onos/config/diags/diags.proto
protoc -I=$proto_imports --js_out=import_style=commonjs:$OUT_DIR/onos-api \
  --grpc-web_out=import_style=typescript,mode=grpcwebtext:$OUT_DIR/onos-api \
  onos/config/admin/admin.proto
protoc -I=$proto_imports --js_out=import_style=commonjs:$OUT_DIR/onos-api \
  --grpc-web_out=import_style=typescript,mode=grpcwebtext:$OUT_DIR/onos-api \
  gnmi/gnmi.proto
protoc -I=$proto_imports --js_out=import_style=commonjs:$OUT_DIR/onos-api \
  --grpc-web_out=import_style=typescript,mode=grpcwebtext:$OUT_DIR/onos-api \
  onos/configmodel/registry.proto
protoc -I=$proto_imports --js_out=import_style=commonjs:$OUT_DIR/onos-api \
  --grpc-web_out=import_style=typescript,mode=grpcwebtext:$OUT_DIR/onos-api \
  gnmi_ext/gnmi_ext.proto
protoc -I=$proto_imports --js_out=import_style=commonjs:$OUT_DIR/onos-api \
  --grpc-web_out=import_style=typescript,mode=grpcwebtext:$OUT_DIR/onos-api \
  onos/topo/topo.proto
protoc -I=$proto_imports --js_out=import_style=commonjs:$OUT_DIR/onos-api \
  --grpc-web_out=import_style=typescript,mode=grpcwebtext:$OUT_DIR/onos-api \
  gogoproto/gogo.proto

# Add the license text to generated files
for f in $(find web/onos-gui/src/app/onos-api/ -type f -name "*.d.ts"); do
  cat ../build-tools/licensing/boilerplates/SPDX-Apache-2.0/boilerplate.generatego.txt | sed -e '$a\\' | cat - $f > tempf && mv tempf $f
done

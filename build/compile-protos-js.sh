#!/bin/sh

proto_imports=".:${GOPATH}/src/github.com/google/protobuf/src:${GOPATH}/src"

protoc -I=$proto_imports --js_out=import_style=commonjs:. build/proto/diags.proto

protoc -I=$proto_imports --grpc-web_out=import_style=typescript,mode=grpcwebtext:. build/proto/diags.proto
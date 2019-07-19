#!/bin/sh

# Warning this required protoc v3.9.0 or greater
protoc --js_out=import_style=commonjs:. ${GOPATH}/src/github.com/onosproject/onos-config/pkg/northbound/proto/diags.proto
protoc --js_out=import_style=commonjs:. ${GOPATH}/src/github.com/onosproject/onos-config/pkg/northbound/proto/admin.proto
protoc --js_out=import_style=commonjs:. ${GOPATH}/src/github.com/openconfig/gnmi/proto/gnmi/gnmi.proto
protoc --js_out=import_style=commonjs:. ${GOPATH}/src/github.com/openconfig/gnmi/proto/gnmi_ext/gnmi_ext.proto

# Currently a bug in the below command outputs to "Build/proto" (uppercase B)
protoc --grpc-web_out=import_style=typescript,mode=grpcweb:. ${GOPATH}/src/github.com/onosproject/onos-config/pkg/northbound/proto/diags.proto
protoc --grpc-web_out=import_style=typescript,mode=grpcweb:. ${GOPATH}/src/github.com/openconfig/gnmi/proto/gnmi/gnmi.proto
protoc --grpc-web_out=import_style=typescript,mode=grpcweb:. ${GOPATH}/src/github.com/openconfig/gnmi/proto/gnmi_ext/gnmi_ext.proto

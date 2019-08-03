#!/bin/sh

proto_imports=".:${GOPATH}/src/github.com/google/protobuf/src:${GOPATH}/src:${GOPATH}/src/github.com/onosproject/onos-config/"

# Warning this required protoc v3.9.0 or greater
protoc -I=$proto_imports --js_out=import_style=commonjs:. ${GOPATH}/src/github.com/onosproject/onos-config/pkg/northbound/proto/diags.proto
protoc -I=$proto_imports --js_out=import_style=commonjs:. ${GOPATH}/src/github.com/onosproject/onos-config/pkg/northbound/proto/admin.proto
protoc -I=$proto_imports --js_out=import_style=commonjs:. ${GOPATH}/src/github.com/openconfig/gnmi/proto/gnmi/gnmi.proto
protoc -I=$proto_imports --js_out=import_style=commonjs:. ${GOPATH}/src/github.com/openconfig/gnmi/proto/gnmi_ext/gnmi_ext.proto

# Currently a bug in the below command outputs to "Github.com" (uppercase G)
protoc -I=$proto_imports --grpc-web_out=import_style=typescript,mode=grpcweb:. ${GOPATH}/src/github.com/onosproject/onos-config/pkg/northbound/proto/admin.proto
protoc -I=$proto_imports --grpc-web_out=import_style=typescript,mode=grpcweb:. ${GOPATH}/src/github.com/onosproject/onos-config/pkg/northbound/proto/diags.proto
protoc -I=$proto_imports --grpc-web_out=import_style=typescript,mode=grpcweb:. ${GOPATH}/src/github.com/openconfig/gnmi/proto/gnmi/gnmi.proto
protoc -I=$proto_imports --grpc-web_out=import_style=typescript,mode=grpcweb:. ${GOPATH}/src/github.com/openconfig/gnmi/proto/gnmi_ext/gnmi_ext.proto

cp -r github.com/* web/onos-gui/src/app/onos-config/proto/github.com/
rm -rf github.com
cp -r Github.com/* web/onos-gui/src/app/onos-config/proto/github.com/
rm -rf Github.com

# Add the license text to generated files
THISYEAR=$(date +'%Y')
for f in $(find web/onos-gui/src/app/onos-config/proto/github.com/ -type f); do
  cat build/licensing/boilerplate.ts.txt | sed -e 's/YEAR/'$THISYEAR'/' | sed -e '$a\\' | cat - $f > tempf && mv tempf $f
done

# Correct the path of diags imported in to admin
for f in $(find web/onos-gui/src/app/onos-config/proto/github.com/onosproject/onos-config/pkg/northbound/proto/ -type f -name "admin*"); do
  sed -i 's/..\/..\/..\/..\/..\/..\/pkg\/northbound\/proto\/diags_pb/..\/..\/..\/pkg\/northbound\/proto\/diags_pb/g' $f
done
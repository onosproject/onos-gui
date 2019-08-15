#!/bin/sh

proto_imports=".:${GOPATH}/src/github.com/gogo/protobuf/protobuf:${GOPATH}/src/github.com/gogo/protobuf:${GOPATH}/src/github.com/google/protobuf/src:${GOPATH}/src:${GOPATH}/src/github.com/onosproject/onos-config/"

# Warning this required protoc v3.9.0 or greater
protoc -I=$proto_imports --js_out=import_style=commonjs:. ${GOPATH}/src/github.com/onosproject/onos-config/pkg/northbound/diags/diags.proto
protoc -I=$proto_imports --js_out=import_style=commonjs:. ${GOPATH}/src/github.com/onosproject/onos-config/pkg/northbound/admin/admin.proto
protoc -I=$proto_imports --js_out=import_style=commonjs:. ${GOPATH}/src/github.com/openconfig/gnmi/proto/gnmi/gnmi.proto
protoc -I=$proto_imports --js_out=import_style=commonjs:. ${GOPATH}/src/github.com/openconfig/gnmi/proto/gnmi_ext/gnmi_ext.proto
protoc -I=$proto_imports --js_out=import_style=commonjs:. ${GOPATH}/src/github.com/onosproject/onos-topo/pkg/northbound/device/device.proto
protoc -I=$proto_imports --js_out=import_style=commonjs:. ${GOPATH}/src/github.com/onosproject/onos-topo/pkg/northbound/admin/admin.proto
protoc -I=$proto_imports --js_out=import_style=commonjs:. ${GOPATH}/src/github.com/onosproject/onos-topo/pkg/northbound/diags/diags.proto
protoc -I=$proto_imports --js_out=import_style=commonjs:. ${GOPATH}/src/github.com/gogo/protobuf/gogoproto/gogo.proto

# Currently a bug in the below command outputs to "Github.com" (uppercase G)
# The below uses grpcwebtext as Google implementation does not fully support server side streaming yet (Aug'19)
# See https://grpc.io/blog/state-of-grpc-web/
protoc -I=$proto_imports --grpc-web_out=import_style=typescript,mode=grpcwebtext:. ${GOPATH}/src/github.com/onosproject/onos-config/pkg/northbound/admin/admin.proto
protoc -I=$proto_imports --grpc-web_out=import_style=typescript,mode=grpcwebtext:. ${GOPATH}/src/github.com/onosproject/onos-config/pkg/northbound/diags/diags.proto
protoc -I=$proto_imports --grpc-web_out=import_style=typescript,mode=grpcwebtext:. ${GOPATH}/src/github.com/openconfig/gnmi/proto/gnmi/gnmi.proto
protoc -I=$proto_imports --grpc-web_out=import_style=typescript,mode=grpcwebtext:. ${GOPATH}/src/github.com/openconfig/gnmi/proto/gnmi_ext/gnmi_ext.proto
protoc -I=$proto_imports --grpc-web_out=import_style=typescript,mode=grpcwebtext:. ${GOPATH}/src/github.com/onosproject/onos-topo/pkg/northbound/device/device.proto
protoc -I=$proto_imports --grpc-web_out=import_style=typescript,mode=grpcwebtext:. ${GOPATH}/src/github.com/onosproject/onos-topo/pkg/northbound/admin/admin.proto
protoc -I=$proto_imports --grpc-web_out=import_style=typescript,mode=grpcwebtext:. ${GOPATH}/src/github.com/onosproject/onos-topo/pkg/northbound/diags/diags.proto

cp -r github.com/onosproject/onos-config/* web/onos-gui/src/app/onos-config/proto/github.com/onosproject/onos-config/
cp -r github.com/openconfig/* web/onos-gui/src/app/onos-config/proto/github.com/openconfig/
cp -r github.com/onosproject/onos-topo/* web/onos-gui/src/app/onos-topo/proto/github.com/onosproject/onos-topo/
rm -rf github.com
cp -r gogoproto/* web/onos-gui/src/app/onos-topo/proto/gogoproto/
cp -r gogoproto/* web/onos-gui/src/app/onos-config/proto/gogoproto/
rm -rf gogoproto
cp -r Github.com/onosproject/onos-config/* web/onos-gui/src/app/onos-config/proto/github.com/onosproject/onos-config/
cp -r Github.com/openconfig/* web/onos-gui/src/app/onos-config/proto/github.com/openconfig/
cp -r Github.com/onosproject/onos-topo/* web/onos-gui/src/app/onos-topo/proto/github.com/onosproject/onos-topo/
rm -rf Github.com

# Add the license text to generated files
for f in $(find web/onos-gui/src/app/onos-*/proto/github.com/ -type f -name "*.d.ts"); do
  cat build/licensing/boilerplate.generatego.txt | sed -e '$a\\' | cat - $f > tempf && mv tempf $f
done

# Remove unused import for gogoproto
for f in $(find web/onos-gui/src/app/onos-* -type f -name "*ts"); do
  sed -i "s/import \* as gogoproto_gogo_pb from '..\/..\/..\/..\/..\/..\/gogoproto\/gogo_pb';//g" $f
done

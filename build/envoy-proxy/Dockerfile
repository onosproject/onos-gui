FROM envoyproxy/envoy-alpine:latest

COPY build/onos-gui/certs /etc/ssl/certs/
COPY build/envoy-proxy/envoy.yaml /etc/envoy.yaml
CMD /usr/local/bin/envoy -c /etc/envoy.yaml
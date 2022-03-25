# SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
#
# SPDX-License-Identifier: Apache-2.0

FROM nginx:alpine

ENV KUBECTL_VERSION="v1.17.0"

RUN apk add --update ca-certificates curl bash \
    && curl -L https://storage.googleapis.com/kubernetes-release/release/${KUBECTL_VERSION}/bin/linux/amd64/kubectl -o /usr/local/bin/kubectl \
    && chmod +x /usr/local/bin/kubectl \
    && rm /var/cache/apk/*

COPY web/onos-gui/dist/onos-gui /usr/share/nginx/html
COPY build/onos-gui/startup.sh /usr/local/bin
COPY build/onos-gui/docker-entrypoint.sh /usr/local/bin
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["/usr/local/bin/startup.sh"]
EXPOSE 80

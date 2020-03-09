FROM nginx:alpine

ENV KUBECTL_VERSION="v1.17.0"

RUN apk add --update ca-certificates curl bash \
    && curl -L https://storage.googleapis.com/kubernetes-release/release/${KUBECTL_VERSION}/bin/linux/amd64/kubectl -o /usr/local/bin/kubectl \
    && chmod +x /usr/local/bin/kubectl \
    && rm /var/cache/apk/*

COPY web/onos-gui/dist/onos-gui /usr/share/nginx/html

COPY build/onos-gui/startup.sh /usr/local/bin

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/startup.sh"]

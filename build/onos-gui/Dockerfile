FROM nginx:alpine
RUN apk add curl
COPY web/onos-gui/dist/onos-gui /usr/share/nginx/html
COPY build/onos-gui/nginx.conf /etc/nginx/nginx.conf
COPY build/onos-gui/certs /usr/share/certs/

EXPOSE 80
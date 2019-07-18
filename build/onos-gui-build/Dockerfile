FROM  teracy/angular-cli

COPY . /go/src/github.com/onosproject/onos-gui
RUN cd /go/src/github.com/onosproject/onos-gui/web/onos-gui && npm install

WORKDIR "/go/src/github.com/onosproject/onos-gui"

ENTRYPOINT ["make"]

# onos-gui
GUI for ONOS (µONOS Architecture)

onos-gui is the GUI application for all of the GUI functionality of µONOS.

It will provide GUI interfaces for all of the core projects such as
* [onos-config](docs/config-gui.md)
* onos-topo
* onos-control

For the moment (Jul '19) the Configuration GUI is the main target, but generally
the architecture will support UI extensions for any project, as libraries.

## Architecture
The GUI is architected as a Cloud Native application to be run on Kubernetes
accessing the back end modules through gRPC (and in the case of the Config GUI
additionally through gNMI)

The front end technology is [Angular](https://angular.io) and [gRPC Web](https://github.com/grpc/grpc-web)
is used to access the back end systems. [Nginx](https://nginx.org/) acts as a
Proxy and al is deployed on [Docker](https://www.docker.com/community/open-source).
<!--
SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>

SPDX-License-Identifier: Apache-2.0
-->

# onos-gui project
GUI for ONOS (µONOS Architecture).

`onos-gui` is the GUI application for all of the GUI functionality of µONOS.

It provides GUI interfaces for all of the core projects such as

* [onos-config]
* onos-topo
* onos-control (future)
* [onos-ric]

The list of GUI views in the Navigation menu is dependent on the services running
in Kubernetes.

![onos-gui-nav-menu](images/onos-gui-nav-menu.png)

> If a service is stopped the option will disappear from the menu. If the current
> view's service is stopped, the Nav menu can be used to change to another view
> without refreshing.

## Deploying and Running the GUI
`onos-gui` can only be run in a Kubernetes cluster.

Use the [Helm Chart] to load it.

## Browser access
When deployed, the onos-gui is available to a browser by forwarding port 80 by running:
```bash
kubectl -n onos port-forward $(kubectl -n onos get pods -l type=gui -o name) 8182:80
```
See [Helm Chart] for other options.

## Architecture
See [Architecture] for an architectural description.

[Helm Chart]: ./deployment.md
[Architecture]: ./architecture.md
[onos-config]: ./config-gui.md
[onos-ric]: ./ran-gui.md

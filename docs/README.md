# onos-gui project
GUI for ONOS (µONOS Architecture).

`onos-gui` is the GUI application for all of the GUI functionality of µONOS.

It provides GUI interfaces for all of the core projects such as

* [onos-config]
* onos-topo
* onos-control (future)
* onos-ran (future)

In the first iteration (Jan '20) the Configuration GUI is the main target, but generally
the architecture will support UI extensions for any project, as libraries.

## Deploying and Running the GUI
onos-gui can only be run in a Kubernetes cluster.

Use the [Helm Chart] to load it.

## Browser access
When deployed, the onos-gui is available to a browser at the Cluster IP address.
This may be found by running:
```bash
kubectl -n onos get services -l app.kubernetes.io/instance=onos-gui
```
See [Helm Chart] for other options.

## Architecture
See [Architecture] for an architectural description.

[Helm Chart]: ./deployment.md
[Architecture]: ./architecture.md
[onos-config]: ./config-gui.md

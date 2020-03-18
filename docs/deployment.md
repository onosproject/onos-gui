# Deploying and running onos-gui with Helm

This guide deploys `onos-gui` through it's [Helm] chart and assumes you have a [Kubernetes] cluster running 
with an atomix controller deployed in a namespace.

`onos-gui` Helm chart is based on Helm 3.0 version, with no need for the Tiller pod to be present.

> The onos-gui deployment consists of 2 containers:
>
> * onos-gui - containing an nginx web server, kubectl and the compiled GUI
> * onos-envoy - containing a grpc-web proxy for connecting to onos-topo, onos-config etc.

If you don't have a cluster running and want to try on your local machine please follow first
the [Kubernetes] setup steps outlined in [deploy with Helm](https://docs.onosproject.org/developers/deploy_with_helm/).
The following steps assume you have the setup outlined in that page, including the `micro-onos` namespace configured.

> Note: if deploying the GUI on top of `onit` that its default namespace is `onos`,
> so any mention of `micro-onos` below should be replaced with `onos`

> The GUI can also be installed on a test pod by referring to its cluster name 

## Installing the Chart
To install the chart in the `micro-onos` namespace run from the root directory of the `onos-helm-charts` repo the command:
```bash
helm install -n micro-onos onos-gui onos-gui
```
The output should be like:
```bash
NAME: onos-gui
LAST DEPLOYED: Sun Dec  8 19:40:39 2019
NAMESPACE: micro-onos
STATUS: deployed
REVISION: 1
TEST SUITE: None
```

`helm install` assigns a unique name to the chart and displays all the k8s resources that were
created by it. To list the charts that are installed and view their statuses, run `helm ls -n micro-onos`:

```bash
helm ls -n micro-onos
NAME        REVISION	UPDATED                 STATUS  	CHART           APP VERSION	NAMESPACE
...
onos-gui	1       	Sun Dec 8 18:56:39 2019	DEPLOYED	onos-gui-0.1.0	0.1.0      	default
```

### Installing the chart in a different namespace.

Issue the `helm install` command substituting `micro-onos` with your namespace.
```bash
helm install -n <your_name_space> onos-gui onos-gui
```

### Troubleshoot

If your chart does not install or the pod is not running for some reason and/or
you modified values Helm offers two flags to help you debug your chart:

* `--dry-run` check the chart without actually installing the pod. 
* `--debug` prints out more information about your chart

```bash
helm install -n micro-onos onos-gui --debug --dry-run onos-gui
```

Also to verify how template values are expanded, run:
```bash
helm install template onos-gui
```

## Uninstalling the chart.

To remove the `onos-gui` pod issue
```bash
 helm delete -n micro-onos onos-gui
```
## Pod Information
To view the pods that are deployed, run `kubectl -n micro-onos get pods`.

## Running the GUI
Use the terminal to find the "GUI Service IP Address"
```bash
kubectl -n onos get services -l app.kubernetes.io/instance=onos-gui
```

and open in your browser to access the GUI directly at: **http://{GUI Service IP Address}**.

## Accessing the GUI from outside the Kubernetes cluster machine
If access is required from another computer, first find the IP address of the
external interface of the Kubernetes machine, by running the following in the
Kubernetes machine:
```bash
ip route get <other computer's ip address>
```
this might give a response like (in the case where the *other machine ip address* is **192.168.0.100**):
```bash
192.168.0.100 dev ens1 src 192.168.0.2 uid 1000
```

Here the 5th field **192.168.0.2** is the address of K8s cluster that's facing the "other computer".
To make the GUI available to the "other computer", run the following on the Kubernetes machine:
```bash
kubectl -n micro-onos port-forward $(kubectl -n micro-onos get pods -l type=gui -o name) --address 192.168.0.2 8181:80
```

and open in your browser to access the GUI at: **http://192.168.0.2:8181**.

## Developer mode only
To run the GUI locally on a development machine

- install the prerequisites as described in [Prerequisites]
- run ONIT in Kubernetes as above
- Forward the ports of the envoy proxy in 2 separate terminals
```bash
kubectl -n micro-onos port-forward $(kubectl -n micro-onos get pods -l type=gui -o name) 8081
```
> Depending on the service you are developing you might want to forward a different ports (or all ports)
>
> * 8081 is for onos-config
> * 8082 is for onos-topo
> * 8083 is for onos-ric
> * 8084 is for ran-simulator

- run the Angular CLI in `ng serve` mode from the `web/onos-gui` folder
- browse to [http://localhost:4200](http://localhost:4200)

[Helm]: https://helm.sh/
[Kubernetes]: https://kubernetes.io/
[Prerequisites]: ./prerequisites.md

# Deploying onos-gui with Helm

This guide deploys `onos-gui` through it's [Helm] chart and assumes you have a [Kubernetes] cluster running 
with an atomix controller deployed in a namespace.  
`onos-gui` Helm chart is based on Helm 3.0 version, with no need for the Tiller pod to be present.

> The onos-gui deployment consists of 2 containers:
>
> * onos-gui - containing an nginx web server and the compiled GUI
> * onos-envoy - containing a grpc-web proxy for connecting to onos-topo, onos-config etc.

If you don't have a cluster running and want to try on your local machine please follow first 
the [Kubernetes] setup steps outlined in [deploy with Helm](https://docs.onosproject.org/developers/deploy_with_helm/).
The following steps assume you have the setup outlined in that page, including the `micro-onos` namespace configured.

> Note: if deploying the GUI on top of `onit` that its default namespace is `onos`,
> so any mention of `micro-onos` below should be replaced with `onos` 

## Installing the Chart
To install the chart in the `micro-onos` namespace run from the root directory of the `onos-helm-charts` repo the command:
```bash
helm install -n micro-onos onos-gui onos-gui
```
The output should be:
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
NAME          	REVISION	UPDATED                 	STATUS  	CHART                    	APP VERSION	NAMESPACE
...
onos-gui	1       	Sun Dec 8 18:56:39 2019	DEPLOYED	onos-gui-0.1.0	        0.1.0      	default
```

> onos-gui is dependent on onos-topo and onos-config services in the same namespace
> each being available with gRPC at port 5150. If these are not available at startup
> time, then K8S will repeat the startup until they become available.

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
To run the GUI follow the instructions at [Running onos-gui](run.md)

Use the terminal to find the GUI IP address, and open in your browser.
```bash
kubectl -n onos get services -l app.kubernetes.io/instance=onos-gui
```

[Helm]: https://helm.sh/
[Kubernetes]: https://kubernetes.io/


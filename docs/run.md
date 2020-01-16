# Running onos-gui

onos-gui can only be run in a Kubernetes cluster. Use the [Helm chart](./deployment.md) to load it.

## Browser access
When deployed, the onos-gui is available to a browser at the Cluster IP address. This may be found by running:
```bash
kubectl -n onos get services -l app.kubernetes.io/instance=onos-gui
```

## Dashboard View
![onos-gui-dashboard-view](images/onos-gui-dashboard-view.png)

The **Dashboard view** is the default, and shows all the devices and their network changes
in a tabular layout. Other views are available through the menu on the top left or
through hyperlinks (e.g. on the device).

When the **Config view dashboard** is loaded:

1. A grpc-web request is formed and sent as a POST to [http://10.152.183.121/onos-config/onos.config.diags.ChangeService/ListNetworkChanges](http://onos-gui:8181/onos-config/onos.config.diags.ChangeService/ListNetworkChanges)
1. This is forwarded by a `proxy_pass` declaration in `nginx.conf` to [http://localhost:8081](http://localhost:8081)
1. This is converted in to a gRPC request by Envoy Proxy server's grpc-web filter
1. and is forwarded to [https://onos-config:5150](https://onos-config:5150) as a gRPC request
1. onos-config sends back the response to envoy asynchronously as a gRPC response
1. Envoy's grpc-web service turns it in to a grpc-web response and sends it back to nginx
1. nginx sends the response back to the browser and the callback function is called
1. Inside the browser the callback updates the `networkChanges` object inside the ConfigDashboardComponent
1. the binding in the config-dashboard.component.html page is alerted to the updated value and refreshes the display
1. similar calls are made to load the `snapshots` and `devices`

The browser connects to onos-gui over HTTP 1.1 to retrieve the Angular compiled
static files.

## Device View
![onos-gui-device-view](images/onos-gui-device-view.png)

## Models View
![onos-gui-models-view](images/onos-gui-models-view.png)

## Developer mode
To run the GUI locally on a development machine

- install the prerequisites as described in [prerequisites.md](prerequisites.md)
- run ONIT in Kubernetes as above
- do not do the port forwarding above - instead forward the ports of the envoy proxy
in 2 separate terminals
```bash
kubectl -n micro-onos port-forward $(kubectl -n micro-onos get pods -l type=gui -o name) 8080:8080
kubectl -n micro-onos port-forward $(kubectl -n micro-onos get pods -l type=gui -o name) 8081:8081
```

- run the Angular CLI in `ng serve --configuration=kind` mode from the `web/onos-gui` folder
- browse to [http://localhost:4200](http://localhost:4200)
- ensure that the models page shows the 4 loaded model plugins (this
ensures that the gRPC requests are proxied correctly through the envoy proxy)


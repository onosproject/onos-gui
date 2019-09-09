# onos-gui

onos-gui can only be run in a Kubernetes cluster. The easiest set up route is to
deploy it using the ONOS Integration Test tool
**[onit](https://github.com/onosproject/onos-test)**.

See specific details in [setup.md](https://github.com/onosproject/onos-test/blob/master/docs/setup.md)

## Browser access
When deployed, the onos-gui is available to a browser at 
http://onos-gui (or with a specific port number if port-forwarding or an ingress
is involved).

> Using the hostname **onos-gui** is mandatory - an IP address will not suffice.
> This means that you may have to add an entry to your /etc/hosts file if the
> name is not configured on a DNS server
>
>On the demo cluster the GUI is available at http://onos-gui:31214 where the entry
> **10.128.100.91 onos-gui** is aded in the /etc/hosts file 

The browser connects to onos-gui over HTTP 1.1 to retrieve the Angular compiled
static files.

When the **List onos-config capabilities** button is pressed:
1) A grpc-web request is formed and sent as a POST to https://onos-gui/gnmi.gNMI/Capabilities
1) This is forwarded by a **proxy_pass** declaration in **nginx.conf** to http://onos-config-envoy:8080
1) This is converted in to a gRPC request by Envoy Proxy server's grpc-web filter
1) and is forwarded to https://onos-config:5150 as a gRPC request
1) onos-config sends back the response to envoy asynchronously as a gRPC response
1) Envoy's grpc-web service turns it in to a grpc-web response and sends it back to nginx
1) nginx sends the response back to the browser and the callback function is called
1) Inside the browser the callback updates the **capabilities** object inside the AppComponent
1) the binding in the app.component.html page is alerted to the updated value and refreshes the display

## Developer mode
To run the GUI locally on a development machine - run docker-compose as above,
and in addition:

1) Run the Angular CLI in 'serve' mode
First change directory to the web folder in onos-gui and test that Angular CLI is
set up correctly:
```bash
cd web/onos-gui
ng version
```

If Angular CLI does not show a version it may be necessary to set:
1) Install Node JS version 10 or greater on your system
2) Install Angular CLI globally on top of this
3) Install all the project dependencies in this current folder with **npm install**
> See [prerequisites.md](prerequisites.md) for details
4) Ensure onos-config-envoy and onos-config-topo are available as described in
**onit** setup.

When Angular CLI version command shows is it running properly, start the **serve**
mode with:
```bash
ng serve
```
and browse to [http://localhost:4200]



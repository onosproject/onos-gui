# onos-gui

> Note: this mechanism with docker-compose below is currently (Aug '19) broken as **onos-config** depends on
> **onos-topo** which in turn depends on **atomix**. The doc has not removed as
> it will hopefully be possible again soon. Instead the **onos-gui**
> will have to be deployed to a Kubernetes cluster and run from there. The k8s
> will need to expose the onos-gui port **80** through an **Ingress**.  


To run onos-gui 3 docker instances are needed
* onos-gui - contains the **nginx** proxy server and static html files and certs
* onos-config-envoy - contains the **envoy proxy for onos-config** for converting grpc-web (HTTP 1.1)
requests in to grpc requests (HTTP 2)
* onos-config - the configuration management system exposing gRPC interfaces -
admin, diags and gNMI

## Docker-compose
These 3 systems can be run together using **[docker-compose](https://docs.docker.com/compose/)**.
From the **onos-gui** base folder run it like:
```bash
docker-compose -f build/docker-compose-stable.yml up
```
> This depends on the stable version of each of the 3 VM, which may be pulled
> from **Docker Hub** with the usual **docker pull** command.
> Alternatively there is a **docker-compose-latest.yml** that runs the latest
> version of each from a local set of docker images.

This assigns IP addresses and hostnames to each of the 3 instance, so that onos-gui
can connect to http://onos-config-envoy:8080 and it can in turn connect over gRPC
to https://onos-config:5150 

Port 80 of the onos-gui is mapped to the host machine's port 80. To allow the web
interface to work fully in this mode the name **onos-gui** must be added to the
first line of /etc/hosts like:
```text
127.0.0.1       localhost   onos-gui
```
> If this is not added it will be possible to see the GUI being loaded, but it
> will not be able to access the backend services on **onos-config-envoy**. It
> will be possible to see 404 error in the network panel of the browser console
> for elements like http://localhost/proto.ConfigAdminService/GetNetworkChanges

## Browser access
When deployed the onos-gui is available to a browser at 
http://onos-gui

> Using the hostname **onos-gui** is mandatory - an IP address will not suffice.
> This means that you may have to add an entry to your /etc/hosts file if the
> name is not configured on a DNS server
>
>On the demo cluster the GUI is available at http://onos-gui:31214 where the entry
> **10.128.100.91 onos-gui** is present in the /etc/hosts file 

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

When Angular CLI version command shows is it running properly, start the **serve**
mode with:
```bash
ng serve
```
and browse to [http://localhost:4200]



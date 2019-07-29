# onos-gui

To run onos-gui 3 docker instances are needed
* onos-gui - contains the **nginx** proxy server and static html files and certs
* onos-gui-envoy - contains the **envoy proxy** for converting grpc-web (HTTP 1.1)
requests in to grpc requests (HTTP 2)
* onos-config - the configuration management system exposing gRPC interfaces -
admin, diags and gNMI

## Browser access
When deployed the onos-gui is available to a browser at 
https://onos-gui/index.html

> Adding **index.html** is mandatory. In future this will be accessible at
> https://onos-gui - currently it gives an error *"upstream connect error or
> disconnect/reset before headers. reset reason: remote reset"* for this URL

> Because onos-gui has a self signed certificate a security warning is given. It
> is possible to get past this by onporting the onf.cacrt in to your browsers list
> of trusted authorities - see https://www.accuweaver.com/2014/09/19/make-chrome-accept-a-self-signed-certificate-on-osx/

The browser connects to onos-gui over HTTPS 1.1 to retrieve the Angular compiled files.

When the **List onos-config capabilities** button is pressed:
1) A grpc-web request is formed and sent as a POST to https://onos-gui/gnmi.gNMI/Capabilities
1) This is forwarded by a **proxy_pass** declaration in **nginx.conf** to http://onos-gui-envoy:8080
1) This is converted in to a gRPC request by Envoy Proxy server's grpc-web filter
1) and is forwarded to https://onos-config:5150 as a gRPC request
1) onos-config sends back the response to envoy asynchronously as a gRPC response
1) Envoy's grpc-web service turns it in to a grpc-web response and sends it back to nginx
1) nginx sends the response back to the browser and the callback function is called
1) Inside the browser the callback updates the **capabilities** object inside the AppComponent
1) the binding in the app.component.html page is alerted to the updated value and refreshes the display

## Developer mode
To run the GUI locally on a development machine, follow the steps:
1) Run onos-config in a docker container (from the onos-config folder) with:
```bash
make run-docker
```

2) Run **onos-gui-envoy** in another docker container, but start it with a shell prompt
like (it may be necessary to build it first with **make onos-gui-envoy-docker**):
```bash
docker run -it -p 8080:8080 onosproject/onos-gui-envoy /bin/sh
```
Edit the hosts file to add the location of onos-config.
```bash
echo "<onos-config-ipaddr> onos-config" >> /etc/hosts
```
> To get the onos-config ipaddress when running in docker user the command
> "docker network inspect bridge"

Then run the envoy application:
```bash
/usr/local/bin/envoy -c /etc/envoy.yaml
```
This will now listen on port 8080
> When the GUI is run in **serve** mode its grpc-web target is set to point to
localhost:8080 for the onos-config-envoy proxy. See environment.ts

3) Run the Angular CLI in 'serve' mode
First change directory to the web folder in onos-gui and test that Angular CLI is
set up correctly:
```bash
cd web/onos-gui
ng version
```

If Angular CLI does not show a version it may be necessary to set:
1) Install Node JS version 10 or greater on your system
2) Install Angular CLI globall on top of this
3) Install all the project dependencies in this current folder with **npm install**

When Angular CLI version command shows is it running properly, start the **serve**
mode with:
```bash
ng serve
```
and browse to [http://localhost:4200]



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

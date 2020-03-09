#!/bin/bash -ex
/usr/local/bin/kubectl proxy &
/usr/sbin/nginx -g "daemon off;"

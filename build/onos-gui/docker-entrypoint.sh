#!/bin/sh
set -e

if [ "$1" = '/usr/local/bin/startup.sh' ]; then
	echo "Testing for NAMESPACE"
	if [ -z "NAMESPACE" ]; then
		echo "No NAMESPACE env found"
		exit 2
	fi
	envsubst < /usr/share/nginx/html/index.html > /usr/share/nginx/html/index.subst
	cp /usr/share/nginx/html/index.subst /usr/share/nginx/html/index.html
fi

exec "$@"

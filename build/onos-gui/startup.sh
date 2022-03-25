#!/bin/bash -ex

# SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
#
# SPDX-License-Identifier: Apache-2.0

/usr/local/bin/kubectl proxy &
/usr/sbin/nginx -g "daemon off;"

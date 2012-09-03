#!/bin/bash

## Script to setup the AWS VM image. Run it with the IP of the master AWS 
## VM instance as the argument

if [ -z "$1" ]; then
    echo "Usage: $0 master-server-ip"
    exit 1
fi

CWD=$(dirname $(readlink -f $0))


## Setup pictobin without DB
$CWD/../setup_env.sh --no-db || exit 1

## Update DB server's IP in production.ini to point to master IP
MASTER_IP="$1"
cp production.template.ini production.ini
sed -i -e "s/pb_dbuser:pictobin@.*:5432/pb_dbuser:pictobin@$MASTER_IP:5432/" $CWD/../production.ini || exit 1
sed -i -e "s/brh_dbuser:blackrockhologram@.*:5433/brh_dbuser:blackrockhologram@$MASTER_IP:5432/" $CWD/../production.ini || exit 1


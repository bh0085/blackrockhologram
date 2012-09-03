#!/bin/bash

## Script to setup the AWS VM image. Run it with the IP of the master AWS 
## VM instance as the argument

if [ -z "$1" ]; then
    echo "Usage: $0 master-server-ip"
    exit 1
fi

CWD=$(dirname $(readlink -f $0))
DIR=$(dirname $0)
cd $DIR

virtualenv --no-site-packages --clear venv || exit 1
rm -f distribute-*.tar.gz

venv/bin/easy_install pyramid || exit 1
venv/bin/easy_install paste || exit 1
venv/bin/easy_install uwsgi || exit 1
venv/bin/easy_install psycopg2 || exit 1

venv/bin/python setup.py develop || exit 1

## Update DB server's IP in production.ini to point to master IP
MASTER_IP="$1"
cp production.ini.template production.ini
sed -i -e "s/pb_dbuser:pictobin@.*:5432/pb_dbuser:pictobin@$MASTER_IP:5432/" $CWD/../production.ini || exit 1
sed -i -e "s/brh_dbuser:blackrockhologram@.*:5433/brh_dbuser:blackrockhologram@$MASTER_IP:5432/" $CWD/../production.ini || exit 1


#!/bin/bash

# kill running uwsgi
#while `ps axo pid,command,args | grep bin/uwsgi | grep $HOME/pb | grep -v grep >&/dev/null`; do
#    killall -QUIT uwsgi
#    ps axo pid,command,args | grep img_converter.py | grep -v grep | awk '{print $1}' | xargs kill -TERM 
#done

# don't exit when parent shell exits
trap "" HUP 

cd $(dirname $0)
PBDIR=$(pwd)
echo PBDIR: $PBDIR


mkdir -p ${PBDIR}/venv/data

PROTOCOL=http
RELEASE=development
if [ X"$1" == X"--nginx" ]; then
    PROTOCOL=wsgi
    RELEASE=production
fi

venv/bin/uwsgi -b 64000                                 \
               -p 24                                    \
               -T                                       \
               -H $PBDIR/venv/                          \
               --protocol=${PROTOCOL}                   \
               --paste config:$PBDIR/${RELEASE}.ini     \
               --socket :6544                           \
               --logto $PBDIR/venv/data/uwsgi.log       \
               -M 2>&1 | tee run_uwsgi.out

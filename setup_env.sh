#!/bin/bash

# Run this script after cloning the pb.git repo
#     git clone git@github:bh0005/pb.git
#     pb.git/setup_env.sh

PBDIR=$(dirname $0)
cd $PBDIR

virtualenv --no-site-packages --clear venv || exit 1
rm -f distribute-*.tar.gz

venv/bin/easy_install pyramid || exit 1
venv/bin/easy_install paste || exit 1
venv/bin/easy_install uwsgi || exit 1

venv/bin/python setup.py develop || exit 1
venv/bin/initialize_brh_db development.ini || exit 1

echo "[!]"
echo "[!] To run pb server: $PBDIR/venv/bin/pserve $PBDIR/development.ini"
echo "[!]"


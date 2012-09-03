#!/bin/bash -x

# Before running this script, make sure that:
# - postgres binaries are in the PATH (typically /usr/lib/postgres/VER/bin)
# - /var/run/postgres is writable by this user

PBDIR=$(dirname $0)
cd $PBDIR

## Add postgres to paths
for d in /usr/lib/postgresql/*/bin/; do
    export PATH=$PATH:$d
done

if ! `which postgres >& /dev/null`; then
    echo "[!] ERROR: is postgres installed? (could not find postgres in PATH)" >&2
    exit 1
fi

DBDIR=postgres_db
DB=brh_database
DBUSER=brh_dbuser
DBPASS=blackrockhologram
PORT=5433

mkdir -p $DBDIR

pg_ctl -m fast -w stop -D $DBDIR

## Create database dir
rm -rf $DBDIR
initdb $DBDIR || exit 1

## Allow connection from remote hosts
echo -e "\nhost all all 0.0.0.0/0 md5\n" >> $DBDIR/pg_hba.conf

echo -e "\nport=$PORT\n" >> $DBDIR/postgresql.conf

## Start DB to listen on all interfaces
pg_ctl -o "-h \*" -w start -D $DBDIR || exit 1

## Create and set user password. Create db
createuser -h localhost -p $PORT -s $DBUSER || exit 1
createdb -h localhost -p $PORT -U $DBUSER $DB || exit 1
(echo "ALTER USER $DBUSER with password '"$DBPASS"';" | psql -h localhost -p $PORT $DB) || exit 1

if [ X"$1" == X"--init" ]; then
    venv/bin/initialize_brh_db production.ini
fi


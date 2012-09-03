brh README
==================

Getting Started
---------------

- cd <directory containing this file>

- $venv/bin/python setup.py develop

- $venv/bin/populate_brh development.ini

- $venv/bin/pserve development.ini


===========

Cloning development.ini from the template included
---
cp development.ini.template development.ini


===========

Random necessary scraps of configuration.

Right now, the only configuration that needs to be done beyond venv/bin/initialize_brh_db is setting the server address for pictobin.

# This must be done in two places #
1. development/production.ini:
   postgres://pb_dbuser:pictobin@localhost:5432/pb_database
   should be changed to an appropriate value for your config
   you may also use the remote pictobin at pictobin.com

2. brh/utils/pictobin_helpers.py
   set the pictobin_url to point to the same instance of pictobin as above.

   this url is where rest calls will be sent... the database access to pictobin 
   above (via postgres) should only be read only. Use the rest API to make
   any necessary changes.

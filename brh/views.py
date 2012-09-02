from pyramid.response import Response
from pyramid.renderers import render_to_response
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPFound, HTTPForbidden

import transaction
import urllib2, json

from .models import (
    NoSuchGroupError,
    Group, 
    PBSession, BRHSession,
    PBEBin, PBEBinMeta
    )

from .utils import pictobin_helpers as ph

default_cache = 0;
@view_config(route_name='home', renderer='home/home.mako', http_cache=default_cache)
def my_view(request):
    return {}

@view_config(route_name='handle_pass', renderer = 'json',http_cache=default_cache)
def handle_pass(request):
    p = request.params['passphrase']
    existing_group = BRHSession.query(Group)\
        .filter(Group.passphrase == p)\
        .first()
    if not existing_group:
        with transaction.manager:
            g = Group(passphrase = p)
            BRHSession.add(g)

    return {"link":"/groups/{0}".format(p)}

@view_config(route_name='group_main', renderer ='group_main.mako', http_cache=default_cache)
def group_main(request):
    c = {}
    c['group'] = request.group.toJSON()

    first = PBSession.query(PBEBinMeta)\
        .filter(PBEBinMeta.source == "namespace_factory")\
        .filter(PBEBinMeta.key == "NSbrh")\
        .filter(PBEBinMeta.value== request.group.passphrase)\
        .first()

    if not first:
        import urllib2
        req = urllib2.Request("{0}/bins/{1}/{2}"\
                                  .format(ph.pictobin_url,
                                          "brh",
                                          request.group.passphrase),
                              None)
        opener = urllib2.build_opener()
        f = json.load(opener.open(req))
        return HTTPFound(request.url)
    else:
        c['ebin'] = PBSession.query(PBEBin).get(first.ebin_id).toJSON(request = request, recurse = True)
    
    print "RETURNING ", c
    return {'sessionInfo':c}



@view_config(context=NoSuchGroupError)
def nosuchgroup(request):
    return render_to_response('errors/nosuchgroup.mako',
                              {})

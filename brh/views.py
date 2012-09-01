from pyramid.response import Response
from pyramid.renderers import render_to_response
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPFound, HTTPForbidden

import transaction

from .models import (
    NoSuchGroupError,
    Group, 
    PBSession, BRHSession,
    PBEBin, PBEBinMeta
    )

@view_config(route_name='home', renderer='home/home.mako')
def my_view(request):
    return {}

@view_config(route_name='handle_pass', renderer = 'json')
def handle_pass(request):
    p = request.params['passphrase']
    existing_group = BRHSession.query(Group)\
        .filter(Group.passphrase == p)\
        .first()
    if not existing_group:
        with transaction.manager:
            g = Group(passphrase = p)
            BRHSession.add(g)

    return HTTPFound("/groups/{0}".format(p))

@view_config(route_name='group_main', renderer ='group_main.mako')
def group_main(request):
    c = {}
    c['group'] = request.group.toJSON()
    return c



@view_config(context=NoSuchGroupError)
def nosuchgroup(request):
    return render_to_response('errors/nosuchgroup.mako',
                              {})

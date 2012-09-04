from pyramid.response import Response
from pyramid.renderers import render_to_response
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPFound, HTTPForbidden

import transaction
import urllib2, json

from .models import (
    NoSuchGroupError,
    Group, User,
    PBSession, BRHSession,
    PBEBin, PBEBinMeta
    )

from .utils import pictobin_helpers as ph, account_helpers as ah

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


@view_config(route_name='handle_email', renderer = 'json',http_cache=default_cache)
def handle_email(request):
    em = request.params['email']
    existing_user = BRHSession.query(User)\
        .filter(User.email == em)\
        .first()
    if not existing_user:
        with transaction.manager:
            u = User(email = em,
                     group = request.group)
        
            BRHSession.add(u)
            
        existing_user = BRHSession.query(User)\
            .filter(User.email == em)\
            .first()
    
    ah.mailConfirmation(existing_user,request)
    return {"user":existing_user.toJSON()}


@view_config(route_name='handle_place', renderer = 'json',http_cache=default_cache)
def handle_place(request):
    picids = request.params[pb_picids]
    group= request.group;
    
    picturesJSON=[]
    placeJSON

    place = BRHSession.query(Place.filter_by)

    for e in picids:
        existing_picture = Picture.filter(Picture.groupid == group.id)\
            .filter(Picture.pb_id == e)\
            .first()
        
        if not existing_picture:
            with transaction.manager:
                p = Picture(group = group,
                            pb_id = e)
                
                BRHSession.add(p)
                
            existing_picture = BRHSession.query(User)\
                .filter(User.email == em)\
                .first()
                             
    raise Exception()
    
        
    return {"place":placeJSON,
            "place_pictures":ppJSON}

@view_config(route_name='group_main', renderer ='group_main.mako', http_cache=default_cache)
def group_main(request):
    return {'sessionInfo':establish_context(request),
            'view':'main'}


@view_config(route_name="group_molehill", renderer="group_main.mako",http_cache=default_cache)
def group_molehill(request):
    return {'sessionInfo':establish_context(request),
            'view':'molehill'}


@view_config(route_name="group_annotationkit", renderer="group_main.mako",http_cache=default_cache)
def group_annotationkit(request):
    return {'sessionInfo':establish_context(request),
            'view':'annotation'}


@view_config(route_name="group_notifyme", renderer="group_main.mako",http_cache=default_cache)
def group_notifyme(request):
    return {'sessionInfo':establish_context(request),
            'view':'notifyme'}


def establish_context(request):
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
        raise HTTPFound(request.url)
    else:
        c['ebin'] = PBSession.query(PBEBin).get(first.ebin_id).toJSON(request = request, recurse = True)

    return c



@view_config(context=NoSuchGroupError)
def nosuchgroup(request):
    return render_to_response('errors/nosuchgroup.mako',
                              {})



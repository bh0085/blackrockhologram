from pyramid.config import Configurator
from sqlalchemy import engine_from_config

from .models import PBSession, BRHSession, GroupResourceFactory

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    pb_engine = engine_from_config(settings, 'pb_sqlalchemy.')
    brh_engine = engine_from_config(settings, 'brh_sqlalchemy.')

    PBSession.configure(bind=pb_engine)
    BRHSession.configure(bind=brh_engine)

    config = Configurator(settings=settings)
    config.add_route('home', '/')

    config.add_route('faq','/faq')
    config.add_route('faq_changedramatically','/faq/changedramatically')
    config.add_route('faq_building','/faq/building')
    config.add_route('faq_missingdata','/faq/missingdata')
    
    config.add_route('handle_pass','/handlepass')

    config.add_route('handle_email','/handleemail/{passphrase}',
                     factory = GroupResourceFactory)
    config.add_route("handle_place", "/handleplace/{passphrase}",
                     factory=GroupResourceFactory)
    config.add_route("group_main", '/groups/{passphrase}',
                     factory = GroupResourceFactory)
    config.add_route('group_about','/groups/{passphrase}/about',
                     factory = GroupResourceFactory)



    config.add_route("group_molehill","/groups/{passphrase}/molehill",
                     factory=GroupResourceFactory)
    config.add_route("group_annotationkit","/groups/{passphrase}/annotationkit",
                     factory=GroupResourceFactory)
    config.add_route("group_notifyme","/groups/{passphrase}/notifyme",
                     factory=GroupResourceFactory)


    
    #static routing
    config.add_static_view('/js/', 'public/js', cache_max_age=3600)
    config.add_static_view('/css/', 'public/css', cache_max_age=3600)
    config.add_static_view('/img/', 'public/img', cache_max_age=3600)

    config.scan()
    return config.make_wsgi_app()


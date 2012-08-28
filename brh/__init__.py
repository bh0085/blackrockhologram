from pyramid.config import Configurator
from sqlalchemy import engine_from_config

from .models import DBSession

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    config = Configurator(settings=settings)
    config.add_route('home', '/')

    #static routing
    config.add_static_view('/js/', 'public/js', cache_max_age=3600)
    config.add_static_view('/css/', 'public/css', cache_max_age=3600)
    config.add_static_view('/img/', 'public/img', cache_max_age=3600)

    config.scan()
    return config.make_wsgi_app()


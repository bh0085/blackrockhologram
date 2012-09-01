from sqlalchemy import Column, Integer, String, Unicode, DateTime, ForeignKey, Boolean, UniqueConstraint, Float
from sqlalchemy.ext.declarative import declarative_base

from sqlalchemy.orm import relation

from sqlalchemy.orm import (
    scoped_session,
    sessionmaker,
    )

from zope.sqlalchemy import ZopeTransactionExtension

PBSession = scoped_session(sessionmaker(extension=ZopeTransactionExtension()))
BRHSession = scoped_session(sessionmaker(extension=ZopeTransactionExtension()))
from .model.base import Base_PB, Base_BRH

#minimal ORM classes to map from the pictobin database.
#we don't do any writing from BRH
class PBEBin(Base_PB):
    __tablename__ = 'ebin'
    id = Column(Integer, nullable = False, primary_key = True)
    key = Column(Unicode, nullable = False)

class PBEBinMeta(Base_PB):
    __tablename__ = 'ebinmeta'
    ebin_id = Column(Integer, ForeignKey('ebin.id'),  primary_key = True)
    key = Column(Unicode, nullable = False, primary_key = True)
    value = Column(Unicode, nullable = False)
    source = Column(Unicode, nullable = True, index = True)

class PBPicture(Base_PB):
    __tablename__ = 'picture'
    id = Column(Integer, primary_key = True)
    date_taken = Column(DateTime, nullable=True)
    gallery_id = Column(Integer, ForeignKey('ebin.id'), index = True)

PBEBinMeta.ebin = relation(PBEBin, backref = 'meta')
PBPicture.ebin = relation(PBEBin, backref = 'pictures')

#BRH Classes
# maps 1:1 to PBEBin
class Group(Base_BRH):
    __tablename__ = 'group'
    id = Column(Integer, primary_key = True)
    pb_id = Column(Integer, nullable = True, index = True)
    passphrase = Column(Unicode, nullable = False, unique = True)
    

# maps 1:1 to PBPicture
class Picture(Base_BRH):
    __tablename__ = 'picture'
    id = Column(Integer, primary_key = True)
    pb_id = Column(Integer, nullable = False, index = True)

class Place(Base_BRH):
    __tablename__ = 'place'
    id = Column(Integer, primary_key = True)
    group = Column(Integer, ForeignKey('group.id'), index = True, nullable = False)
    name = Column(Unicode, nullable = False, index = True)
    
class PlaceCoordinate(Base_BRH):
    __tablename__ = 'placecoordinate'
    coordid = Column(Integer, ForeignKey('coordinate.id'), primary_key = True)
    placeid = Column(Integer, ForeignKey('place.id'), primary_key = True)

class PictureCoordinate(Base_BRH):
    __tablename__ = 'picturecoordinate'
    coordid = Column(Integer, ForeignKey('coordinate.id'), primary_key = True)
    pictureid = Column(Integer, ForeignKey('picture.id'),  primary_key = True)
    
class Coordinate(Base_BRH):
    __tablename__ = 'coordinate'
    id = Column(Integer, primary_key = True)
    map_x = Column(Float, index = True, nullable = False)
    map_y = Column(Float, index = True, nullable = False)
    
    


from pyramid.security import (
    ALL_PERMISSIONS,
    Everyone,
    Authenticated,
    Allow,
    )

class Res(object):
    __acl__ = [
        (Allow, Everyone, 'view'),
        (Allow, Authenticated, ALL_PERMISSIONS)
    ]
    def __init__(self, request):
        self.request = request


class NoSuchGroupError(Exception):
    def __init__(self, msg):
        self.msg = msg

class GroupResourceFactory(Res):
    def __init__(self,request):
        self.request = request
        passphrase = request.matchdict['passphrase']
        group = BRHSession.query(Group)\
            .filter(Group.passphrase == passphrase)\
            .first()
        
        if not group:
            raise NoSuchGroupError("Group {0} does not exist!".format(group_key))
        
        request.group_id = group.id
        request.group = group
        

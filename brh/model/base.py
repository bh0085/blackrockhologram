#Database Model
from sqlalchemy import MetaData
metadata_brh = MetaData()
metadata_pb = MetaData()
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Unicode, DateTime, ForeignKey, Boolean, UniqueConstraint
from sqlalchemy.orm.collections import InstrumentedList
from sqlalchemy.orm.attributes import InstrumentedAttribute

Base_BRH = declarative_base(metadata = metadata_brh)
Base_PB = declarative_base(metadata = metadata_pb)

column_type_mappers = {
    Integer:lambda x:x,
    Unicode:lambda x:x,
    DateTime:lambda x:str(x),
    Boolean:lambda x:x,
    String:lambda x:x
    }

#optionally recursive json serializer
def toJSON(self, recurse=False, request = None, weight = 0, **kwargs):
    skip = self.skippedProperties(request)
    if 'skip' in kwargs:
        skip = skip + kwargs['skip']
    
    #for all automatically generated fields, if they are in "skip", we don't
    #add them to the json.
    out = dict([(k,column_type_mappers[self.__table__.columns[k].type.__class__]\
                      (self.__getattribute__(k)))
                for k in self.__table__.columns.keys() if not k in skip])

    if 'syncedJSON' in dir(self):
        out.update(self.syncedJSON(request,weight = weight))

    out['synced'] = out.keys()
    if recurse:  #and 'json_joins' in self.__dict__:
        loaded_attrs=dict([(k,self.__getattribute__(k)) 
                           for k in type(self).__dict__ 
                           if type(type(self).__dict__[k]) == InstrumentedAttribute 
                           and 'impl' in type(self).__dict__[k].__dict__])
        for k in loaded_attrs:
            #skip properties as noted
            if k in skip: continue
            if issubclass(type(loaded_attrs[k]),Base):
                out[k] = loaded_attrs[k].toJSON(request = request,recurse=False)
            elif(type(loaded_attrs[k]) == InstrumentedList):
                l = loaded_attrs[k]
                if len(l)>0 and issubclass(type(l[0]),Base):
                    out[k] =[e.toJSON(request = request, recurse=False) for e in l]
    if 'unsyncedJSON' in dir(self):
        out.update(self.unsyncedJSON(request, weight = weight))

    return out

def needsSync(self,request, field, value):
    current = self.getProperty(request,field)
    return current != value


def skippedProperties(self, request):
    return []

def getProperty(self,request,field):
    if hasattr(self,field):
        return self.__getattribute__(field)
    else: raise Exception("unimplemented")

def setProperty(self,request,field,value):            
    if hasattr(self,field):
        self.__setattr__(field, value)
    else: raise Exception("unimplemented")

def __init__(self, request = None, **kwargs):
    for k,v in kwargs.iteritems():
        self.setProperty(request,k,v)    


for Base in [Base_BRH, Base_PB]:
    Base.__init__ = __init__
    Base.toJSON = toJSON
    Base.needsSync = needsSync
    Base.getProperty = getProperty
    Base.setProperty = setProperty
    Base.skippedProperties = skippedProperties

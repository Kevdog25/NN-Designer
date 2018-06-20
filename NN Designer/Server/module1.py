import cherrypy
import os
import numpy as np
import time
import json
from queue import Queue
from threading import Thread
from TFFactory import TFFactory
from RequestHandler import RequestHandler

rq = RequestHandler()

class Home(object):

    def __init__(self, **kwargs):
        return super().__init__(**kwargs)

    @cherrypy.expose
    def index(self):
        return open(os.path.join(os.path.abspath('.'),'Resources/HTML/Home.html'))

    @cherrypy.expose
    def compileModel(self, graph):
        global rq
        graph = json.loads(graph)
        rq.compileGraph(graph)
        return json.dumps({'status' : True})
        

    @cherrypy.expose
    def saveModel(self, modelName):
        global rq
        return

    @cherrypy.expose
    def runBatch(self):
        global rq
        if rq.IsWorking:
            return None
        return json.dumps({'value': rq.dummyWork()})

    @cherrypy.expose
    def evalNode(self, id):
        global rq
        if rq.IsWorking:
            return None
        return json.dumps({'value' : rq.evalNode(id).tolist()})
    

    @cherrypy.expose
    def testJSON(self, obj):
        obj = json.loads(obj)
        
        return json.dumps({'resp' : str(obj)})

if __name__=='__main__':
    conf = {
        '/': {
            'tools.sessions.on': True,
            'tools.staticdir.root': os.path.abspath(os.getcwd())
        },
        '/html': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': 'Resources/HTML'
        },
        '/js': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': 'Resources/Scripts'
        },
        '/css': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': 'Resources/CSS'
        }
    }
    cherrypy.quickstart(Home(), '/', conf)

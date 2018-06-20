import tensorflow as tf
from TFFactory import TFFactory, Node
import time
import numpy as np

class RequestHandler(object):
    def __init__(self, **kwargs):
        self.IsWorking = False
        self.Factory = TFFactory()
        self.CurrentGraph = {}
        self.CurrentSession = None
        self.Counter = 0
        return super().__init__(**kwargs)

    @staticmethod
    def __translateGraph(graph):
        #Idk, maybe I don't need to do much.
        return graph

    def saveModel(self, name):
        return

    def compileGraph(self, graph):
        self.IsWorking = True
        self.__translateGraph(graph)

        self.CurrentGraph = self.Factory.CreateTFGraph(graph)

        if self.CurrentSession is not None and not self.CurrentSession._closed:
            self.CurrentSession.close()
        self.CurrentSession = tf.Session()
        tf.global_variables_initializer().run(session = self.CurrentSession)
        self.IsWorking = False
        return

    def evalNode(self, id):
        if id not in self.CurrentGraph:
            raise AssertionError('Node \'{}\' is not compiled into the current graph'.format(id))
        self.IsWorking = True
        Node.EvalContext = time.time()
        val = self.CurrentGraph[id].eval(session = self.CurrentSession)
        self.IsWorking = False
        return val

    def dummyWork(self):
        self.IsWorking = True
        time.sleep(1)
        self.Counter += 1
        self.IsWorking = False
        return self.Counter

    def __str__(self):
        return str(vars(self))
    
    




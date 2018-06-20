from RequestHandler import RequestHandler
import tensorflow as tf
import json

handler = RequestHandler()


testJSON = \
'''
{ 
    "1": { 
        "type": "variable",
        "init": [1]
    },
    "2": {
        "type": "variable",
        "init": [2]
    },
    "3": {
        "type": "tfop",
        "op": "add",
        "params": [1, 2]
    }
}
'''
print('Testing graph: ')
graph = json.loads(testJSON)
print(graph)


for k in graph:
    print('Key: {}'.format(k))
print('Node results: ')
handler.compileGraph(graph)
print()


for k in graph:
    print('Evaluating {}: {}'.format(k, handler.evalNode(k)))

print('JSON:')
for k in graph:
    print('Evaluating {}: {}'.format(k, json.dumps({'value' : handler.evalNode(k).tolist()})))


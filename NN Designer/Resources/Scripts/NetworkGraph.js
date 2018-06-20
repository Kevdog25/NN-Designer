var NetworkGraph = function (element, addNode, addEdge) {
    var network;
    var nextID = 1;
    var nodes = {}

    var opperations = {
        fileSource: {
            expr: 'readRows(FilePath, NRows)',
            shape: 'database',
            label: '',
            inputs: {
                FilePath: {
                    value: '',
                    type: 'string'
                },
                NRows: {
                    value: 0,
                    type: 'int'
                }
            }
        },
        variable: {
            expr: '<value>',
            shape: 'circle',
            label: '',
            inputs: {
                Init: {
                    value: [],
                    type: 'array'
                }
            }
        },
        multiply: {
            expr: 'A * B',
            shape: 'triangle',
            label: 'x',
            inputs: {
                A: {
                    value: '',
                    type: 'ref',
                },
                B: {
                    value: '',
                    type: 'ref',
                }
            }
        },
        add: {
            expr: 'A + B',
            shape: 'triangle',
            label: '+',
            inputs: {
                A: {
                    value: '',
                    type: 'ref',
                },
                B: {
                    value: '',
                    type: 'ref',
                }
            }
        },
        subtract: {
            expr: 'A - B',
            shape: 'triangle',
            label: '-',
            inputs: {
                A: {
                    value: '',
                    type: 'ref',
                },
                B: {
                    value: '',
                    type: 'ref',
                }
            }
        }
    }

    var graphData = {
        nodes: new vis.DataSet([]),
        edges: new vis.DataSet([])
    };

    network = new vis.Network(element, graphData, {
        manipulation: {
            enabled: true,
            initiallyActive: true,
            addNode: false
        }
    });

    return {
        setOptions: function (options) {
            alert('Setting options')
        },

        addNode: function (nodeType) {
            var template = opperations[nodeType];

            var node = {
                id: nextID,
                name: 'Unnamed' + nextID,
                expr: template.expr,
                shape: template.shape,
                type: nodeType,
                inputs: JSON.parse(JSON.stringify(template.inputs))
            };
            graphData.nodes.update([node]);
            nodes[node.id] = node;
            nextID = nextID + 1;
        },

        on: function (key, callback) {
            var cb = callback;
            if (key == 'selectNode' || key == 'deselectNode' || key == 'hold' || key == 'dragEnd') {
                cb = function (params) {
                    callback(nodes[params.nodes[0]])
                }
            }
            network.on(key, cb);
        },

        toJSON: function () {
            var obj = {}
            for (var key in nodes) {
                obj[key] = {}
                obj[key].type = nodes[key].type
                obj[key].inputs = nodes[key].inputs
            }
            return JSON.stringify(obj)
        },

        getNodeByName: function (name) {
            for (var id in nodes) {
                if (nodes[id].name == name) {
                    return nodes[id]
                }
            }
            return null
        },

        getNodeByID: function (id) {
            return nodes[id] //graphData.nodes.get(id)
        }
    };
}
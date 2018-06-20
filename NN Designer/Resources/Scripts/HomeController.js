if (typeof (K) == 'undefined') {
    var K = {};
}

var HomeController = function () {
    var chart = null;
    var network = new NetworkGraph(document.getElementById('middleBits'));
    var editPane = document.getElementById('div:Inputs');
    var currentlySelected = null;

    // Chart Things
    {
        var initChart = function () {
            var ctx = document.getElementById("canvas");
            var config = {
                type: 'line',
                data: {
                    labels: [0],
                    datasets: [{
                        label: 'Loss',
                        data: [{
                            x: 0,
                            y: 10
                        }],
                        backgroundColor: 'rgba(255, 99, 132, 0)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'X'
                            },
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: 10
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Y'
                            }
                        }]
                    }
                }
            };

            _chart = new Chart(ctx, config);
        };

        var addData = function (obj) {
            var obj = JSON.parse(obj)
            var line = _chart.data.datasets[0].data
            var x = line[line.length - 1].x + 1
            _chart.data.datasets[0].data.push({
                x: x,
                y: obj.value
            })
            _chart.data.labels.push(x)
            _chart.update()
        };
    }
    initChart();

    // Toolbar buttons
    {
        // Graph components
        document.getElementById("btn:AddFileSource").onclick = function (ev) {
            network.addNode('fileSource');
        };
        document.getElementById("btn:AddVariable").onclick = function (ev) {
            network.addNode('variable');
        };

        // Operations
        document.getElementById("btn:Multiply").onclick = function (ev) {
            network.addNode('multiply');
        };
        document.getElementById("btn:Add").onclick = function (ev) {
            network.addNode('add');
        };
        document.getElementById("btn:Subtract").onclick = function (ev) {
            network.addNode('subtract');
        };
    }

    // Managing the Edit Window
    {
        var validateData = function (value, dataType) {
            if (dataType == 'ref') {
                if (network.getNodeByName(value) === null) {
                    return false
                }
            } else if (dataType == 'array') {
                try {
                    JSON.parse(value);
                } catch (error) {
                    return false
                }
            }
            return true
        }
        var clearPane = function () {
            var children = editPane.childNodes;
            for (var i = children.length - 1; i >= 0; i--) {
                children[i].remove()
            }
        }
        var populateEditPane = function (node) {
            if (node === undefined) {
                return
            }
            var nameInput = document.getElementById('inp:NameInput');
            nameInput.value = node.name;
            nameInput.onchange = function (ev) {
                node.name = nameInput.value;
            }

            if (node.expr != '') {
                document.getElementById('div:Expression').hidden = false;
                document.getElementById('spn:Expression').innerText = node.expr;
            } else {
                document.getElementById('div:Expression').hidden = true;
            }
            
            for (var param in node.inputs) {
                var input = document.createElement('input');
                var label = document.createElement('label');

                input.id = node.id + '|' + param
                input.value = node.inputs[param].value
                if (node.inputs[param].type == 'int' || node.inputs[param].type == 'float') {
                    input.type = 'number';
                } else {
                    input.type = 'text';
                }

                label.for = input.id;
                label.textContent = param + ': ';

                // What am I doing with my life...
                (function () {
                    var that = input;
                    var tempParam = param;
                    that.onchange = function () {
                        if (validateData(that.value, node.inputs[tempParam].type)) {
                            node.inputs[tempParam].value = that.value;
                        } else {
                            alert('Invalid: ' + that.value)
                        }
                    };
                })();

                editPane.appendChild(label);
                editPane.appendChild(input);
            }
        };
        var onSelect = function (node) {
            currentlySelected = node;
            clearPane();
            populateEditPane(node);
        };
    }
    network.on('selectNode', onSelect);
    network.on('dragEnd', onSelect)

    // Evaluation Pane
    {

        document.getElementById("btn:AddData").onclick = function (ev) {
            $.post('/runBatch', '', addData);
        };
        document.getElementById("btn:CompileGraph").onclick = function (ev) {
            $.post('/compileModel', { graph: network.toJSON() }, function (obj) {
                var resp = JSON.parse(obj)
                if (!resp.status) {
                    document.getElementById("spn:CompileStatus").innerText = resp.error
                }
                else {
                    document.getElementById("spn:CompileStatus").innerText = 'Compiled!'
                }
            });
        };
        document.getElementById("btn:EvalNode").onclick = function () {
            if (currentlySelected !== null) {
                $.post('/evalNode', { id: currentlySelected.id }, function (obj) {
                    var resp = JSON.parse(obj)
                    document.getElementById("spn:EvalResult").innerText = resp.value;
                })
            }
        };
    }
}

window.addEventListener('load', function () { K.HomeController = new HomeController() })

// Node Template
/*
{
    type: 'Input'
}
*/
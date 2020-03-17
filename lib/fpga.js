'use strict';

var lut4 = require('./lut')();
var lut4cache = require('./lut4cache')();
var toString2_16 = require('./to-string2_16');
var lut4count = {};
var blackboxes = {};

function lutSimplify (data, connections) {
    var mask0 = [
        0x5555,
        0x3333,
        0x0f0f,
        0x00ff
    ];
    var shift = [
        1,
        2,
        4,
        8
    ];

    'I0 I1 I2 I3'.split(' ').forEach(function (inp, idx) {
        if (connections[inp][0] === '0') {
            // console.log(toString2_16(data), idx);
            data = (data & mask0[idx]) |
                ((data & mask0[idx]) << shift[idx]);
            // console.log(toString2_16(data));
        }
    });
    return data;
}

function runningSum (sum, e, idx, arr) {
    sum += e;
    arr[idx] = sum;
    return sum;
}

function fpga (params) {
    var modules = params.body.modules;
    var moduleNames = Object.keys(modules);
    var cells = modules[moduleNames[0]].cells;

    var res = ['g', {},
        ['style', { type: 'text/css' },
            '<![CDATA[' +
            ' .gate { fill: #ffb; stroke: #000; stroke-linecap: round }' +
            ' .gate:hover { stroke: #00f; stroke-width: 3px }' +
            ' .bbox { fill: #bbb; stroke: #000 }' +
            ' .bbox:hover { stroke: #00f; stroke-width: 3px }' +
            ' text { font-family: "monospace" }' +
            ']]>'
        ]
    ];

    var colV = Array.apply(null, Array(34)).map(function () { return 1; });
    var rowV = Array.apply(null, Array(34)).map(function () { return 1; });

    Object.keys(cells).forEach(function (key) {
        var cell = cells[key];
        var loc1 = cell.attributes.loc.split(',');
        var col = parseInt(loc1[0], 10);
        var loc2 = loc1[1].split('/');
        var row = parseInt(loc2[0]);
        // var lc = parseInt(loc2[1]);
        colV[col] = 4;
        rowV[row] = 16;
    });

    colV.reduce(runningSum, 0);
    rowV.reduce(runningSum, 0);

    colV.forEach(function (col, x) {
        rowV.forEach(function (row, y) {
            res.push(['rect', {
                x: 16 * col,
                y: 16 * row,
                width: 16,
                height: 16,
                stroke: 'none',
                opacity: 0.2,
                fill: ((x + y) & 1) ? '#fff' : '#000'
            }, ['title', {}, ((x + 1) + ',' + (y + 1))]]);
        });
    });

    var drivers = {};

    Object.keys(cells).forEach(function (key) {
        var cell = cells[key];
        var loc1 = cell.attributes.loc.split(',');
        var col = parseInt(loc1[0], 10);
        var loc2 = loc1[1].split('/');
        var row = parseInt(loc2[0]);
        var lc = parseInt(loc2[1]);
        var connections;
        var connectionNames;

        if (cell.connections) {
            connections = cell.connections;
            connectionNames = Object.keys(connections);
            '^O-48-16 ^COUT-4-32 ^D_IN_0-48-16 ^D_IN_1-48-24 ^RDATA-48-16 ^GLOBAL_BUFFER_OUTPUT-48-16'
                .split(' ')
                .map(function (e) {
                    var arr = e.split('-');
                    return { name: arr[0], x: parseInt(arr[1], 10), y: parseInt(arr[2], 10) };
                })
                .forEach(function (pin) {
                    var driver;
                    var x, y;
                    connectionNames.forEach(function (name) {
                        if (
                            name.match(pin.name) &&
                            connections[name].length
                        ) {
                            x = 16 * (colV[col] - 4) + pin.x;
                            y = 16 * (rowV[row] - 16) + 32 * lc + pin.y;
                            driver = connections[name][0];
                            drivers[driver] = { x: x, y: y };
                        }
                    });
                });
        }
    });

    // console.log(drivers);

    Object.keys(cells).forEach(function (key) {
        var cell = cells[key];
        var loc1 = cell.attributes.loc.split(',');
        var col = parseInt(loc1[0], 10);
        var loc2 = loc1[1].split('/');
        var row = parseInt(loc2[0]);
        var lc = parseInt(loc2[1]);
        var connections;
        var connectionNames;

        var wireGroup = ['g', {
            transform: 'translate(0.5,0.5)',
            'stroke-linecap': 'round',
            fill: 'none', stroke: '#777'
        }];

        if (cell.connections) {
            connections = cell.connections;
            connectionNames = Object.keys(connections);
            '^I0-0-4 ^I1-0-12 ^I2-0-20 ^I3-0-28 ^D_OUT_0-0-16 ^D_OUT_1-0-24 ^WDATA-0-16 ^WADDR-0-64 ^RADDR-0-128 ^WE-0-192 ^RE-0-208 ^WCLKE-0-224 ^RCLKE-0-240 ^USER_SIGNAL_TO_GLOBAL_BUFFER-0-16'
                .split(' ')
                .map(function (e) {
                    var arr = e.split('-');
                    return { name: arr[0], x: parseInt(arr[1], 10), y: parseInt(arr[2], 10) };
                })
                .forEach(function (pin) {
                    var x, y;
                    connectionNames.forEach(function (name) {
                        if (
                            name.match(pin.name) &&
                            connections[name].length &&
                            (typeof connections[name][0] === 'number')
                        ) {
                            var wireNumber = connections[name][0];
                            x = 16 * (colV[col] - 4) + pin.x;
                            y = (16 * (rowV[row] - 16) + (lc * 32)) + pin.y;
                            var groupO = ['path', {
                                d: 'M' + drivers[wireNumber].x +
                                    ' ' + drivers[wireNumber].y +
                                    ' L ' + x + ' ' + y
                            }];
                            wireGroup.push(groupO);
                        }
                    });
                });

            res.push(wireGroup);
        }
    });


    var LUT_INIT;

    Object.keys(cells).forEach(function (key) {
        var cell = cells[key];
        var loc1 = cell.attributes.loc.split(',');
        var col = parseInt(loc1[0], 10);
        var loc2 = loc1[1].split('/');
        var row = parseInt(loc2[0]);
        var lc = parseInt(loc2[1]);
        var group = ['g', {
            transform: 'translate(' +
                (16 * (colV[col] - 4)) + ',' +
                (16 * (rowV[row] - 16) + (lc * 32)) + ')'
        }];
        res.push(group);

        if (cell.type === 'SB_GB') {
            group.push(['rect', {
                x: 2, y: 2, width: 44, height: 28,
                stroke: 'none', fill: '#f51'
            }, ['title', {}, cell.attributes.loc]
            ]);
        }

        if (cell.type === 'SB_IO') {
            group.push(['g', {},
                ['rect', {
                    x: 2, y: 2, width: 44, height: 28,
                    stroke: 'none', fill: '#1e5'
                },
                ['title', {}, cell.attributes.loc]
                ],
                ['text', { x: 24, y: 20, 'text-anchor': 'middle'}, cell.connections.PACKAGE_PIN[0]]
            ]);
        }

        if (cell.type === 'SB_RAM40_4K') {
            group.push(['rect', {
                x: 2, y: 2, width: 44, height: 252,
                stroke: 'none', fill: '#d3d'
            }, ['title', {}, cell.attributes.loc]
            ]);
        }

        if (cell.type === 'ICESTORM_LC') {
            'I0 I1 I2 I3'
                .split(' ')
                .forEach(function (pin, pindx) {
                    if (typeof cell.connections[pin][0] === 'number') {
                        group.push(['path', {
                            d: 'M0.5 ' + (4.5 + 8 * pindx) + ' h8',
                            fill: 'none', stroke: '#000'
                        }]);
                    }
                });

            group.push(['path', {
                d: 'M28.5 16.5 h20',
                fill: 'none', stroke: '#000'
            }]);

            if (cell.parameters.CARRY_ENABLE) {
                group.push(['rect', {
                    x: -4, y: 24,
                    width: 8, height: 8,
                    stroke: 'none', fill: '#333'
                }]);
            }

            LUT_INIT = cell.parameters.LUT_INIT;
            if (LUT_INIT) {
                LUT_INIT = lutSimplify(LUT_INIT, cell.connections);
                console.log(LUT_INIT);
                if (lut4cache[LUT_INIT] === undefined) {
                    lut4cache[LUT_INIT] = lut4(LUT_INIT);
                    if (lut4cache[LUT_INIT][0] === 'rect') {
                        blackboxes[LUT_INIT] = true;
                    }
                }
                if (lut4count[LUT_INIT] === undefined) {
                    lut4count[LUT_INIT] = 1;
                } else {
                    lut4count[LUT_INIT] += 1;
                }
                group.push(lut4cache[LUT_INIT]);
            }

            if (cell.parameters.DFF_ENABLE) {
                group.push(['rect', {
                    x: 34, y: 2, width: 12, height: 28,
                    stroke: 'none', fill: '#15f'
                }]);
            }

        }

    });

    res[1] = { w: 16 * colV[colV.length - 1], h: 16 * rowV[rowV.length - 1] };

    Object.keys(blackboxes).forEach(function (key) {
        if (lut4count[key] > 0) {
            console.log(key + ' = ' + toString2_16(key) + ': ' + lut4count[key]);
        }
    });

    return res;
}

module.exports = fpga;
/* eslint no-console:1 */

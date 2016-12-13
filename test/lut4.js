'use strict';

var lut4 = require('../lib/lut'),
    fs = require('fs'),
    svg = require('../demo/svg'),
    onml = require('onml');

function toString2_16 (num) {
    var res = '0000000000000000';
    res += num.toString(2);
    res = res.slice(-16);
    res = res.slice(0,4) +
        '_' + res.slice(4,8) +
        '_' + res.slice(8,12) +
        '_' + res.slice(12,16);
    return res;
}

var inits = [
    0, // 0
    0xffff, // 1
    0xaaaa, // i3
    0x5555, // ~i3
    0xcccc, // i2
    0x3333, // ~i2
    0xf0f0, // i1
    0x0f0f, // ~i1
    0xff00, // i0
    0x00ff, // ~i0

    0x8000, // and4
    0xfffe, // or4

    0x8080, // and3
    0xfefe, // or3

    1, // nor4 TODO
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    4096, //
    112,
    32423,
    234,
    143, // 0, 1, 2

    27030, // XOR

    0x4eee, // 0b0100 1110 1100 1100,
    63743
];

describe('lut4', function () {
    it('inits', function (done) {
        var lut = lut4();
        var res = ['g', {
            w: 320,
            h: 32 * inits.length
        },
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
        inits.forEach(function (data, i) {
            res.push(['g', {
                transform: 'translate(32,' + (32 * i) + ')'
            },
                lut(data),
                ['text', { x: 96, y: 24 }, toString2_16(data)]
            ]);
        });
        fs.writeFile('test.svg', onml.s(svg(res)), done);
    });
});

/* eslint no-console:1 */
/* eslint-env mocha */

'use strict';

var tspan = require('tspan');

function dropzone (label) {
    var res = ['g', { w: 640, h: 128, draggable: true },
        ['rect', {
            x: 0, y: 0,
            width: 640, height: 128,
            stroke: '#000',
            fill: 'none',
            'stroke-width': '1px'
        }]
    ];
    label.forEach(function (t, y) {
        var ts = tspan.parse(t);
        res.push(
            ['text', { x: 320, y: 20 * y, 'text-anchor': 'middle'}]
            .concat(ts)
        );
    });
    return res;

}

module.exports = dropzone;

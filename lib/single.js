'use strict';

var d = require('./d'),
    expr = require('./expr');

var wires = {
    i0: 'M8.5 4.5  v12  h24',
    i1: 'M8.5 12.5 v4   h24',
    i2: 'M8.5 20.5 v-4  h24',
    i3: 'M8.5 28.5 v-12 h24'
};

function constant (val) {
    return ['text', {
        x: 24, y: 20,
        'text-anchor': 'middle'
    }, val];
}

function single (desc) {
    var term, res;
    var keys = Object.keys(desc);

    if (keys.length === 0) {
        return constant(0);
    }

    if (keys.length === 1) {
        term = desc[keys[0]];

        if (typeof term === 'string') { // TODO check for value?
            return constant(1);
        } else

        if (term.length === 1) {
            res = ['g', { class: 'gate' },
                ['title', {}, expr(desc, ' &amp; ', ' | ')],
                ['path', {
                    d: wires[
                        (typeof term[0] === 'string') ?
                        term[0] :
                        term[0][1]
                    ] || '',
                    fill: 'none'
                }]
            ];
            if (typeof term[0] !== 'string') {
                res.push(['path', {
                    d: 'M24.5 16.5' + d.buf + d.circle
                }]);
            } else {
                res.push(['rect', {
                    x: 8, y: 0, width: 24, height: 32,
                    'fill-opacity': 0.1, stroke: 'none'
                }]);
            }
            return res;
        }
    }
}

module.exports = single;

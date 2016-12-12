'use strict';

function toString2_16 (data) {
    return (
        '0'.repeat(16) + parseInt(data, 10).toString(2)
    ).slice(-16);
}

var dand = 'm -16,-10 5,0 c 6,0 11,4 11,10 0,6 -5,10 -11,10 l -5,0 z';
var dor = 'm -18,-10 4,0 c 6,0 12,5 14,10 -2,5 -8,10 -14,10 l -4,0 c 2.5,-5 2.5,-15 0,-20 z';
var xor = 'm -21,-10 c1,3 2,6 2,10 m0,0 c0,4 -1,7 -2,10 m3,-20 4,0 c6,0 12,5 14,10 -2,5 -8,10 -14,10 l-4,0 c1,-3 2,-6 2,-10 0,-4 -1,-7 -2,-10 z';
var circle = 'm 4 0 c 0 1.1,-0.9 2,-2 2 s -2 -0.9,-2 -2 s 0.9 -2,2 -2 s 2 0.9,2 2 z';
var buf    = 'l-12,8 v-16 z';

var pinInvert = {
    i0: ' M0.5 4.5h12' + circle,
    i1: ' M0.5 12.5h12' + circle,
    i2: ' M0.5 20.5h12' + circle,
    i3: ' M0.5 28.5h12' + circle
};

var pin = {
    i0: ' M0.5 4.5h16',
    i1: ' M0.5 12.5h16',
    i2: ' M0.5 20.5h16',
    i3: ' M0.5 28.5h16'
};

function inverters (term) {
    var res = '';
    if (typeof term === 'object') {
        term.forEach(function (inp) {
            if (typeof inp === 'string') {
                if (pin[inp]) {
                    res += pin[inp];
                }
            } else {
                if (pinInvert[inp[1]]) {
                    res += pinInvert[inp[1]];
                }
            }
        });
    }
    return res;
}

function and (desc) {
    var terms = Object.keys(desc);
    if (terms.length === 1) {
        return ['path', {
            d: 'M32.5 16.5' + dand + inverters(desc[terms[0]]),
            fill: '#ffb', stroke: '#000'
        },
            ['title', {}, toString2_16(terms[0])]
        ];
    }
}

function or (desc) {
    var terms = Object.keys(desc);
    if (terms.length === 1) {
        return ['path', {
            d: 'M32.5 16.5' + dor + inverters(desc[terms[0]]),
            fill: '#ffb', stroke: '#000'
        },
            ['title', {}, toString2_16(terms[0])]
        ];
    }
}

function xorer (desc) {
    // console.log(desc);
    var d = 'M32.5 16.5' + xor;
    desc.forEach(function (e, i) {
        if (e === 1) {
            d += pin['i' + i];
        } else
        if (e === 2) {
            d += pinInvert['i' + i];
        }
    });
    return ['path', { d: d, fill: '#ffb', stroke: '#000' },
        ['title', {}, desc.join(',')]
    ];
}



function single (desc) {
    var term, res;
    var wires = {
        i0: 'M0.5 4.5  h8 v12  h24',
        i1: 'M0.5 12.5 h8 v4   h24',
        i2: 'M0.5 20.5 h8 v-4  h24',
        i3: 'M0.5 28.5 h8 v-12 h24'
    };
    var keys = Object.keys(desc);
    if (keys.length === 1) {
        term = desc[keys[0]];
        if (typeof term === 'string') {
            return ['text', {
                x: 24, y: 20,
                'text-anchor': 'middle'
            }, '1'];
        } else
        if (term.length === 1) {
            res = ['g', { stroke: '#000' },
                ['path', {
                    d: wires[
                        (typeof term[0] === 'string') ? term[0] : term[0][1]
                    ] || '',
                    fill: 'none'
                }]
            ];
            if (typeof term[0] !== 'string') {
                res.push(['path', {
                    d: 'M24.5 16.5' + buf + circle,
                    fill: '#ffb'
                }]);
            }
            return res;
        }
    }
}

function blackbox (desc) {
    return ['rect', {
        x: 4.5, y: 2.5, width: 24, height: 28,
        stroke: '#000', fill: '#bbb'
    }, ['title', {}, JSON.stringify(desc)]];
}

function gates () {
    return {
        and: and,
        or: or,
        xorer: xorer,
        single: single,
        blackbox: blackbox
    };
}

module.exports = gates;

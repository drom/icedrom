
'use strict';
var d = require('./d'),
    expr = require('./expr'),
    single = require('./single');

var pinInvert = {
    i0: ' M8.5 4.5h4' + d.circle,
    i1: ' M8.5 12.5h4' + d.circle,
    i2: ' M8.5 20.5h4' + d.circle,
    i3: ' M8.5 28.5h4' + d.circle
};

var pin = {
    i0: ' M8.5 4.5h8v2',
    i1: ' M8.5 12.5h8',
    i2: ' M8.5 20.5h8',
    i3: ' M8.5 28.5h8v-2'
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
            d: 'M32.5 16.5' + d.and10 + inverters(desc[terms[0]]),
            class: 'gate'
        },
        ['title', {}, expr(desc, ' &amp; ', ' | ')]
        ];
    }
}

function or (desc) {
    var terms = Object.keys(desc);
    if (terms.length === 1) {
        return ['path', {
            d: 'M32.5 16.5' + d.or10 + inverters(desc[terms[0]]),
            class: 'gate'
        },
        ['title', {}, expr(desc, ' | ', ' &amp; ')]
        ];
    }
}

function xorer (desc) {
    // console.log(desc);
    var dd = 'M32.5 16.5' + d.xor10;
    desc.forEach(function (e, i) {
        if (e === 1) {
            dd += pin['i' + i];
        } else
        if (e === 2) {
            dd += pinInvert['i' + i];
        }
    });
    return ['path', { d: dd, class: 'gate' },
        ['title', {}, desc.join(',')]
    ];
}

function blackbox (sumOfProducts, productOfSums) {
    return ['rect', {
        x: 8.5, y: 2.5, width: 20, height: 28,
        class: 'bbox'
    }, ['title', {},
        expr(sumOfProducts, ' &amp; ', ' | ') +
        ' \n ' +
        expr(productOfSums, ' | ', ' &amp; ')
    ]
    ];
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

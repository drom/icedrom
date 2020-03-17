'use strict';

var d = require('./d');

// var xor = 'm -21,-10 c1,3 2,6 2,10 m0,0 c0,4 -1,7 -2,10 m3,-20 4,0 c6,0 12,5 14,10 -2,5 -8,10 -14,10 l-4,0 c1,-3 2,-6 2,-10 0,-4 -1,-7 -2,-10 z';
// var circle = ' M 4,0 C 4,1.1  3.1,2      2,2  0.9,2   0,1.1    0,0 c 0,-1.1 0.9,-2 2,-2 1.1,0 2,0.9 2,2 z';
// var circle = 'm 4 0 c 0 1.1,-0.9 2,-2 2 s -2 -0.9,-2 -2 s 0.9 -2,2 -2 s 2 0.9,2 2 z';
// var and    = 'm -16,-10 5,0 c 6,0 11,4 11,10 0,6 -5,10 -11,10 l -5,0 z';
// var buf    = 'l-12,8 v-16 z';
// var or     = 'm -18,-10 4,0 c 6,0 12,5 14,10 -2,5 -8,10 -14,10 l -4,0 c 2.5,-5 2.5,-15 0,-20 z';
//
// var inputs = {
//     i0t1: 'M0 4 h12 v4 h4',
//
//     i1t1: 'M0 12 h4 v-4 h12',
//     i1t2: 'M0 12 h16',
//
//     i2t1: 'M0 20 h4 v-12 h12',
//     i2t3: 'M0 20 h8 v-4 h8',
//
//     i3t3: 'M0 28 h12 v-12 h4',
//     i3t4: 'M0 28 h12 v-8 h4'
// };
//
// function group (body) {
//     var res = ['g', { transform: 'translate(0.5,0.5)' }];
//     body.forEach(function (e) {
//         res.push(e);
//     });
//     return res;
// }

function lut4cache () {

    var cache = {};

    cache[0xcaca] = ['path', {
        d: d.origin +
            'm-24 -12 h8 z m24 12' +
            'm-24 -4  h8 z m24 4 ' +
            'm-24  4 h10 z m10 0 v-5 z m14 -4 ' +
            d.mux01,
        class: 'gate'
    },
    ['title', {}, 'i2 ? i1 : i0']
    ];

    cache[0x3caa] = ['path', {
        d: d.origin +
            'm-24 -12 h8 z m24 12' +
            'm-24 12 h10 z m10 0 v-5 z m14 -12' +
            d.mux02 +
            'm-16,0' + d.xor6,
        class: 'gate'
    },
    ['title', {}, 'i3 ? (i1 ^ i2) : i0']
    ];

    cache[0xccca] = ['path', {
        d: d.origin +
            'm-24 -12 h8 z m24 12' +
            'm-24 -4  h8 z m24 4 ' +
            'm-16 8 h2 z m2 0 v-9 z m14 -8' +
            d.mux01 +
            'm-16 4' + d.or6,
        class: 'gate'
    },
    ['title', {}, '(i2 | i3) ? i1 : i0']
    ];

    cache[0xf800] = ['path', {
        d: d.origin +
            'm-24 4  h4  z m4  0 v-4 z m0 -4 h4 z m20 0' +
            'm-24 12 h12 z m12 0 v-8 z m0 -8 h4 z m12 -4' +
            d.and6 + ' m-8 -4' + d.or6 + 'm-8 -4' + d.and6,
        class: 'gate'
    },
    ['title', {}, '((i0 &amp; i1) | i2) &amp; i3']
    ];


    // cache[0xffff] = group([
    //     ['text', { x: 24, y: 20, 'text-anchor': 'middle' }, '1']
    // ]);
    //
    // cache[0x0ff0] = group([
    //     ['path', {
    //         d: inputs.i2t1 + inputs.i3t3,
    //         fill: 'none', stroke: '#000'
    //     }],
    //     ['path', {
    //         d: 'M32 16' + xor,
    //         fill: '#ffb', stroke: '#000'
    //     }]
    // ]);
    //
    // cache[0x3c3c] = group([
    //     ['path', {
    //         d: inputs.i1t1 + inputs.i2t3,
    //         fill: 'none', stroke: '#000'
    //     }],
    //     ['path', {
    //         d: 'M32 16' + xor,
    //         fill: '#ffb', stroke: '#000'
    //     }]
    // ]);
    //
    // cache[0x5555] = group([
    //     ['path', {
    //         d: 'M0,4 h12 v8 h12',
    //         fill: 'none', stroke: '#000'
    //     }],
    //     ['path', {
    //         d: 'M32 16' + buf + circle,
    //         fill: '#ffb', stroke: '#000'
    //     }]
    // ]);
    //
    // cache[0xaaaa] = group([
    //     ['path', {
    //         d: 'M0,4 h12 v8 h12',
    //         fill: 'none', stroke: '#000'
    //     }],
    //     ['path', {
    //         d: 'M32 16' + buf,
    //         fill: '#ffb', stroke: '#000'
    //     }]
    // ]);
    //
    // var arr16 = Array.apply(null, Array(16));
    //
    // arr16.forEach(function (e, i) {
    //     var tt = 1 << i;
    //     var res = ['g', {},
    //         ['path', { d: 'M32 16' + and, fill: '#ffb', stroke: '#000' },
    //             ['title', {}, tt]
    //         ]
    //     ];
    //     [1, 2, 4, 8].forEach(function (mask, maski) {
    //         if (!(i & mask)) {
    //             res.push(['path', {
    //                 d: 'M12 ' + (4 + 8 * maski) + circle,
    //                 fill: '#ffb', stroke: '#000'
    //             }]);
    //         }
    //     });
    //     cache[tt] = res;
    // });
    //
    // arr16.forEach(function (e, i) {
    //     var tt = 0xffff ^ (1 << i);
    //     var res = ['g', {},
    //         ['path', { d: 'M32 16' + or, fill: '#ffb', stroke: '#000' },
    //             ['title', {}, tt]
    //         ]
    //     ];
    //     [1, 2, 4, 8].forEach(function (mask, maski) {
    //         if (!(i & mask)) {
    //             res.push(['path', {
    //                 d: 'M12 ' + (4 + 8 * maski) + circle,
    //                 fill: '#ffb', stroke: '#000'
    //             }]);
    //         }
    //     });
    //     cache[tt] = res;
    // });

    return cache;
}

module.exports = lut4cache;

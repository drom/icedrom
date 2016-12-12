'use strict';

var gates = require('./fpga-gates')();

function toString2_16 (data) {
    return (
        '0'.repeat(16) + data.toString(2)
    ).slice(-16);
}

function construct (data, groups) {
    var res = {};
    var tmp = 0;
    groups.some(function (g) {
        return Object.keys(g).some(function (key) {
            if ((data & key) == key) {
                if ((tmp | key) != tmp) {
                    res[key] = g[key];
                    tmp = tmp | key;
                    if (tmp == data) {
                        return true;
                    }
                }
            }
        });
    });
    return res;
}

function simplify (data, terms) {
    var masks = Object.keys(terms);

    while (masks.some(function (mask, idx) {
        var sum = 0;
        masks.forEach(function (m1, i) {
            if (i !== idx) {
                sum = sum | m1;
            }
        });
        if (sum == data) {
            // console.log('removed: ' + mask);
            masks.splice(idx, 1);
            delete terms[mask];
            return true;
        }
    }));
    return terms;
}

function isXor4 (data) {
    var i0s = [0x0000, 0x5555, 0xaaaa],
        i1s = [0x0000, 0x3333, 0xcccc],
        i2s = [0x0000, 0x0f0f, 0xf0f0],
        i3s = [0x0000, 0x00ff, 0xff00];

    var i0, i1, i2, i3;
    for (i0 = 0; i0 < 3; i0++) {
        for (i1 = 0; i1 < 3; i1++) {
            for (i2 = 0; i2 < 3; i2++) {
                for (i3 = 0; i3 < 3; i3++) {
                    if ((i0s[i0] ^ i1s[i1] ^ i2s[i2] ^ i3s[i3]) === data) {
                        return [i0, i1, i2, i3];
                    }
                }
            }
        }
    }
}

function lut4 () {

    var g0 = {
        0xffff: '1'
    };

    var singles = [
        [0xaaaa, 'i0'],
        [0xcccc, 'i1'],
        [0xf0f0, 'i2'],
        [0xff00, 'i3']
        // [0xff00, 'C'],
        // [0xf0f0, 'D'],
        // [0xcccc, 'A'],
        // [0xaaaa, 'B']
    ];

    var arr = [];
    singles.forEach(function (e) {
        arr.push(e);
        arr.push([~e[0] & 0xffff, ['~', e[1]]]);
    });

    var g1 = {};
    arr.forEach(function (a) {
        var idx = a[0];
        if (idx && !g1[idx]) {
            g1[idx] = [a[1]];
        }
    });

    var g2 = {};
    arr.forEach(function (a) {
        arr.forEach(function (b) {
            var idx = a[0] & b[0];
            if (idx && !g1[idx] && !g2[idx]) {
                g2[idx] = [a[1], b[1]];
            }
        });
    });

    var g3 = {};
    arr.forEach(function (a) {
        arr.forEach(function (b) {
            arr.forEach(function (c) {
                var idx = a[0] & b[0] & c[0];
                if (idx && !g1[idx] && !g2[idx] && !g3[idx]) {
                    g3[idx] = [a[1], b[1], c[1]];
                }
            });
        });
    });

    var g4 = {};
    arr.forEach(function (a) {
        arr.forEach(function (b) {
            arr.forEach(function (c) {
                arr.forEach(function (d) {
                    var idx = a[0] & b[0] & c[0] & d[0];
                    if (idx && !g1[idx] && !g2[idx] && !g3[idx] && !g4[idx]) {
                        g4[idx] = [a[1], b[1], c[1], d[1]];
                    }
                });
            });
        });
    });
    var groups = [g0, g1, g2, g3, g4];

    return function (data) {
        console.log(toString2_16(data));

        var res = construct(data, groups);
        res = simplify(data, res);
        console.log(JSON.stringify(res, null, 4));

        var resSingle = gates.single(res);
        if (resSingle) {
            return resSingle;
        }

        var resAnd = gates.and(res);
        if (resAnd) {
            return resAnd;
        }

        var res1 = construct(~data & 0xffff, groups);
        res1 = simplify(~data & 0xffff, res1);
        console.log(JSON.stringify(res1, null, 4));

        var resOr = gates.or(res1);
        if (resOr) {
            return resOr;
        }

        var xorer = isXor4(data);
        if (xorer) {
            return gates.xorer(xorer);
        }

        console.log('BLACKBOX!');

        return gates.blackbox(res);
    };
}

module.exports = lut4;
/* eslint no-console:1 */

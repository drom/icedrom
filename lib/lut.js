'use strict';

var gates = require('./fpga-gates')(),
    simplify = require('./simplify'),
    construct = require('./construct'),
    isXor4 = require('./is-xor4');

function toString2_16 (data) {
    return (
        '0000000000000000' +
        parseInt(data, 10).toString(2)
    ).slice(-16);
}

function invertInputs (desc) {
    var res = {};
    Object.keys(desc).forEach(function (key) {
        res[key] = desc[key].map(function (term) {
            if (typeof term === 'string') {
                return ['~', term];
            } else {
                return term[1];
            }
        });
    });
    return res;
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

        var sumOfProducts = construct(data, groups);
        sumOfProducts = simplify(data, sumOfProducts);
        console.log(JSON.stringify(sumOfProducts, null, 4));

        var resSingle = gates.single(sumOfProducts);
        if (resSingle) {
            return resSingle;
        }

        var resAnd = gates.and(sumOfProducts);
        if (resAnd) {
            return resAnd;
        }

        var productOfSums = construct(~data & 0xffff, groups);
        productOfSums = simplify(~data & 0xffff, productOfSums);
        productOfSums = invertInputs(productOfSums);
        console.log(JSON.stringify(productOfSums, null, 4));

        var resOr = gates.or(productOfSums);
        if (resOr) {
            return resOr;
        }

        var xorer = isXor4(data);
        if (xorer) {
            return gates.xorer(xorer);
        }

        console.log('BLACKBOX!');

        return gates.blackbox(sumOfProducts, productOfSums);
    };
}

module.exports = lut4;
/* eslint no-console:1 */

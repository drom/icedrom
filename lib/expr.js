'use strict';

function expr (desc, first, last) {
    var keys = Object.keys(desc);
    var res = keys.map(function (key) {
        return '(' +
        desc[key].map(function (sig) {
            if (typeof sig === 'string') {
                return sig;
            } else {
                return sig.join('');
            }
        }).join(first) +
        ')';
    });
    return res.join(last);
}

module.exports = expr;

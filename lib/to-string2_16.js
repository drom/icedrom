'use strict';

function toString2_16 (num) {
    var res = '0000000000000000';
    if (typeof num === 'string') {
        num = parseInt(num, 10);
    }
    res += num.toString(2);
    res = res.slice(-16);
    res = res.slice(0,4) +
        '_' + res.slice(4,8) +
        '_' + res.slice(8,12) +
        '_' + res.slice(12,16);
    return res;
}

module.exports = toString2_16;

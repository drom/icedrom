'use strict';

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

module.exports = construct;

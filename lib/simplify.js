'use strict';

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

module.exports = simplify;

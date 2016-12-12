'use strict';

function svg (body) {
    var opt = body[1];
    return ['svg', {
        xmlns: 'http://www.w3.org/2000/svg',
        width: opt.w || 512,
        height: opt.h || 512,
        viewBox: [0, 0, opt.w || 512, opt.h || 512].join(' ')
    }, body ];
}

module.exports = svg;

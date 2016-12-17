'use strict';

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

module.exports = isXor4;

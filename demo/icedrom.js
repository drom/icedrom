'use strict';

var stringify = require('onml/lib/stringify'),
    arizona = require('./arizona'),
    dropzone = require('./dropzone'),
    lib = require('../lib'),
    svg = require('./svg');

var icedrom = document.getElementById('icedrom');

icedrom.innerHTML = stringify(svg(dropzone([
    '',
    '<tt><b>yosys</b> -q -p "synth_ice40 -blif $PRJ.blif" $PRJ.v</tt>',
    '<tt><b>arachne-pnr</b> $PRJ.blif -d 8k -P tq144:4k --post-place-blif $PRJ.post.blif</tt>',
    '<tt><b>yosys</b> -q -o $PRJ.post.json $PRJ.post.blif</tt>',
    '',
    '<i>Drop <b>$PRJ.post.json</b> here</i>'
])));

arizona()
    .listen(icedrom)
    .onfile(function (data, name) {
        var mySVG = svg(
            lib.fpga({
                fname: name,
                body: JSON.parse(data)
            })
        );
        icedrom.innerHTML = stringify(mySVG);
    });

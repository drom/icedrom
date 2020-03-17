'use strict';

var fpga = require('./fpga');
var lut = require('./lut');
var pkg = require('../package.json');

exports.fpga = fpga;
exports.lut = lut;
exports.version = pkg.version;

'use strict';

function arizona () {

    var onLoadCall;

    function onLoad (f) {
        var myReader = new FileReader();
        'onabort onerror onload onloadstart onloadend onloadprogress'
        .split(' ')
        .forEach(function (e) {
            myReader[e] = function (p) {
                console.log(p);
                if (p.type === 'loadend') {
                    onLoadCall(p.currentTarget.result, f.name);
                }
            };
        });
        console.log(myReader.readAsText(f));
    }

    var lis = {
        dragover: function (event) { event.preventDefault(); },
        dragenter: null,
        dragleave: null,
        drop: function(event) {
            var i;
            event.preventDefault();
            var dt = event.dataTransfer;
            if (dt.items) {
                // Use DataTransferItemList interface to access the file(s)
                for (i = 0; i < dt.items.length; i++) {
                    if (dt.items[i].kind === 'file') {
                        var f = dt.items[i].getAsFile();
                        console.log('[1] file[' + i + '].name = ' + f.name);
                        onLoad(f);
                    }
                }
            } else {
                // Use DataTransfer interface to access the file(s)
                for (i = 0; i < dt.files.length; i++) {
                    console.log('[2] file[' + i + '].name=' + dt.files[i].name);
                    console.log(dt.files[i]);
                    onLoad(dt.files[i]);
                }
            }
        }
    };

    var self = {
        listen: function (el) {

            var inp = document.createElement('input');
            inp.setAttribute('type', 'file');
            el.insertBefore(inp, el.childNodes[0]);
            // el.appendChild(inp);
            inp.addEventListener('change', function () {
                console.log(onLoad(inp.files[0]));
            }, false);

            Object.keys(lis).forEach(function (key) {
                var cb;
                if (typeof lis[key] === 'function') {
                    cb = function (event) {
                        lis[key](event);
                        console.log(key);
                    };
                } else {
                    cb = function (/*event*/) {
                        console.log(key);
                    };
                }
                // document.addEventListener(key, cb, false);
                el.addEventListener(key, cb, false);
            });

            return self;
        },
        onfile: function (cb) {
            onLoadCall = cb;
            return self;
        }
    };
    return self;
}

module.exports = arizona;
/* eslint no-console:0 */

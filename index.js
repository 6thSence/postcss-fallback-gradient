const postcss = require ('postcss');
const crayola = require ('./crayola.json');

const hexToRgb = (hex) => {
    if (hex.length ===4 ) {
        hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    };
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

module.exports = postcss.plugin('myplug', function myplug(options) {
    return (css) => {
        options = options || {};

        css.walkRules(function (rule) {
            var haveResult = false;
            var colorArr = [];

            rule.walkDecls('background', function (decl) {
                if (decl.value.indexOf('gradient') !== -1) {
                
                    var array = [];
                    var color = { 'r': '', 'g': '', 'b': '', 'a': '', 'proc': '' };

                    const val = decl.value.slice(decl.value.indexOf(',')+1,decl.value.length-1);
                    
                    var pos = -1;
                    var len = val.length;
                    // var arg = val[0];
                    var arg = '';
                    while (pos !== len) {
                        pos++;
                        if (val[pos]===' ' || val[pos]===',' || val[pos]==='(' || val[pos]===')' || pos===len) {
                            if (arg!=='') {
                                array.push(arg);
                                // console.log('push ARG =', arg);
                            };
                            arg='';
                        }else {
                            // console.log('add it =',val[pos]);
                            arg = arg + val[pos];
                        }
                    } 

                    // console.log(array);
                    

                    var pos = -1;
                    var len = array.length;
                    while (pos !== len-1) {
                        pos++;
                        // console.log(array[pos]);
                        // console.log(array[pos].typeOf());
                        if ( array[pos] && array[pos].indexOf('#') != -1) { 
                            // console.log('HEX');
                            // console.log(array[pos]);
                            var rgb = hexToRgb(array[pos].toUpperCase());
                            color.r = rgb.r; 
                            color.g = rgb.g; 
                            color.b = rgb.b; 
                            color.a = 1;
                            if (array[pos+1].indexOf('%') !=-1) {
                                color.proc = array[pos+1].slice(0, array[pos+1].indexOf('%'));
                            } else {
                                color.proc = 0;
                            }
                            // console.log(color);
                        } else {
                            if (array[pos] && !array[pos].match(/\d+/) ) {
                                if (array[pos]==='rgba') { 
                                    color.r = array[pos+1];
                                    color.g = array[pos+2];
                                    color.b = array[pos+3];
                                    color.a = array[pos+4];
                                    if (array[pos+5] && array[pos+5].indexOf('%') !=-1) {
                                        color.proc = array[pos+5].slice(0, array[pos+5].indexOf('%'));
                                    } else if (!array[pos+5]  && pos+5 === len){
                                        color.proc = 100;
                                    } else {
                                        color.proc = 0;
                                    }
                                    // console.log('RGBA');
                                    // console.log(color);
                                } else if (array[pos]==='rgb') { 
                                    color.r = array[pos+1];
                                    color.g = array[pos+2];
                                    color.b = array[pos+3];
                                    color.a = 1;
                                    if (array[pos+4] && array[pos+4].indexOf('%') !=-1) {
                                        color.proc = array[pos+4].slice(0, array[pos+4].indexOf('%'));
                                    } else if (!array[pos+4]  && pos+4 === len){
                                        color.proc = 100;
                                    } else {
                                        color.proc = 0;
                                    }
                                    // console.log(array[pos], ' ', array[pos+1], ' ', array[pos+2], ' ', array[pos+3], ' ', array[pos+4], ' ', array[pos+5] );
                                    // console.log('RGB');
                                    // console.log(color);
                                } else {

                                    console.log('im just COLOR');
                                    console.log(array[pos]);
                                    crayola.map( (item) => {
                                        if (item.name === array[pos]) {
                                            console.log('FINDED! ');
                                            console.log('color=', item);
                                        };
                                    });
                                }
                            } else {
                                // console.log('im number');
                            }        
                        }

                                        

                    } 

                    var pos = -1;
                    var len = array.length;
                    while ( pos !== len) {
                        pos++;
                        // console.log(array[pos]);
                    }
                }


                // console.log(array);
                // if (!haveResult) {
                //     haveResult = true;

                //     return rule.insertBefore(decl, {
                //         prop: 'background'
                //         value: color
                //     });
                // }
            });

        });

    };
});
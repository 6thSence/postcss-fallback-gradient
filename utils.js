const colorTable = require ('./crayola.json');

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

const srtToArray = (str) => {
    var array = [];
    var pos = -1;
    var len = str.length;
    var arg = '';

    while (pos !== len) {
        pos++;
        if (str[pos]===' ' || str[pos]===',' || str[pos]==='(' || str[pos]===')' || pos===len) {
            if (arg!=='') {
                array.push(arg);
            };
            arg='';
        }else {
            arg = arg + str[pos];
        }
    } 

    return array;
}

const getPercent = (pos, array) => {
    var percent = 0;
    if (array[pos] && array[pos].indexOf('%') !=-1) {
        percent = array[pos].slice(0, array[pos].indexOf('%'));
    } else if (!array[pos]  && pos === array.length){
        percent = 100;
    };

    return percent;
}

const createColorModel = (decl, firstRull, colorModel) => {
    const val = decl.value.slice(decl.value.indexOf(',')+1,decl.value.length-1);
    const array = srtToArray(val);
    const len = array.length;

    var pos = -1;
    while (pos !== len-1) {
        pos++;

        if ( array[pos] && (array[pos].indexOf('#') === 0) ) { // Если цвет hex
            var color = { 'r': '', 'g': '', 'b': '', 'a': '', 'percent': '' };
            var rgb = hexToRgb(array[pos].toUpperCase());
            color.r = rgb.r; 
            color.g = rgb.g; 
            color.b = rgb.b; 
            color.a = 1;
            color.percent = getPercent(pos+1, array)

            if (firstRull) {
                colorModel.push(color);
            }
        } else {
            if (array[pos] && !array[pos].match(/\d+/) ) { // Если цвет rgbs
                if (array[pos]==='rgba') { 
                    var color = { 'r': '', 'g': '', 'b': '', 'a': '', 'percent': '' };
                    color.r = array[pos+1];
                    color.g = array[pos+2];
                    color.b = array[pos+3];
                    color.a = array[pos+4];
                    color.percent = getPercent(pos+5, array);

                    if (firstRull) {
                        colorModel.push(color);
                    }
                } else if (array[pos]==='rgb') {  // Если цвет rgb 
                    var color = { 'r': '', 'g': '', 'b': '', 'a': '', 'percent': '' };
                    color.r = array[pos+1];
                    color.g = array[pos+2];
                    color.b = array[pos+3];
                    color.a = 1;
                    color.percent = getPercent(pos+4, array);

                    if (firstRull) {
                        colorModel.push(color);
                    }
                } else { // Если цвет написан словом
                    for (item in colorTable) {
                        if (item === array[pos]) {
                            var color = { 'r': '', 'g': '', 'b': '', 'a': '', 'percent': '' };
                            var rgb = hexToRgb(colorTable[item].toUpperCase());
                            color.r = rgb.r; 
                            color.g = rgb.g; 
                            color.b = rgb.b; 
                            color.a = 1;
                            color.percent = getPercent(pos+1, array);
                            
                            if (firstRull) { // Если первое правило
                                colorModel.push(color);
                            }
                        };
                    } 
                }
            }   
        }
    }

    return colorModel;
}

module.exports = hexToRgb;
module.exports = srtToArray;
module.exports = getPercent;
module.exports = createColorModel;
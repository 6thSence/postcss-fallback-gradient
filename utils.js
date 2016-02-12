const colorTable = require ('./crayola.json');


const sortByPercent = (colorModel) => {
    colorModel.sort((a, b) => {
        if (a.percent > b.percent) {
            return 1;
        } else if (a.percent < b.percent) {
            return -1;
        }

        return 0;
    });

    return colorModel;
};

const hexToRgb = (hex) => {

    if (hex.length ===4 ) {
        hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

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
            }

            arg='';
        }else {
            arg = arg + str[pos];
        }
    } 

    return array;
};

const getPercent = (pos, array) => {
    var percent = 0;

    if (array[pos] && array[pos].indexOf('%') !=-1) {

        percent = + array[pos].slice(0, array[pos].indexOf('%'));

    } else if (!array[pos] && pos === array.length){

        percent = 100;
    }

    return percent;
};

const checkOfTransparent = (colorModel) => {

    colorModel.forEach(function(item, i, arr) {
        if (item.r === 'transparent') {
            switch (item.g) {
            case '1':
                item.r=arr[i-1].r;
                item.g=arr[i-1].g;
                item.b=arr[i-1].b;
                item.a=0;
                item.percent=undefined;
                break;
            case '2':
                item.r=arr[i+1].r;
                item.g=arr[i+1].g;
                item.b=arr[i+1].b;
                item.a=0;
                item.percent=undefined;
                break;
            default:
                break;
            }
        }
    });

    return colorModel;
};

const checkOfPercent = (colorModel) => {

    var und = 0; // колличество undefinde 
    var min = 0; // значение до undefinde
    var max = 0; // значение после undefinde
    var coef = 0; // разница между undefinde елементами
    var val = 0; // значение присваемое елементу 
    var pos = -1; // позиция map-a

    colorModel.map( item => {
        pos = pos + 1;

        if (item.percent === undefined) {

            und = und + 1;

        } else if (und > 0) {

            min = max;
            max = item.percent;
            coef = (max + min) / und;
            val = max - coef;

            while (und > 0) {
                colorModel[pos - und].percent = coef;
                val = val + coef;
                und = und -  1;
            }

            min = max;
            max = 0;
            und = 0;

        } else if (item.percent > max) {

            max = item.percent;

        }

    });

    return colorModel;
};

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
            color.r = +rgb.r; 
            color.g = +rgb.g; 
            color.b = +rgb.b; 
            color.a = 1;
            color.percent = getPercent(pos+1, array);

            colorModel.push(color);

        } else {
            if (array[pos] && !array[pos].match(/\d+/) ) { // Если цвет rgbs
                if (array[pos]==='rgba') { 
                    color = { 'r': '', 'g': '', 'b': '', 'a': '', 'percent': '' };
                    color.r = +array[pos+1];
                    color.g = +array[pos+2];
                    color.b = +array[pos+3];
                    color.a = +array[pos+4];
                    color.percent = getPercent(pos+5, array);

                    colorModel.push(color);

                } else if (array[pos]==='rgb') {  // Если цвет rgb 
                    color = { 'r': '', 'g': '', 'b': '', 'a': '', 'percent': '' };
                    color.r = +array[pos+1];
                    color.g = +array[pos+2];
                    color.b = +array[pos+3];
                    color.a = 1;
                    color.percent = getPercent(pos+4, array);

                    colorModel.push(color);

                } else { // Если цвет написан словом

                    if (array[pos] === 'transparent') { // Если это transparent
                        var color1 = { 'r': 'transparent', 'g': '1', 'b': '', 'a': '', 'percent': '' };
                        var color2 = { 'r': 'transparent', 'g': '2', 'b': '', 'a': '', 'percent': '' };

                        colorModel.push(color1);
                        colorModel.push(color2);
                    }

                    for (item in colorTable) {

                        if (item === array[pos]) { // Если цвет из таблицы цветов
                            color = { 'r': '', 'g': '', 'b': '', 'a': '', 'percent': '' };
                            rgb = hexToRgb(colorTable[item].toUpperCase());
                            color.r = +rgb.r; 
                            color.g = +rgb.g; 
                            color.b = +rgb.b; 
                            color.a = 1;
                            color.percent = getPercent(pos+1, array);
                            
                            colorModel.push(color);
                        };

                    };
                }
            }   
        }
    }
    return colorModel;
};

module.exports.createColorModel = createColorModel;
module.exports.checkOfTransparent = checkOfTransparent;
module.exports.checkOfPercent = checkOfPercent;
module.exports.sortByPercent = sortByPercent;

export const colorTable = require ('./crayola.json');

export const sortByPercent = (colorModel) => colorModel.sort((a, b) => a.percent > b.percent ? 1 : a.percent < b.percent ? -1 : 0);

export const hexToRgb = (hex) => {
    hex.length === 4 ? hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3] : null;
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

export const rbgToHex = (rgbColor) => {
    let r = (+rgbColor.r).toString(16);
    let g = (+rgbColor.g).toString(16);
    let b = (+rgbColor.b).toString(16);

    if (r.length == 1) { r = '0' + r };
    if (g.length == 1) { g = '0' + g };
    if (b.length == 1) { b = '0' + b };

    return '#' + (r + g + b);
};

export const srtToArray = (str) => {
    let array = [];
    let arg = '';

    str.split('').map(item => {
        if (item ===  ' ' || item ===  ',' || item ===  '(' || item ===  ')' ) {
            if (arg !== '') { array.push(arg); }
            arg = '';
        } else {
            arg = arg + item;
        }
    });

    return array;
};

export const getPercent = (pos, array) => {
    let percent;

    if (array[pos] && array[pos].indexOf('%') != -1) {

        return percent = + array[pos].slice(0, array[pos].indexOf('%'));

    } else if (!array[pos] && pos === array.length){

        return percent = 100;
    }

};

export const checkOfTransparent = (colorModel) => {

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

export const checkOfPercent = (colorModel) => {

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
            coef = (max + min) / (und + 1);
            val = max - coef;

            while (und > 0) {
                colorModel[pos - und].percent = val;
                val = val - coef;
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

export const createColorModel = (decl, firstRull, colorModel) => {
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

            if (color.percent === undefined && colorModel.length === 0) color.percent = 0;

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

                    if (color.percent === undefined && colorModel.length === 0) color.percent = 0;


                    colorModel.push(color);

                } else if (array[pos]==='rgb') {  // Если цвет rgb 
                    color = { 'r': '', 'g': '', 'b': '', 'a': '', 'percent': '' };
                    color.r = +array[pos+1];
                    color.g = +array[pos+2];
                    color.b = +array[pos+3];
                    color.a = 1;
                    color.percent = getPercent(pos+4, array);

                    if (color.percent === undefined && colorModel.length === 0) color.percent = 0;


                    colorModel.push(color);

                } else { // Если цвет написан словом

                    if (array[pos] === 'transparent') { // Если это transparent
                        var color1 = { 'r': 'transparent', 'g': '1', 'b': '', 'a': '', 'percent': '' };
                        var color2 = { 'r': 'transparent', 'g': '2', 'b': '', 'a': '', 'percent': '' };

                        colorModel.push(color1);
                        colorModel.push(color2);
                    }

                    colorTable.filter( item => item.color === array[pos] ? true : null )


                    //for (item in colorTable) {
                    colorTable.map( function(item) {

                        //if (item[array[pos]]) { // Если цвет из таблицы цветов
                            color = { 'r': '', 'g': '', 'b': '', 'a': '', 'percent': '' };
                            rgb = hexToRgb(item.hex.toUpperCase());
                            color.r = +rgb.r;
                            color.g = +rgb.g;
                            color.b = +rgb.b;
                            color.a = 1;
                            color.percent = getPercent(pos+1, array);

                            if (color.percent === undefined && colorModel.length === 0) color.percent = 0;


                            colorModel.push(color);
                        //};

                    });
                }
            }   
        }
    }
    return colorModel;
};

export const getTwoMaxColors = (colorModel) => {

    var max = 0;
    var maxPos = 0;
    var pos = 0;
    var len = colorModel.length;
    var interval = 0;
    const twoMainColor = [];

    while (len > pos+1) {
        pos = pos + 1;
        interval = colorModel[pos].percent - colorModel[pos-1].percent;

        if (interval > max) {
            max = interval;
            maxPos = pos - 1; 
        }
    };

    twoMainColor[0] = colorModel[maxPos];
    twoMainColor[1] = colorModel[maxPos + 1];

    return twoMainColor;
};

export const getMiddleColor = (twoColor) => {
    const middleColor = {};

    middleColor.r = Math.round((twoColor[0].r + twoColor[1].r)/2);
    middleColor.g = Math.round((twoColor[0].g + twoColor[1].g)/2);
    middleColor.b = Math.round((twoColor[0].b + twoColor[1].b)/2);
    middleColor.a = Math.round(((twoColor[0].a + twoColor[1].a)/2)*10)/10;

    return middleColor;
};

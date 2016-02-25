'use strict';

var colorTable = require('./crayola.json');

var sortByPercent = function sortByPercent(colorModel) {
    colorModel.sort(function (a, b) {
        if (a.percent > b.percent) {
            return 1;
        } else if (a.percent < b.percent) {
            return -1;
        }

        return 0;
    });

    return colorModel;
};

var hexToRgb = function hexToRgb(hex) {

    if (hex.length === 4) {
        hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

var rbgToHex = function rbgToHex(rgbColor) {
    var r = (+rgbColor.r).toString(16);
    var g = (+rgbColor.g).toString(16);
    var b = (+rgbColor.b).toString(16);

    if (r.length == 1) r = '0' + r;
    if (g.length == 1) g = '0' + g;
    if (b.length == 1) b = '0' + b;

    return '#' + (r + g + b);
};

var srtToArray = function srtToArray(str) {
    var array = [];
    var pos = -1;
    var len = str.length;
    var arg = '';

    while (pos !== len) {
        pos++;
        if (str[pos] === ' ' || str[pos] === ',' || str[pos] === '(' || str[pos] === ')' || pos === len) {

            if (arg !== '') {
                array.push(arg);
            }

            arg = '';
        } else {
            arg = arg + str[pos];
        }
    }

    return array;
};

var getPercent = function getPercent(pos, array) {

    if (array[pos] && array[pos].indexOf('%') != -1) {

        return percent = +array[pos].slice(0, array[pos].indexOf('%'));
    } else if (!array[pos] && pos === array.length) {

        return percent = 100;
    }
};

var checkOfTransparent = function checkOfTransparent(colorModel) {

    colorModel.forEach(function (item, i, arr) {
        if (item.r === 'transparent') {
            switch (item.g) {
                case '1':
                    item.r = arr[i - 1].r;
                    item.g = arr[i - 1].g;
                    item.b = arr[i - 1].b;
                    item.a = 0;
                    item.percent = undefined;
                    break;
                case '2':
                    item.r = arr[i + 1].r;
                    item.g = arr[i + 1].g;
                    item.b = arr[i + 1].b;
                    item.a = 0;
                    item.percent = undefined;
                    break;
                default:
                    break;
            }
        }
    });

    return colorModel;
};

var checkOfPercent = function checkOfPercent(colorModel) {

    var und = 0; // колличество undefinde
    var min = 0; // значение до undefinde
    var max = 0; // значение после undefinde
    var coef = 0; // разница между undefinde елементами
    var val = 0; // значение присваемое елементу
    var pos = -1; // позиция map-a

    colorModel.map(function (item) {
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
                und = und - 1;
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

var createColorModel = function createColorModel(decl, firstRull, colorModel) {
    var val = decl.value.slice(decl.value.indexOf(',') + 1, decl.value.length - 1);
    var array = srtToArray(val);
    var len = array.length;

    var pos = -1;
    while (pos !== len - 1) {
        pos++;

        if (array[pos] && array[pos].indexOf('#') === 0) {
            // Если цвет hex
            var color = { 'r': '', 'g': '', 'b': '', 'a': '', 'percent': '' };
            var rgb = hexToRgb(array[pos].toUpperCase());
            color.r = +rgb.r;
            color.g = +rgb.g;
            color.b = +rgb.b;
            color.a = 1;
            color.percent = getPercent(pos + 1, array);

            if (color.percent === undefined && colorModel.length === 0) color.percent = 0;

            colorModel.push(color);
        } else {
            if (array[pos] && !array[pos].match(/\d+/)) {
                // Если цвет rgbs
                if (array[pos] === 'rgba') {
                    color = { 'r': '', 'g': '', 'b': '', 'a': '', 'percent': '' };
                    color.r = +array[pos + 1];
                    color.g = +array[pos + 2];
                    color.b = +array[pos + 3];
                    color.a = +array[pos + 4];
                    color.percent = getPercent(pos + 5, array);

                    if (color.percent === undefined && colorModel.length === 0) color.percent = 0;

                    colorModel.push(color);
                } else if (array[pos] === 'rgb') {
                    // Если цвет rgb
                    color = { 'r': '', 'g': '', 'b': '', 'a': '', 'percent': '' };
                    color.r = +array[pos + 1];
                    color.g = +array[pos + 2];
                    color.b = +array[pos + 3];
                    color.a = 1;
                    color.percent = getPercent(pos + 4, array);

                    if (color.percent === undefined && colorModel.length === 0) color.percent = 0;

                    colorModel.push(color);
                } else {
                    // Если цвет написан словом

                    if (array[pos] === 'transparent') {
                        // Если это transparent
                        var color1 = { 'r': 'transparent', 'g': '1', 'b': '', 'a': '', 'percent': '' };
                        var color2 = { 'r': 'transparent', 'g': '2', 'b': '', 'a': '', 'percent': '' };

                        colorModel.push(color1);
                        colorModel.push(color2);
                    }

                    colorTable.filter(function (item) {
                        return item.color === array[pos] ? true : null;
                    });

                    //for (item in colorTable) {
                    colorTable.map(function (item) {

                        //if (item[array[pos]]) { // Если цвет из таблицы цветов
                        color = { 'r': '', 'g': '', 'b': '', 'a': '', 'percent': '' };
                        rgb = hexToRgb(item.hex.toUpperCase());
                        color.r = +rgb.r;
                        color.g = +rgb.g;
                        color.b = +rgb.b;
                        color.a = 1;
                        color.percent = getPercent(pos + 1, array);

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

var getTwoMaxColors = function getTwoMaxColors(colorModel) {

    var max = 0;
    var maxPos = 0;
    var pos = 0;
    var len = colorModel.length;
    var interval = 0;
    var twoMainColor = [];

    while (len > pos + 1) {
        pos = pos + 1;
        interval = colorModel[pos].percent - colorModel[pos - 1].percent;

        if (interval > max) {
            max = interval;
            maxPos = pos - 1;
        }
    };

    twoMainColor[0] = colorModel[maxPos];
    twoMainColor[1] = colorModel[maxPos + 1];

    return twoMainColor;
};

var getMiddleColor = function getMiddleColor(twoColor) {
    var middleColor = {};

    middleColor.r = Math.round((twoColor[0].r + twoColor[1].r) / 2);
    middleColor.g = Math.round((twoColor[0].g + twoColor[1].g) / 2);
    middleColor.b = Math.round((twoColor[0].b + twoColor[1].b) / 2);
    middleColor.a = Math.round((twoColor[0].a + twoColor[1].a) / 2 * 10) / 10;

    return middleColor;
};

module.exports.createColorModel = createColorModel;
module.exports.checkOfTransparent = checkOfTransparent;
module.exports.checkOfPercent = checkOfPercent;
module.exports.sortByPercent = sortByPercent;
module.exports.getTwoMaxColors = getTwoMaxColors;
module.exports.getMiddleColor = getMiddleColor;
module.exports.rbgToHex = rbgToHex;
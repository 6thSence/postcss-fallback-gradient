'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.compose = compose;
var colorTable = exports.colorTable = require('./crayola.json');
var sortByPercent = exports.sortByPercent = function sortByPercent(colorModel) {
    return colorModel.sort(function (a, b) {
        return a.percent > b.percent ? 1 : a.percent < b.percent ? -1 : 0;
    });
};
var hexToRgb = exports.hexToRgb = function hexToRgb(hex) {
    if (hex.length === 4) {
        hex = '#' + (hex[1].repeat(2) + hex[2].repeat(2) + hex[3].repeat(2));
    }
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};
var rbgToHex = exports.rbgToHex = function rbgToHex(rgbColor) {
    var r = (+rgbColor.r).toString(16);
    var g = (+rgbColor.g).toString(16);
    var b = (+rgbColor.b).toString(16);
    if (r.length == 1) {
        r = '0' + r;
    }
    if (g.length == 1) {
        g = '0' + g;
    }
    if (b.length == 1) {
        b = '0' + b;
    }

    return '#' + (r + g + b);
};
var srtToArray = exports.srtToArray = function srtToArray(str) {
    var array = [];
    var arg = '';
    str.split('').map(function (item) {
        if (item === ' ' || item === ',' || item === '(' || item === ')') {
            if (arg) {
                array.push(arg);
            }
            arg = '';
        } else {
            arg = arg + item;
        }
    });

    return array;
};
var getPercent = exports.getPercent = function getPercent(pos, array, firstColor) {
    var percent = undefined;
    if (array[pos] && array[pos].indexOf('%') != -1) {
        percent = +array[pos].slice(0, array[pos].indexOf('%'));
    } else if (!array[pos] && pos === array.length) {
        percent = 100;
    }
    if (percent === undefined && firstColor) {
        percent = 0;
    }

    return percent;
};
var checkOfTransparent = exports.checkOfTransparent = function checkOfTransparent(colorModel) {
    colorModel.map(function (item, i, arr) {
        if (item.r === 'transparent') {
            if (item.g === '1') {
                item.r = arr[i - 1].r;
                item.g = arr[i - 1].g;
                item.b = arr[i - 1].b;
            } else {
                item.r = arr[i + 1].r;
                item.g = arr[i + 1].g;
                item.b = arr[i + 1].b;
            }
        }
    });

    return colorModel;
};
var checkOfPercent = exports.checkOfPercent = function checkOfPercent(colorModel) {
    var undefinedColl = 0; // колличество undefinde
    var min = 0; // значение до undefinde
    var max = 0; // значение после undefinde
    var factor = 0; // разница между значениями всех елементов от max до min
    var percent = 0; // значение присваемое елементу
    colorModel.map(function (item, i, arr) {
        if (item.percent === undefined) {
            undefinedColl++;
        } else if (undefinedColl > 0) {
            min = max;
            max = item.percent;
            factor = Math.round((max + min) / (undefinedColl + 1));
            percent = factor;

            while (undefinedColl > 0) {
                arr[i - undefinedColl].percent = percent;
                percent += factor;
                undefinedColl--;
            }

            min = max;
            max = undefinedColl = 0;
        } else if (item.percent > max) {
            max = item.percent;
        }
    });

    return colorModel;
};
var createColorModel = exports.createColorModel = function createColorModel(val) {
    var arrayFromStr = srtToArray(val);
    var colorModel = [];

    arrayFromStr.map(function (item, i, array) {
        var color = { 'r': '', 'g': '', 'b': '', 'a': 1, 'percent': undefined };
        if (item && item.indexOf('#') === 0) {
            // Если цвет hex
            var rgb = hexToRgb(item.toUpperCase());
            color.r = +rgb.r;
            color.g = +rgb.g;
            color.b = +rgb.b;
            color.percent = getPercent(i++, array, colorModel.length === 0);
        } else {
            if (item && !item.match(/\d+/)) {
                // Если цвет rgba
                if (item === 'rgba') {
                    color.r = +array[i + 1];
                    color.g = +array[i + 2];
                    color.b = +array[i + 3];
                    color.a = +array[i + 4];
                    color.percent = getPercent(i + 5, array, colorModel.length === 0);
                } else if (item === 'rgb') {
                    // Если цвет rgb
                    color.r = +array[i + 1];
                    color.g = +array[i + 2];
                    color.b = +array[i + 3];
                    color.percent = getPercent(i + 4, array, colorModel.length === 0);
                } else {
                    // Если цвет написан словом
                    if (item === 'transparent') {
                        // Если это transparent
                        colorModel.push({ 'r': 'transparent', 'g': '1', 'b': '', 'a': 0, 'percent': undefined }, { 'r': 'transparent', 'g': '2', 'b': '', 'a': 0, 'percent': undefined });
                    }
                    colorTable.map(function (colorFromTable) {
                        if (colorFromTable.name === item) {
                            rgb = hexToRgb(colorFromTable.hex.toUpperCase());
                            color.r = +rgb.r;
                            color.g = +rgb.g;
                            color.b = +rgb.b;
                            color.percent = getPercent(i + 1, array, colorModel.length === 0);
                        }
                    });
                }
            }
        }
        if (color.r !== '') {
            colorModel.push(color);
        }
    });
    return colorModel;
};
var getTwoMaxColors = exports.getTwoMaxColors = function getTwoMaxColors(colorModel) {
    var max = 0;
    var maxPos = 0;
    var interval = 0;
    colorModel.map(function (item, i) {
        if (colorModel[i + 1]) {
            interval = colorModel[i + 1].percent - colorModel[i].percent;
        }
        if (interval > max) {
            max = interval;
            maxPos = i;
        }
    });

    return [colorModel[maxPos], colorModel[maxPos + 1]];
};
var getMiddleColor = exports.getMiddleColor = function getMiddleColor(twoColor) {
    var r = Math.round((twoColor[0].r + twoColor[1].r) / 2);
    var g = Math.round((twoColor[0].g + twoColor[1].g) / 2);
    var b = Math.round((twoColor[0].b + twoColor[1].b) / 2);
    var a = Math.round((twoColor[0].a + twoColor[1].a) / 2 * 10) / 10;

    return { r: r, g: g, b: b, a: a };
};
function compose() {
    for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
        funcs[_key] = arguments[_key];
    }

    return function (arg) {
        return funcs.reduceRight(function (composed, f) {
            return f(composed);
        }, arg);
    };
};
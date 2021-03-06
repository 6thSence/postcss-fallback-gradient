'use strict';

var _utils = require('./utils');

var postcss = require('postcss');


module.exports = postcss.plugin('myplug', function myplug(options) {
    return function (css) {
        options = options || {};

        css.walkRules(function (rule) {
            var firstRull = true;

            rule.walkDecls('background', function (decl) {
                var colorRgba = undefined;
                var colorHex = undefined;

                if (decl.value.indexOf('gradient') !== -1) {
                    if (firstRull) {
                        var val = decl.value.slice(decl.value.indexOf(',') + 1, decl.value.length - 1); // значение свойства в скобках
                        var middleColor = (0, _utils.compose)(_utils.getMiddleColor, _utils.getTwoMaxColors, _utils.sortByPercent, _utils.checkOfPercent, _utils.sortByPercent, _utils.checkOfTransparent, _utils.createColorModel)(val);

                        colorRgba = 'rgba(' + middleColor.r + ', ' + middleColor.g + ', ' + middleColor.b + ', ' + middleColor.a + ')';
                        colorHex = (0, _utils.rbgToHex)(middleColor); // получаем hex цвет из rgba
                    }
                }

                if (firstRull) {
                    firstRull = false;
                    rule.insertBefore(decl, {
                        prop: 'background',
                        value: colorHex
                    });
                    rule.insertBefore(decl, {
                        prop: 'background',
                        value: colorRgba
                    });
                }
            });
        });
    };
});
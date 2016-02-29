'use strict';

var _utils = require('./utils');

var postcss = require('postcss');


module.exports = postcss.plugin('myplug', function myplug(options) {
    return function (css) {
        options = options || {};

        css.walkRules(function (rule) {
            var firstRull = true;
            var colorModel = [];

            rule.walkDecls('background', function (decl) {
                var colorRgba;
                var colorHex;

                if (decl.value.indexOf('gradient') !== -1) {
                    if (firstRull) {
                        colorModel = (0, _utils.createColorModel)(decl, firstRull, colorModel); // построение модели цветов
                        colorModel = (0, _utils.checkOfTransparent)(colorModel); // обратока transparent
                        colorModel = (0, _utils.sortByPercent)(colorModel); // сортировка без смешения undefined процентов
                        colorModel = (0, _utils.checkOfPercent)(colorModel); // расстановка процентов там где их нет
                        colorModel = (0, _utils.sortByPercent)(colorModel); // повторная сортировка с новыми процентами
                        var twoMainColor = (0, _utils.getTwoMaxColors)(colorModel); // нахождение границ максимального отрывка
                        var middleColor = (0, _utils.getMiddleColor)(twoMainColor); // нахождение среднего цвета между двумя точками
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

                    return rule.insertBefore(decl, {
                        prop: 'background',
                        value: colorRgba
                    });
                }
            });
        });
    };
});
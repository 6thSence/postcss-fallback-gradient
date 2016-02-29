const postcss = require ('postcss');
import { createColorModel,
    checkOfTransparent,
    sortByPercent,
    checkOfPercent,
    getTwoMaxColors,
    getMiddleColor,
    rbgToHex } from './utils' ;

module.exports = postcss.plugin('myplug', function myplug(options) {
    return (css) => {
        options = options || {};

        css.walkRules(function (rule) {
            var firstRull = true;
            var colorModel = [];

            rule.walkDecls('background', function (decl) {
                var colorRgba;
                var colorHex;

                if (decl.value.indexOf('gradient') !== -1) {
                    if (firstRull) {
                        colorModel = createColorModel(decl, firstRull, colorModel); // построение модели цветов
                        colorModel = checkOfTransparent(colorModel); // обратока transparent
                        colorModel = sortByPercent(colorModel); // сортировка без смешения undefined процентов
                        colorModel = checkOfPercent(colorModel); // расстановка процентов там где их нет
                        colorModel = sortByPercent(colorModel); // повторная сортировка с новыми процентами
                        const twoMainColor = getTwoMaxColors(colorModel); // нахождение границ максимального отрывка
                        const middleColor = getMiddleColor(twoMainColor); // нахождение среднего цвета между двумя точками
                        colorRgba = 'rgba(' + middleColor.r + ', ' + middleColor.g + ', ' + middleColor.b + ', ' + middleColor.a + ')';
                        colorHex = rbgToHex(middleColor); // получаем hex цвет из rgba
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
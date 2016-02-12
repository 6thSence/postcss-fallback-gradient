const postcss = require ('postcss');
const utils = require('./utils');

module.exports = postcss.plugin('myplug', function myplug(options) {
    return (css) => {
        options = options || {};

        css.walkRules(function (rule) {
            var firstRull = true;
            var colorModel = [];

            rule.walkDecls('background', function (decl) {

                if (decl.value.indexOf('gradient') !== -1) {
                    if (firstRull) {
                        colorModel = utils.createColorModel(decl, firstRull, colorModel); // построение модели цветов
                        colorModel = utils.checkOfTransparent(colorModel); // обратока transparent
                        colorModel = utils.sortByPercent(colorModel); // сортировка без смешения undefined процентов
                        colorModel = utils.checkOfPercent(colorModel); // расстановка процентов там где их нет 
                        colorModel = utils.sortByPercent(colorModel); // повторная сортировка с новыми процентами
                        console.log(colorModel);
                        console.log('\n');
                        const twoMainColor = utils.getTwoMaxColors(colorModel); // нахождение границ максимального отрывка
                        const middleColor = utils.getMiddleColor(colorModel); // нахождение среднего цвета между двумя точками
                        const colorRgba = 'rgba(' + middleColor.r + ', ' + middleColor.g + ', ' + middleColor.b + ', ' + middleColor.a + ')';
                        const colorHex = utils.rbgToHex(middleColor); // получаем hex цвет из rgba
                        console.log(colorHex);
                        console.log(colorRgba);
                        console.log('\n');
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
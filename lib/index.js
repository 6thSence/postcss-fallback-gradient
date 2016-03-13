const postcss = require('postcss');
import { createColorModel,
    checkOfTransparent,
    sortByPercent,
    checkOfPercent,
    getTwoMaxColors,
    getMiddleColor,
    rbgToHex,
    compose } from './utils';

module.exports = postcss.plugin('myplug', function myplug(options) {
    return (css) => {
        options = options || {};

        css.walkRules(function(rule) {
            let firstRull = true;

            rule.walkDecls('background', decl => {
                let colorRgba;
                let colorHex;

                if (decl.value.indexOf('gradient') !== -1) {
                    if (firstRull) {
                        const val = decl.value.slice(decl.value.indexOf(',') + 1, decl.value.length - 1); // значение свойства в скобках
                        const middleColor = compose(
                            getMiddleColor,
                            getTwoMaxColors,
                            sortByPercent,
                            checkOfPercent,
                            sortByPercent,
                            checkOfTransparent,
                            createColorModel)(val);

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
                    rule.insertBefore(decl, {
                        prop: 'background',
                        value: colorRgba
                    });
                }
            });
        });
    };
});
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
                    }
                }

                if (firstRull) {
                    firstRull = false;
                    // console.log(colorModel);

                    // TODO:
                    // 
                    // const middleColor = createMiddleColor();
                    // 
                    // return rule.insertBefore(decl, {
                    //     prop: 'background'
                    //     value: middleColor
                    // });
                }
            });
        });
    };
});
const postcss = require ('postcss');
const hexToRgb, srtToArray, getPercent, createColorModel = require('./utils');

module.exports = postcss.plugin('myplug', function myplug(options) {
    return (css) => {
        options = options || {};
            
            var pravda = true;

        css.walkRules(function (rule) {
            var firstRull = true;
            var colorModel = [];

            rule.walkDecls('background', function (decl) {

                if (decl.value.indexOf('gradient') !== -1) {
                    colorModel = createColorModel(decl, firstRull, colorModel);
                }
                

                if (firstRull) {
                    firstRull = false;
                    console.log(colorModel);
                    // const middleColor = createMiddleColor(); //TODO
                    // 
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
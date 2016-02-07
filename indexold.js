const postcss = require ('postcss');

const RgbaRegx = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/;
const RgbRegx = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/;

const getColor = (val, mode) => {
    var colors = [];
    var pos = 0;
    var color = '';

    switch (mode) {
    case 'hex':
        while (pos != -1) {
            if (val.indexOf('#', pos + 1) !== -1 ) {
                color = val.slice(val.indexOf('#', pos + 1), val.indexOf('#', pos + 1)+7);
                colors.push(color);
            }
            pos = val.indexOf('#', pos + 1);
        }
        break;

    case 'rgba':
        while (pos != -1) {
            if (val.indexOf('rgba', pos + 1) !== -1 ) {
                color = val.slice(val.indexOf('rgba', pos + 1), val.indexOf(')', pos + 1)+1);
                colors.push(color);
            } 
            pos = val.indexOf(')', pos + 1);
        }
        break;

    case 'rgb':
        while (pos != -1) {
            if (val.indexOf('rgb', pos + 1) !== -1 ) {
                color = val.slice(val.indexOf('rgb', pos + 1), val.indexOf(')', pos + 1)+1);
                colors.push(color);
            } 
            pos = val.indexOf(')', pos + 1);
        }
        break;

    default:
        break;
    }

    return colors[Math.round(colors.length/2)];
};

const rbgToHex = (rgb) => {
    var r = (+rgb[1]).toString(16);
    var g = (+rgb[2]).toString(16);
    var b = (+rgb[3]).toString(16);

    if (r.length == 1) r = '0' + r;
    if (g.length == 1) g = '0' + g;
    if (b.length == 1) b = '0' + b;

    return '#' + (r + g + b);
};


module.exports = postcss.plugin('myplug', function myplug(options) {
    return (css) => {
        options = options || {};

        css.walkRules(function (rule) {
            var haveResult = false;

            rule.walkDecls('background', function (decl) {
                const val = decl.value;
                var color = '';
                var rgb = '';

                if (val.indexOf('linear-gradient') !== -1) {
                    if (val.indexOf('#') !== -1 ) { 
                        color = getColor( val, 'hex' );
                    } else if (val.indexOf('rgba') !== -1) {
                        color = getColor( val, 'rgba' );
                        rgb = color.match(RgbaRegx);
                    } else if (val.indexOf('rgb') !== -1) {
                        color = getColor( val, 'rgb' );
                        rgb = color.match(RgbRegx);
                    } else {
                        haveResult = true;
                    }
                }

                if (!haveResult) {
                    haveResult = true;
                    if (rgb) color = rbgToHex(rgb);

                    return rule.insertBefore(decl, {
                        prop: 'background',
                        value: color
                    });
                }
            });

        });

    };
});
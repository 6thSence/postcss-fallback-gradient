const assert = require('assert');
const createColorModel = require('../bin/utils');
const checkOfTransparent = require('../bin/utils');
const sortByPercent = require('../bin/utils');
const checkOfPercent = require('../bin/utils');
const getTwoMaxColors = require('../bin/utils');
const getMiddleColor = require('../bin/utils');
const rbgToHex = require('../bin/utils');
const compose = require('../bin/utils');

describe('Array', function() {
    describe('create color model from leaner-gradient', function() {
        it('should return model [{r: "red", g: "green", b: "blue", a: "alpha", percent: "percent on position"}]' +
            ' when the value is "linear-gradient(value...);"', function() {
            const value = 'linear-gradient(red, yellow)';
            assert.equal([{r: '255', g: '0', b: '0', a: '1', percent: '0'},
                {r: '255', g: '255', b: '0', a: '1', percent: '0'}], createColorModel(value, ));
            assert.equal(-1, [1, 2, 3].indexOf(0));
        });
    });
});
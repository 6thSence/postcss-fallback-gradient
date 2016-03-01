import test from 'ava';

import { checkOfTransparent,
    sortByPercent,
    checkOfPercent,
    getTwoMaxColors,
    getMiddleColor,
    rbgToHex,
    compose } from '../bin/utils';

test('rbgToHex', t => {
    t.is(rbgToHex({ r: 255, g: 0, b: 0}), '#ff0000');
});
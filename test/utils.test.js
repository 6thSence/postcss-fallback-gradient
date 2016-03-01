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

test('compose sum', t => {
    const func1 = (a) => a = a + 1;
    const func2 = (a) => a = a + 1;
    const func3 = (a) => a = a + 1;
    t.is(compose(func1, func2, func3)(1), 4);
});

test('compose order', t => {
    const func1 = (a) => a = a / 2;
    const func2 = (a) => a = a + 3;
    const func3 = (a) => a = a * 4;
    t.is(compose(func3, func1, func2)(1), 8);
});

test('get middle color', t => {
    const color1 = {r: 130, g: 130, b: 130, a: 1, percent: 0};
    const color2 = {r: 70, g: 70, b: 70, a: 0.4, percent: 100};
    t.same(getMiddleColor([color1, color2]), {r: 100, g: 100, b: 100, a: 0.7});
});


import test from 'ava';

import { createColorModel,
    checkOfTransparent,
    sortByPercent,
    checkOfPercent,
    getTwoMaxColors,
    getMiddleColor,
    rbgToHex,
    compose,
    getPercent } from '../bin/utils';

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
test('check of transpareny', t => {
    const colorModel =[
        { r: 114, g: 114, b: 144 },
        { r: 'transparent', g: '1', b: 0 },
        { r: 'transparent', g: '2', b: 0 },
        { r: 50, g: 56, b: 77 }
    ];
    const result = [
        { r: 114, g: 114, b: 144 },
        { r: 114, g: 114, b: 144 },
        { r: 50, g: 56, b: 77 },
        { r: 50, g: 56, b: 77 }
    ];

    t.same(checkOfTransparent(colorModel), result);
});
test('sort by percent', t => {
    const colorModel =[
        { r: 114, g: 114, b: 144, percent: 56 },
        { r: 'transparent', g: '1', b: 0, percent: 50 },
        { r: 'transparent', g: '2', b: 0, percent: 100 },
        { r: 50, g: 56, b: 77, percent: 5 }
    ];
    const result =[
        { r: 50, g: 56, b: 77, percent: 5 },
        { r: 'transparent', g: '1', b: 0, percent: 50 },
        { r: 114, g: 114, b: 144, percent: 56 },
        { r: 'transparent', g: '2', b: 0, percent: 100 }
    ];

    t.same(sortByPercent(colorModel), result);
});
test('get two max color', t => {
    const colorModel =[
        { r: 50, g: 56, b: 77, percent: 5 },
        { r: 'transparent', g: '1', b: 0, percent: 50 },
        { r: 114, g: 114, b: 144, percent: 56 },
        { r: 'transparent', g: '2', b: 0, percent: 100 }
    ];
    const result =[
        { r: 50, g: 56, b: 77, percent: 5 },
        { r: 'transparent', g: '1', b: 0, percent: 50 }
    ];

    t.same(getTwoMaxColors(colorModel), result);
});
test('check of percent', t => {
    const colorModel =[
        { r: 114, g: 114, b: 144, percent: 0 },
        { r: 'transparent', g: '1', b: 0, percent: undefined },
        { r: 'transparent', g: '2', b: 0, percent: undefined },
        { r: 50, g: 56, b: 77, percent: 56 }
    ];
    const result =[
        { r: 114, g: 114, b: 144, percent: 0 },
        { r: 'transparent', g: '1', b: 0, percent: 19 },
        { r: 'transparent', g: '2', b: 0, percent: 38 },
        { r: 50, g: 56, b: 77, percent: 56 }
    ];

    t.same(checkOfPercent(colorModel), result);
});
test('get percent', t => {
    const colorModel =[
        { r: 114, g: 114, b: 144, percent: 0 },
        { r: 'transparent', g: '1', b: 0, percent: undefined },
        { r: 'transparent', g: '2', b: 0, percent: undefined },
        { r: 50, g: 56, b: 77, percent: 56 }
    ];
    const result =[
        { r: 114, g: 114, b: 144, percent: 0 },
        { r: 'transparent', g: '1', b: 0, percent: 19 },
        { r: 'transparent', g: '2', b: 0, percent: 38 },
        { r: 50, g: 56, b: 77, percent: 56 }
    ];

    t.same(getPercent(colorModel), result);
});
//test('create color model', t => {
//    const val ='rgb(145, 23, 23), #f00 10%, transparent, red, rgba(0,255,127,.3) 50%, rgba(0, 127, 128, 0.8)';
//    const result =[
//        { r: 145, g: 23, b: 23, a: 1, percent: 0 },
//        { r: 255, g: 0, b: 0, a: 1, percent: 10 },
//        { r: 'transparent', g: '1', b: 0, a: 1, percent: undefined },
//        { r: 'transparent', g: '2', b: 0, a: 1, percent: undefined },
//        { r: 255, g: 0, b: 0, a: .3, percent: 50 },
//        { r: 0, g: 127, b: 128, a: .8, percent: 100 }
//    ];
//
//    t.same(createColorModel(val)[1], result[1]);
//});

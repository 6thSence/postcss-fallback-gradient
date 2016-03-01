const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const rename = require('gulp-rename');

gulp.task('default', ['build']);

gulp.task('build', () => {
    gulp.src('lib/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('bin/'));

    return gulp.src('lib/crayola.json')
        .pipe(gulp.dest('bin/'));
});

gulp.task('lint', () => {
    return gulp.src(['**/*.js', '!node_modules/**', '!bin/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('mocha', () => {

    return gulp.src('test/test.utils.js', {read: false})
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(mocha({reporter: 'nyan'}));
});
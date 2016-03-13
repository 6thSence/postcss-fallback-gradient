const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');

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

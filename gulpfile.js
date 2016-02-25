const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('default', () => {
    gulp.src('lib/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('bin/'));

    return gulp.src('lib/crayola.json')
        .pipe(gulp.dest('bin/'));
});
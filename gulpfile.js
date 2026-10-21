const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass')(require('sass'));
const assetsDirectory = './src/assets';
const stylesheetsDirectory = `${assetsDirectory}/stylesheets`;


gulp.task('sass', () => {
  return gulp.src(`${stylesheetsDirectory}/*.scss`)
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(gulp.dest(stylesheetsDirectory));
});

gulp.task('watch', () => {
  gulp.watch(`${stylesheetsDirectory}/**/*.scss`, gulp.series('sass'));
});

gulp.task('default', gulp.series('sass', 'watch'));

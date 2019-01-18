const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const path = require('path');

const repoRoot = path.join(__dirname, '/');
const govUkFrontendToolkitRoot = path.join(repoRoot, 'node_modules/govuk_frontend_toolkit/stylesheets');
const govUkElementRoot = path.join(repoRoot, 'node_modules/govuk-elements-sass/public/sass');

const assetsDirectory = './src/assets';
const stylesheetsDirectory = `${assetsDirectory}/stylesheets`;


gulp.task('sass', () => {
  gulp.src(`${stylesheetsDirectory}/*.scss`)
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: [
        govUkFrontendToolkitRoot,
        govUkElementRoot
      ]
    }))
    .pipe(gulp.dest(stylesheetsDirectory));
});

gulp.task('watch', () => {
  gulp.watch(`${stylesheetsDirectory}/**/*.scss`, ['sass']);
});

gulp.task('default', [
  'sass',
  'watch'
]);

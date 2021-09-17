const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const del = require("del");

// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

// HTML

const html = () => {
  return gulp.src("source/*.html")
    .pipe(gulp.dest("build"));
}

// images

const images = () => {
  return gulp.src("source/img/**/*")
    .pipe(gulp.dest("build/img"));
}

// fonts

const fonts = () => {
  return gulp.src("source/fonts/*")
    .pipe(gulp.dest("build/fonts"));
}

// Clean

const clean = () => {
  return del ("build");
};

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'source'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series(styles));
  gulp.watch("source/*.html").on("change", sync.reload);
}

const build = gulp.series(clean,
  gulp.parallel(
    styles, html, images, fonts
  ));

exports.build = build;

exports.default = gulp.series(
  build, server, watcher
);

// Require Gulp first!
//defining all gulp requirements
var gulp = require('gulp'),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    browserSync = require('browser-sync'),
    eslint = require('gulp-eslint'),
    sass = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
    cssnano = require("gulp-cssnano"),
    babel = require("gulp-babel");
// This is a very basic Gulp task,
// with a name and some code to run
// when this task is called:

gulp.task("babel", () => {
    return gulp
        .src("js/main.js")
    .pipe(gulp.dest("build/js/babel.js"));
});


gulp.task('lint', function() { //gulp task for lint

    return gulp
        .src(['js/*.js', '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task("sass", function() { //gulp task for compiling sass files to css files
    return gulp
        .src("./sass/**/*.scss", { sourcemaps: true })
        .pipe(sass())
        .pipe(
            autoprefixer({
                browsers: ["last 2 versions"]
            })
        )
        .pipe(gulp.dest("./build/css"))
        .pipe(cssnano())
        .pipe(rename("style.min.css")) //renaming the style file
        .pipe(gulp.dest("./build/css"));
});

gulp.task("scripts", gulp.series('lint', function() { //gulp task for compiling sass files to css files
    return gulp
        .src("./js/*.js")
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglify())
        .pipe(rename({ extname: ".min.js" })) //adding extension to the name of the file
        .pipe(gulp.dest("./build/js"));
}));

gulp.task("browser-sync", function(done) {
    browserSync.init({
        server: {
            baseDir: './'
        }
    })

    gulp
        .watch(['build/js/*.js', 'build/css/*.css'])
        .on('change', browserSync.reload);
    done();
})

gulp.task("watch", function(done) { //taking care of changes to sass and js files
    gulp.watch("js/*.js", gulp.series("scripts"));
    gulp.watch("./sass/**/*.scss", gulp.series("sass"));

    done();
});

gulp.task('default', gulp.parallel('browser-sync', 'watch'));
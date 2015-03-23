var gulp = require("gulp"),
    concat = require("gulp-concat"),
    mainBowerFiles = require("main-bower-files")

gulp.task("bower-files", function () {
  return gulp.src(mainBowerFiles())
	.pipe(concat('dependencies.js'))
	.pipe(gulp.dest('./js'))
})

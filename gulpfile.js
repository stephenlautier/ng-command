var gulp = require("gulp");
var tsc = require("gulp-typescript");
var sourcemaps = require("gulp-sourcemaps");
var concat = require("gulp-concat");
var ngAnnotate = require("gulp-ng-annotate");
var uglify = require("gulp-uglify");

var del = require("del");
var merge = require("merge2");
var args = require('yargs').argv;
var gulpif = require('gulp-if');
var rename = require('gulp-rename');
var runseq = require("run-sequence");

// example only
var browserSync = require("browser-sync");


var isRelease = args.rel || false;
console.log(">>>>> Is Release: " + isRelease);

var tsProject = tsc.createProject('tsconfig.json', { sortOutput: true });

var paths = {
	tscripts: {
		src: ["tools/typings/tsd.d.ts", "src/command.module.ts", "src/**/*.ts"],
	},
	distFileName: "ng-command.js",
	distTypeScriptDefName: "ng-command.d.ts",
	dist: "./build",
	exampleRoot: "./example"
};

gulp.task("default", ["compile:typescript"], function () {

});

// ** Watching ** //

gulp.task("watch", [], function () {
	gulp.watch(paths.tscripts.src, ["compile:typescript"]).on("change", reportChange);
});

// ** Compilation ** //
gulp.task("build:rel", ["clean"], function (cb) {
	//runseq("compile:typescript", "minify", cb);
	runseq("compile:typescript", "compile:typescript:rel", cb);
});


gulp.task("compile:typescript", function () {
	var tsResult = gulp
		.src(paths.tscripts.src)
		.pipe(sourcemaps.init())
		.pipe(tsc(tsProject));

	return merge([
		tsResult.js
			.pipe(concat(paths.distFileName))
			.pipe(ngAnnotate())
			.pipe(sourcemaps.write("."))
			.pipe(gulp.dest(paths.dist))
	]);
});

gulp.task("compile:typescript:rel", function () {
	var tsResult = gulp
		.src(paths.tscripts.src)
		.pipe(tsc(tsProject));

	return merge([
		tsResult.dts
			.pipe(concat(paths.distTypeScriptDefName))
			.pipe(gulp.dest(paths.dist)),
		tsResult.js
			.pipe(concat(paths.distFileName))
			.pipe(ngAnnotate())
			.pipe(uglify())
			.pipe(rename({ extname: '.min.js' }))
			.pipe(gulp.dest(paths.dist))
	]);
});

// ** Clean ** //
gulp.task("clean", function (cb) {
	del([paths.dist], cb);
});
function reportChange(event) {
	console.log("File " + event.path + " was " + event.type + ", running tasks...");
}


// ** Example ** //

gulp.task("serve-example", ["build:rel"], function (done) {

	browserSync({
		open: true,
		port: 9000,
		server: {
			baseDir: ["."],
			index: "example/command-lab.html",
			middleware: function (req, res, next) {
				res.setHeader("Access-Control-Allow-Origin", "*");
				next();
			}
		},
		 files: ["example/*.*", "build/*.*"]
	}, done);

});
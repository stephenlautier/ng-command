var gulp = require("gulp");
var tsc = require("gulp-typescript");
//var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");
//var browserSync = require("browser-sync");
var runseq = require("run-sequence");
var concat = require("gulp-concat");
//var wiredep = require("wiredep").stream;
var ngAnnotate = require("gulp-ng-annotate");
//var usemin = require("gulp-usemin");
var uglify = require("gulp-uglify");
//var minifyCss = require("gulp-minify-css");
var del = require("del");

var paths = {
	tscripts: {
		src: ["tools/typings/tsd.d.ts", "src/command.module.ts", "src/**/*.ts"],
	},
	distFileName: "ng-command.js",
	distTypeScriptDefName: "ng-command.d.ts",
	dist: "./build"
};

gulp.task("default", function () {

});


// ** Running ** //


//gulp.task("buildrun", function (cb) {
//	runseq("build", "run", cb);
//});

// ** Watching ** //


gulp.task("watch", [], function () {
	gulp.watch(paths.tscripts.src, ["compile:typescript"]).on("change", reportChange);
});

// ** Compilation ** //
gulp.task("build:prod", ["clean"], function (cb) {
	//runseq("compile:typescript", "minify", cb);
	runseq("compile:typescript", cb);
});

//gulp.task("build", ["compile:typescript", "compile:sass", "bower", "html", "copy:fonts", "copy:imgs"]);

gulp.task("compile:typescript", function () {
	var tsResult = gulp
		.src(paths.tscripts.src)
		.pipe(sourcemaps.init())
		.pipe(tsc({
			module: "amd",
			target: "ES5",
			declarationFiles: true,
			emitError: false,
			emitDecoratorMetadata: true,
			experimentalDecorators: true
		}));
		
	tsResult.dts
		.pipe(concat(paths.distTypeScriptDefName))
		.pipe(gulp.dest(paths.dist))
	
	return tsResult.js
		.pipe(concat(paths.distFileName))
		.pipe(ngAnnotate())
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest(paths.dist));

});

// ** Clean ** //
gulp.task("clean", function (cb) {
	del([paths.dist], cb);
});
function reportChange(event) {
	console.log("File " + event.path + " was " + event.type + ", running tasks...");
}
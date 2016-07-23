// Included Modules
var fs 		 	  = require('fs'),
	path 		    = require('path'),
	gulp 		    = require('gulp'),
	gutil 		  = require('gulp-util'),
	sass 		    = require('gulp-sass'),
	jshint 		  = require('gulp-jshint'),
	uglify		  = require('gulp-uglify'),
	rename 	    = require('gulp-rename'),
	plumber 	  = require('gulp-plumber'),
	livereload 	= require('gulp-livereload');

// Pull In The Config File
var config 		= JSON.parse(fs.readFileSync('config.json'));

// Compiles CSS From SCSS Files In Specified Directories
gulp.task('compile-sass', function () {

	// Itterate Through Directories Listed In Config File & Compile SCSS Files Held Within Them
	for(i = 0; i < Object.keys(config.gulp.watched.css).length; i++) {

		return gulp.src(path.join(config.app.root,  'public/'+config.gulp.watched.css[i]+'*.scss'))
				.pipe(sass().on('error', sass.logError))
				.pipe(gulp.dest(path.join(config.app.root, 'public/'+config.gulp.watched.css[i])))
				.pipe(livereload());
	}
});

/**
 * Minifies Javascript files in the public/js directory
 */
gulp.task('minify-js', function() {

	// Loop throught the directory and return the filename of each file held within
		fs.readdirSync(path.join(config.app.root, 'public/js/')).forEach(function(filename) {

			// Check If The File Has The Js Extension
			if(~filename.indexOf('.js')) {

				// Explode The File Name
				var name = filename.split(".").map(function(val) {
					return val;
				});

				gulp.src(path.join(config.app.root, 'public/js/*.js'))
					.pipe(plumber())
					.pipe(jshint())
    					.pipe(jshint.reporter('jshint-stylish'))
					.pipe(uglify())
					.pipe(rename({
						basename: name[0],
						extname: '.min.js'
					}))
					.pipe(gulp.dest(path.join(config.app.root, 'public/js/dist/')))
					.pipe(livereload());
			}
		});

	// Itterate Through Directories Listed In Config File & Minify Js Files Held Within Them
	for(i = 0; i < Object.keys(config.gulp.watched.js).length; i++) {

		// Loop throught the directory and return the filename of each file held within
		fs.readdirSync(path.join(config.app.root, 'public/js/'+config.gulp.watched.js[i])).forEach(function(filename) {

			// Check If The File Has The Js Extension
			if(~filename.indexOf('.js')) {

				// Explode The File Name
				var name = filename.split(".").map(function(val) {
					return val;
				});

				gulp.src(path.join(config.app.root, 'public/js/'+config.gulp.watched.js[i]+filename))
					.pipe(plumber())
					.pipe(jshint())
    					.pipe(jshint.reporter('jshint-stylish'))
					.pipe(uglify())
					.pipe(rename({
						basename: name[0],
						extname: '.min.js'
					}))
					.pipe(gulp.dest(path.join(config.app.root, 'public/js/dist/'+config.gulp.watched.js[i])))
					.pipe(livereload());
			}
		});
	}
});

/**
 * Watches for changes and minifies files on save
 */
gulp.task('watch', function() {
	livereload.listen();

	gulp.watch(path.join(config.app.root, 'public/js/*.js'), ['minify-js']);
	for(i = 0; i < Object.keys(config.gulp.watched.js).length; i++) {

		fs.readdirSync(path.join(config.app.root, 'public/js/'+config.gulp.watched.js[i])).forEach(function(filename) {

			gulp.watch(path.join(config.app.root, 'public/js/'+config.gulp.watched.js[i]+'*.js'), ['minify-js']);
		});
	}

	gulp.watch(path.join(config.app.root, 'public/css/*.scss'), ['compile-sass']);
	for(i = 0; i < Object.keys(config.gulp.watched.js).length; i++) {

		fs.readdirSync(path.join(config.app.root, 'public/'+config.gulp.watched.css[i])).forEach(function(filename) {

			gulp.watch(path.join(config.app.root, 'public/'+config.gulp.watched.css[i]+'*.scss'), ['compile-sass']);
		});
	}
});

gulp.task('default', ['watch']);

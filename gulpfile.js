var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	notify = require('gulp-notify'),
	del = require('del'),
	csso = require('gulp-csso');


// Development tasks
// ----------------------------------------------------------------------

gulp.task('styles', function() {
	gulp.src('src/css/timeline.scss')
		.pipe(sass({
			style: 'expanded',
			srcmap: false
		})
		.on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 version', 'ie 8', 'ie 9']
		}))
		.pipe(gulp.dest('src/css'))
		.pipe(notify({
			message: 'Timeline styles task complete'
		}));
});

// For demo website only, can be removed
gulp.task('demo-styles', function() {
	gulp.src('demo/css/demo.scss')
		.pipe(sass({
			style: 'expanded',
			srcmap: false
		})
			.on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 version', 'ie 8', 'ie 9']
		}))
		.pipe(gulp.dest('demo/css'))
		.pipe(notify({
			message: 'Demo styles task complete'
		}));
});

gulp.task('watch', function() {
	gulp.watch('src/css/*.scss', ['styles']);
	gulp.watch('demo/css/*.scss', ['demo-styles']);
});



// Distribute tasks
// ----------------------------------------------------------------------

gulp.task('min-timeline', function() {
	gulp.src(['src/js/timeline.js'])
		.pipe(uglify({
			preserveComments: 'some'
		}))
		.pipe(rename({
			suffix: '.min',
			extname: '.js'
		}))
		.pipe(gulp.dest('dist/js/'))
		.pipe(notify({
			message: 'Successfully uglified timeline.'
		}));

	gulp.src('src/css/timeline.css')
		.pipe(csso())
		.pipe(rename('timeline.min.css'))
		.pipe(gulp.dest('dist/css/'))
		.pipe(notify({
			message: 'Min copy created.'
		}));
});

gulp.task('copy-to-dist', function() {
	// copy other files to dist folder
	gulp.src('src/js/timeline.js')
		.pipe(gulp.dest('dist/js/'));

	gulp.src('src/css/timeline.scss')
		.pipe(gulp.dest('dist/css/'));

	gulp.src('src/img/*')
		.pipe(gulp.dest('dist/img/'));

	gulp.src('src/css/timeline.css')
		.pipe(gulp.dest('dist/css/'))
		.pipe(notify({
			message: 'Moved to dist.'
		}));
});

// Now run in order
gulp.task('dist', ['min-timeline', 'copy-to-dist']);

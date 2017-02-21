var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var pngquant = require('imagemin-pngquant');
var rimraf = require('rimraf');
var $ = require('gulp-load-plugins')();

var path = {
	src: {
		pug: './src/**/*.pug',
		js: './src/javascripts/*.js',
		styl: './src/stylesheets/*.styl',
		images: './src/images/**/*.*',
		fonts: './src/fonts/**/*.*'
	},
	build: {
		html: './build/',
		js: './build/javascripts/',
		css: './build/stylesheets/',
		images: './build/images/',
		fonts: './build/fonts/'
	},
	watch: {
		pug: './src/**/*.pug',
		js: './src/javascripts/**/*.js',
		styl: './src/stylesheets/**/*.styl',
		images: './src/images/**/*.*',
		fonts: './src/fonts/**/*.*'
	},
	clean: './build'
}

var server = {
	server: {
		baseDir: "./build/"
	},
	directory: true,
	open: false
}

gulp.task('clean', function (cb) {
	rimraf(path.clean, cb);
});

gulp.task('fonts', function() {
	gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts))
		.on('end', browserSync.reload);
})

gulp.task('html', function() {
	gulp.src(path.src.pug)
		.pipe($.plumber())
		.pipe($.ignore('**/_*.pug'))
		.pipe($.pug({
			pretty: true
		}))
		.pipe(gulp.dest(path.build.html))
		.on('end', browserSync.reload);
})


gulp.task('css:dev', function() {
	gulp.src(path.src.styl)
		.pipe($.stylus({
			'include css': true
		}))
		.on('error', function (error) {
			console.error('' + error);
		})
		.pipe(gulp.dest(path.build.css))
		.on('end', browserSync.reload);
})

gulp.task('css:build', function() {
	gulp.src(path.src.styl)
		.pipe($.stylus({
			'include css': true
		}))
		.on('error', function (error) {
			console.error('' + error);
		})
		.pipe(gulp.dest(path.build.css))
		.on('end', browserSync.reload);
})

gulp.task('js:dev', function() {
	gulp.src(path.src.js)
		.pipe($.plumber())
		.pipe($.rigger())
		.pipe(gulp.dest(path.build.js))
		.on('end', browserSync.reload);
})

gulp.task('js:build', function() {
	gulp.src(path.src.js)
		.pipe($.plumber())
		.pipe($.rigger())
		.pipe(gulp.dest(path.build.js))
		.pipe($.uglify())
})

gulp.task('images',function(){
	gulp.src(path.src.images)
		.pipe($.newer(path.src.images))
		.pipe($.imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()],
			interlaced: true,
			options: {
					cache: true
			}
		}))
		.pipe(gulp.dest(path.build.images));
})

gulp.task('webserver', function () {
	browserSync(server);
});

gulp.task('watch', function () {
	$.watch([path.watch.fonts], function(event, cb) {
		gulp.start('fonts');
	});
	$.watch([path.watch.pug], function(event, cb) {
		gulp.start('html');
	});
	$.watch([path.watch.styl], function(event, cb) {
		gulp.start('css:dev');
	});
	$.watch([path.watch.js], function(event, cb) {
		gulp.start('js:dev');
	});
	$.watch([path.watch.images], function(event, cb) {
		gulp.start('images');
	});
});

gulp.task('dev', function(){
	gulp.start('html','css:dev','js:dev','images','fonts');
})

gulp.task('build', function(){
	gulp.start('html','css:build','js:build','images','fonts');
})

gulp.task('default',['dev','watch','webserver'])
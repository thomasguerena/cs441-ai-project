module.exports = function (grunt) {

	grunt.initConfig({

		// Compile SASS
		sass: {
			dist: {
				files: { 'style/main.css': 'style/sass/main.scss' }
			}
		},

		// Watch
		watch: {
			options: { spawn: false },
			// Recompile sass
			sass: {
				files: ['style/sass/*.scss'],
				tasks: ['sass']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['sass']);

	grunt.event.on('watch', function (action, filepath, target) {
		grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
	});
};
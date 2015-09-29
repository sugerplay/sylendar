module.exports = function(grunt) {
  'use strict';
  
  // configure
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
			dist: {
				src: [
					'src/intro.js',
					'src/date.js',
					'src/core.js',
					'src/outro.js'
				],
				dest: 'dist/build.js',
			}
		},
    uglify: {
      build: {
        files: {
          'dist/build.min.js': ['dist/build.js']
        }
      }
    }
  });

  // 플러그인 등록
  require('load-grunt-tasks')(grunt);

  // 작업 등록
  grunt.registerTask('default', ['concat', 'uglify']);
};
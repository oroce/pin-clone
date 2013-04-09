"use strict";

module.exports = function(grunt) {
	console.log( process.env );
	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON("package.json"),
		banner: "/*! <%= pkg.name %> - v<%= pkg.version %> - " +
			"<%= grunt.template.today('yyyy-mm-dd') %>\n" +
			"<%= pkg.homepage ? '* ' + pkg.homepage + '\\n' : '' %>" +
			"* Copyright (c) <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>;" +
			" Licensed <%= _.pluck(pkg.licenses, 'type').join(', '') %> */\n",
		// Task configuration.
		uglify: {
			options: {
				//banner: "<%= banner %>"
			},
			dist: {
				src: "./build/<%= pkg.name %>-<%= pkg.version %>.js",
				dest: "./build/<%= pkg.name %>-<%= pkg.version %>.min.js",
			},
		},
		jshint: {
			options: {
				jshintrc: ".jshintrc"
			},
			gruntfile: {
				src: "Gruntfile.js"
			},
			lib: {
				options: {
					jshintrc: "./.jshintrc"
				},
				src: ["lib/**/*.js"]
			},
			test: {
				src: ["test/**/*.js"]
			},
		},
		s3: {
			options: {
				key: process.env.S3_KEY,
				secret: process.env.S3_SECRET,
				bucket: "pin-clone",
				gzip: true,
				region: "us-standard"
			},
			build: {
				upload: [
					{
						src: "./build/<%= pkg.name %>-<%= pkg.version %>.min.js",
						dest: "static/<%= pkg.name %>-<%= pkg.version %>.min.js"
					}
				]
			}
		},
		browserify2: {
			compile: {
				compile: "./build/<%= pkg.name %>-<%= pkg.version %>.js",
				entry: "./public/js/main.js",
				require: true
			}
	}
	});

	// These plugins provide necessary tasks.

	grunt.loadNpmTasks( "grunt-contrib-uglify" );
	grunt.loadNpmTasks( "grunt-contrib-jshint" );
	grunt.loadNpmTasks( "grunt-browserify2" );
	grunt.loadNpmTasks( "grunt-s3");
	// Default task.
	//grunt.registerTask("default", ["jshint", "nodeunit", "concat", "uglify"]);

	grunt.registerTask( "build", [ "jshint", "browserify2:compile", "uglify:dist", "s3:build"])

};

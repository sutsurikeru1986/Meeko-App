module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
        
        //bundle multiple js files together
        concat: {   
            dist: {
                src: [
                    'js/meekoApp.js'  
                ],
                dest: 'js/meeko-production.js',
            }
        },  
        
        //Minify/Uglify the concataneted JS file above
        uglify: {
            build: {
                src: 'js/meeko-production.js',
                dest: 'js/meeko-production.min.js'
            }
        },  
        
        //SASS compile
		sass: {
			dist: {
				files: {
					'css/style.css' : 'css/style.scss'
				}
			}
		},
        
        //cssmin: {
        //  options: {
        //    shorthandCompacting: false,
        //    roundingPrecision: -1
        //  },
        //  target: {
        //    files: {
        //      'css/meeko.min.css': ['css/styles.css', 
        //                            'css/foundation.custom.min.css',
        //                            'css/normalize.css',
        //                            'css/owl.carousel.css',
        //                            'css/owl.theme.css',
        //                            'css/owl.transitions.css']
        //    }
        //  }
        //} ,       
        
        //tasks to watch
		watch: {
			css: {
				files: '**/*.scss',
				tasks: ['sass']
			},
            scripts: {
                files: '**/*.js',
                tasks: ['uglify']
            }
            //mincss: {
            //    files: '**/*.css',
			//	tasks: ['cssmin']
            //}
		},
        
        //enables you to run multiple tasks at the same time :D
        concurrent: {
            css: ['sass'],
            scripts: ['uglify']
            //mincss: ['cssmin']
        }
	});
    
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');
	grunt.registerTask('default', ['concurrent:css', 'concurrent:scripts', 'concat', 'watch']);
}
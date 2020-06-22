// 实现这个项目的构建任务

module.exports = grunt => {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    sass: {
      dist:{
        options: {
          style: 'compressed'
        },
        files: [{
          expand:true,
          cwd: './src/assets/styles',
          src: ['*.scss'],
          dest: './dist/assets/styles',
          ext:'.css'
        },
        {
          expand:true,
          cwd: './src/assets/styles',
          src: ['*.scss'],
          dest: './temp/assets/styles',
          ext:'.css'
        }]
      }
    },
    clean: {
      main: ['dist','temp'],
      assets: ['assets']
    },
    babel: {
      dist: {
        options:{
          sourceMap: false,
          presets:['@babel/preset-env']
        },
        files: [{
          expand:true,
          cwd: './src/assets/scripts',
          src: ['*.js'],
          dest: './temp/assets/scripts',
          ext:'.js'
        }]
      }
    },
    uglify: {
      my_target: {
        files: [{
          expand:true,
          cwd: './temp/assets/scripts',
          src: ['*.js'],
          dest: './dist/assets/scripts',
          ext:'.js'
        }]
      }
    },
    imagemin: {
      dynamic: {
        files:[{
          expand:true,
          cwd:'./dist/assets/images',
          src:['**/*'],
          dest:'./dist/assets/images'
        }]
      }
    },
    swigtemplates: {
      options: {
        templatesDir: './src' //类似于gulp中base属性，不然文件夹结构会混乱
      },
      development: {
        dest:'temp/',
        src: ['./src/**/*.html']
      },
      build: {
        dest:'dist/',
        src: ['./src/**/*.html']
      }
    },
    htmlmin: {
      dist:{ 
        options: {
          removeComments: true,
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true
        },
        files: [{
          expand:true,
          cwd: './dist',
          src: ['*.html'],
          dest: './dist',
          ext:'.html'
        }]
      }
    },
    watch: {
      css: {
        files: ['./src/assets/styles/*.scss'],
        tasks: ['sass']
      },
      js: {
        files: ['./src/assets/scripts/*.js'],
        tasks:['babel']
      },
      html: {
        files: ['./src/**/*.html'],
        tasks:['swigtemplates']
      }
    },
    browserSync: {
      dev: {
        bsFiles: {
          src : [
              'temp/*.html',
              'temp/assets/*.js',
              'temp/assets/*.css'
          ]
        },
        options: {
          files:'./temp',
          server: {
            baseDir: './temp',
            routes: {
              "/node_modules": "./node_modules"
            }
          },
          notify: false,
          watchTask: true
        }
      }
    },
    useref: {
      html: './dist/**/*.html',
      temp: '.'
    },
    copy: {
      main: {
        files:[
          {expand: true, src: ['./assets/**/vendor.js'], dest:'./dist'},
          {expand: true, src: ['./assets/**/vendor.css'], dest:'./dist'}
        ]
      },
      fonts: {
        files: [
          {expand: true, src: ['./src/assets/fonts/*'], dest:'./dist/assets/fonts/',filter: 'isFile',flatten: true},
        ]
      },
      images: {
        files: [
          {expand: true, src: ['./src/assets/images/*'], dest:'./dist/assets/images/',filter: 'isFile',flatten: true},
        ]
      },
      public: {
        files: [
          {expand: true, src: ['./public/**/*'], dest:'./dist',filter: 'isFile'},
        ]
      }
    }
  })

  grunt.registerTask('compile',['clean:main','sass','babel','uglify','swigtemplates'])
  grunt.registerTask('build',['compile','useref','concat','uglify','cssmin','copy','htmlmin','clean:assets']);
  grunt.registerTask('dev',['compile','browserSync','watch']);
}
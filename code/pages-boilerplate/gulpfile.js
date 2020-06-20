// 实现这个项目的构建任务

const del = require('del');
const browserSync = require('browser-sync').create();

const { src, dest, series,parallel,watch} = require('gulp');

const loadPlugins = require('gulp-load-plugins'); //导出方法

const plugins = loadPlugins(); //对象，插件是属性

/**
 * 文件处理事件
 */
const fonts = () => {
  return src('./src/assets/fonts/**',{base: 'src'})
  .pipe(plugins.imagemin())
  .pipe(dest('dist'))
}

const image = () => {
  return src('./src/assets/images/**',{base: 'src'})
  .pipe(plugins.imagemin())
  .pipe(dest('dist'))
}

const css = () => {
  return src('./src/assets/styles/*.scss',{base: 'src'})
  .pipe(plugins.sass()) //编译sass
  .pipe(plugins.cleanCss({ compatibility: 'ie8' })) //兼容至IE8+
  .pipe(dest('temp'))
  .pipe(browserSync.reload({stream: true}))
}

const script = () => {
  return src('./src/assets/scripts/*.js',{base: 'src'})
  .pipe(plugins.babel({
    presets: ['@babel/env']
  }))
  .pipe(plugins.jsmin())
  .pipe(dest('temp'))
  .pipe(browserSync.reload({stream: true}))
}

const html = () => {
  return src('./src/**/*.html',{base: 'src'})
  .pipe(plugins.swig())
  // .pipe(plugins.htmlmin({ collapseWhitespace: true })) //坑···亲测html的压缩必须在useref中进行···否则会冲突···
  .pipe(dest('temp'))
  .pipe(browserSync.reload({stream: true}))
}

const others = () => {
  return src('./public/**',{base: 'public'})
  .pipe(dest('dist'))
}

/**
 * 自定义任意事件
 */
const clean = () => {
  return del(['dist','temp']);
}

const server = () => {
  watch('./src/assets/styles/*.scss',css)
  watch('./src/assets/scripts/*.js',script)
  watch('./src/**/*.html',html)
  watch(['./src/assets/fonts/**','./src/assets/images/**','./public/**'],browserSync.reload)
  browserSync.init({
    server: {
      baseDir: ['temp','src','public'],
      routes:{
        '/node_modules' : "node_modules"
      }
    },
    port: 8080,
    notify: false
  })
}

const useref = () => {
  return src('temp/*.html')
  .pipe(plugins.useref({ searchPath: ['temp','.']}))
  .pipe(plugins.if(/\.js$/,plugins.jsmin()))
  .pipe(plugins.if(/\.css$/,plugins.cleanCss()))
  .pipe(plugins.if(/\.html$/,plugins.htmlmin({ 
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true
  })))
  .pipe(dest('dist'))
}

const compile = parallel(css,script,html); //dev和build都需要做的对文件的编译和压缩

const build = series(clean,parallel(compile,others,image,fonts),useref); //最大化build构建

const dev = series(compile,server);//最简化dev构建

module.exports = {
  clean,
  build,
  dev,
}
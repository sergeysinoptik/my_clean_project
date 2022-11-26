import gulp from 'gulp'; // Подключаем Gulp
import fs from 'fs';
import dartSass from 'sass';
import gulpSass from 'gulp-sass'; // Подключаем Sass
import bulk from 'gulp-sass-bulk-importer';
//import autoprefixer from 'gulp-autoprefixer'; // Подключаем библиотеку для автоматического добавления префиксов
import autoprefixer from 'autoprefixer';
import concat from 'gulp-concat'; // Подключаем пакет для конкатенации файлов
import clean from 'gulp-clean-css';
import map from 'gulp-sourcemaps';
import browserSync from 'browser-sync'; // Подключаем Browser Sync
import uglify from 'gulp-uglifyjs'; // Подключаем пакет для сжатия JS
import cssnano from 'gulp-cssnano'; // Подключаем пакет для минификации CSS
import rename from 'gulp-rename'; // Подключаем библиотеку для переименования файлов
import del from 'del'; // Подключаем библиотеку для удаления файлов и папок
import imagemin from 'gulp-imagemin'; // Подключаем библиотеку для работы с изображениями
import pngquant from 'imagemin-pngquant'; // Подключаем библиотеку для работы с png
import cache from 'gulp-cache'; // Подключаем библиотеку кеширования
import babel from 'gulp-babel';
import include from 'gulp-file-include';
import changed from 'gulp-changed';
import recompress from 'imagemin-jpeg-recompress';
import plumber from 'gulp-plumber';
import webpConv from 'gulp-webp';
import multiDest from 'gulp-multi-dest';
import svgmin from 'gulp-svgmin';
import svgCss from 'gulp-svg-css-pseudo';
import sprite from 'gulp-svg-sprite';
import ttf2woff2 from 'gulp-ttftowoff2';
import ttf2woff from 'gulp-ttf2woff';
import chalk from 'chalk'; // Раскрашиваем консоль при ошибке
import postcss from 'gulp-postcss';
import tailwindcss from 'tailwindcss';
import gcmq from 'gulp-group-css-media-queries'; //del
import modifyCssUrls from 'gulp-modify-css-urls'; //del
import rebase from 'gulp-css-url-rebase'; //del
import mmq from 'gulp-merge-media-queries'; //del
import cmq from 'gulp-combine-media-queries'; //del
import jmq from 'gulp-join-media-queries';  //del
import g from 'gulp-extract-media-queries'; //del
import splitMediaQueries from 'gulp-split-media-queries'; //del
import combineMedia from 'gulp-combine-media';

const {
  src, dest, parallel, series, watch,
} = gulp;

const sass = gulpSass(dartSass);

const paths = {
  browserSyncBaseDir: 'docs',
  map: '../sourcemaps/',
  css: {
    src: ['app/scss/**/*.scss', '!app/scss/libs.scss'],
    dest: './docs/css',
  },
  cssLibs: {
    src: 'app/scss/libs.scss',
    dest: './docs/css',
  },
  devJs: {
    src: [
      'app/components/**/*.js',
      'app/js/01_main.js',
    ],
    dest: 'docs/js/',
  },
  libJs: {
    src: [ // Берем все необходимые библиотеки
      'app/libs/jquery/dist/jquery.min.js',
      'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js',
      'app/libs/slick-carousel/slick/slick.min.js',
      'app/libs/jquery-touchswipe/jquery.touchSwipe.js',
    ],
    dest: 'docs/js/',
  },
  html: {
    src: [
      'app/**/*.html',
      '!app/components/**/*.html',
    ],
    basepath: 'app/components/',
    dest: 'docs',
  },
  php: {
    src: 'app/**/*.php',
    basepath: 'app/components/',
    dest: 'docs',
  },
  img: {
    srcRastr: 'app/img/**/*.+(png|jpg|jpeg|gif|svg|ico)',
    srcWebp: 'docs/img/**/*.+(png|jpg|jpeg)',
    srcSvgCss: 'app/svg/css/**/*.svg',
    changed: 'docs/img',
    dest: 'docs/img',
    multiDest: ['app/img', 'docs/img'],
  },
  svg: {
    src: 'app/svg/css/**/*.svg',
    spriteSrc: 'app/svg/**/*.svg',
    dest: 'app/scss/global',
    sprite: '../sprite.svg',
    spriteDest: 'app/img',
  },
};

const processors = [
  tailwindcss,
  autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }),
];

// Тестирование GULP
gulp.task('hello', () => {
  console.log('Hello Gulp');
});

// Browser Sync
gulp.task('browser-sync', () => {
  browserSync({
    server: {
      baseDir: paths.browserSyncBaseDir, // Директория для сервера
    },
    notify: false,
    online: true, // Отключаем уведомления
  });
});

// CSS
gulp.task('sass', () => src(paths.css.src) // выбираем папку
  .pipe(map.init()) // Инициализировать sourcemaps
  .pipe(bulk()) // чтобы scss-файлы можно было импортировать не по одному, а целыми директориями
  .pipe(concat('style.scss'))
  .pipe(sass({
    outputStyle: 'expanded',
  }).on('error', sass.logError))
  .pipe(postcss(processors))
  .pipe(rename('style.css'))
  .pipe(map.write(paths.map)) // Записать карту исходных файлов в получившемся файле
  .pipe(dest(paths.css.dest)) // выгружаем в прод
  .pipe(browserSync.reload({ stream: true })));

gulp.task('sassFinal', () => src(paths.css.src) // выбираем папку
  .pipe(map.init()) // Инициализировать sourcemaps
  .pipe(bulk()) // чтобы scss-файлы можно было импортировать не по одному, а целыми директориями
  .pipe(concat('style.min.scss'))
  .pipe(sass({
    outputStyle: 'expanded',
  }).on('error', sass.logError))
  .pipe(postcss(processors))
  .pipe(clean({
    level: 2,
  })) // Очистить от лишнего
  .pipe(rename('style.min.css'))
  .pipe(map.write(paths.map)) // Записать карту исходных файлов в получившемся файле
  .pipe(dest(paths.css.dest)) // выгружаем в прод
  .pipe(browserSync.reload({ stream: true })));

// CSS Libs
gulp.task('css-libs', () => src(paths.cssLibs.src) // Выбираем файл для минификации. Предварительно устанавливаем библиотеки с помощью bower и импортируем нужное в файл libs.scss. Например 'bower i jquery'
  .pipe(map.init())
  .pipe(sass({
    outputStyle: 'compressed',
  }).on('error', sass.logError))
  .pipe(cssnano()) // Сжимаем
  .pipe(rename({ suffix: '.min' })) // Добавляем суффикс .min
  .pipe(map.write(paths.map))
  .pipe(dest(paths.cssLibs.dest)) // Выгружаем в прод
  .pipe(browserSync.reload({ stream: true }))); // обновляем браузер

gulp.task('devJs', () => src(paths.devJs.src)
  .pipe(map.init())
  //.pipe(uglify())
  .pipe(concat('main.min.js'))
  .pipe(map.write(paths.map))
  .pipe(dest(paths.devJs.dest))
  .pipe(browserSync.reload({ stream: true })));

gulp.task('libJs', () => src(paths.libJs.src)
  .pipe(map.init())
  .pipe(uglify())
  .pipe(concat('libs.min.js'))
  .pipe(map.write(paths.map))
  .pipe(dest(paths.libJs.dest))
  .pipe(browserSync.reload({ stream: true })));

gulp.task('buildJs', () => src(paths.devJs.src)
  //.pipe(uglify())
  .pipe(babel({
    presets: ['@babel/env'],
  }))
  .pipe(concat('main.min.js'))
  .pipe(dest(paths.devJs.dest))
  .pipe(browserSync.reload({ stream: true })));

// Обработка HTML
gulp.task('html', () => src(paths.html.src) // собираем файлы для отслеживания
  .pipe(include({
    basepath: paths.html.basepath,
  }))
  .pipe(dest(paths.html.dest))
  .pipe(browserSync.reload({ stream: true })));

// Обработка PHP
gulp.task('php', () => src(paths.php.src)
  .pipe(include({
    basepath: paths.php.basepath,
  }))
  .pipe(dest(paths.php.dest))
  .pipe(browserSync.reload({ stream: true })));

// Обработка растровых изображений - delete
gulp.task('img', () => src('app/img/**/*') // Берем все изображения из app
  .pipe(cache(imagemin({ // Сжимаем их с наилучшими настройками с учетом кеширования
    interlaced: true,
    progressive: true,
    svgoPlugins: [{ removeViewBox: false }],
    use: [pngquant()],
  })))
  .pipe(dest('docs/img'))); // Выгружаем в продакшен

gulp.task('rastr', () => src(paths.img.srcRastr)
  .pipe(plumber())
  .pipe(changed(paths.img.changed))
  .pipe(imagemin(
    {
      interlaced: true,
      progressive: true,
      optimizationLevel: 5,
    },
    [
      recompress({
        loops: 6,
        min: 50,
        max: 90,
        quality: 'high',
        use: [pngquant({
          quality: [0.8, 1],
          strip: true,
          speed: 1,
        })],
      }),
      // imagemin.gifsicle(),
      // imagemin.optipng(),
      // imagemin.svgo(),
    ],
  ))
  .pipe(dest(paths.img.dest))
  .pipe(browserSync.reload({ stream: true })));

gulp.task('webp', () => src(paths.img.srcWebp)
  .pipe(plumber())
  .pipe(changed(paths.img.changed, {
    extension: '.webp',
  }))
  .pipe(webpConv())
  .pipe(multiDest(paths.img.multiDest))
  .pipe(browserSync.reload({ stream: true }))); // обновляем браузер

gulp.task('svgcss', () => src(paths.svg.src)
  .pipe(svgmin({
    plugins: [{
      removeComments: true,
    },
    {
      removeEmptyContainers: true,
    },
    ],
  }))
  .pipe(svgCss({
    fileName: '_svg',
    fileExt: 'scss',
    cssPrefix: '--svg__',
    addSize: false,
  }))
  .pipe(dest(paths.svg.dest)));

gulp.task('svgsprite', () => src(paths.svg.spriteSrc) // More: https://habr.com/ru/post/560894/
  .pipe(svgmin({
    plugins: [{
      removeComments: true,
    },
    {
      removeEmptyContainers: true,
    },
    ],
  }))
  .pipe(sprite({
    mode: {
      stack: {
        sprite: paths.svg.sprite,
      },
    },
  }))
  .pipe(dest(paths.svg.spriteDest)));

gulp.task('ttf', (done) => {
  src('app/fonts/**/*.ttf')
    .pipe(changed('docs/fonts', {
      extension: '.woff2',
      hasChanged: changed.compareLastModifiedTime,
    }))
    .pipe(ttf2woff2())
    .pipe(dest('docs/fonts'));

  src('app/fonts/**/*.ttf')
    .pipe(changed('docs/fonts', {
      extension: 'woff',
      hasChanged: changed.compareLastModifiedTime,
    }))
    .pipe(ttf2woff())
    .pipe(dest('docs/fonts'));

  done();
});

const srcFonts = 'src/scss/_local-fonts.scss';
const appFonts = 'build/fonts/';

gulp.task('fonts', (done) => { // https://habr.com/ru/post/560894/
  fs.writeFile(srcFonts, '', () => {});
  fs.readdir(appFonts, (err, items) => {
    if (items) {
      let cFontname;
      for (let i = 0; i < items.length; i += 1) {
        let fontname = items[i].split('.');
        let fontExt;
        fontExt = fontname[1];
        fontname = fontname[0];
        if (cFontname !== fontname) {
          if (fontExt === 'woff' || fontExt === 'woff2') {
            fs.appendFile(srcFonts, `@include font-face("${fontname}", "${fontname}", 400);\r\n`, () => {});
            console.log(chalk`
{bold {bgGray Added new font: ${fontname}.}
----------------------------------------------------------------------------------
{bgYellow.black Please, move mixin call from {cyan src/scss/_local-fonts.scss} to {cyan src/scss/_fonts.scss} and then change it!}}
----------------------------------------------------------------------------------
`);
          }
        }
        cFontname = fontname;
      }
    }
  });
  done();
});

// Следим за изменениями в файлах и запускаем соответствующую задачу при каждом изменении
gulp.task('watch', () => {
  watch('app/**/*.html', parallel('html', 'sass')); // Наблюдение за HTML
  watch('app/**/*.php', parallel('php')); // Наблюдение за PHP
  watch('app/**/*.scss', parallel('sass', 'css-libs')); // Наблюдение за CSS
  watch('app/**/*.js', parallel('libJs', 'devJs')); // Наблюдение за JS
  watch('app/**/*.json', parallel('html'));
  watch('app/img/**/*.+(png|jpg|jpeg|gif|svg|ico)', parallel('rastr'));
  watch('docs/img/**/*.+(png|jpg|jpeg)', parallel('webp'));
  watch('app/svg/css/**/*.svg', series('svgcss', 'sass'));
  watch('app/svg/sprite/**/*.svg', series('svgsprite', 'rastr'));
  watch('app/fonts/**/*.ttf', series('ttf', 'fonts'));
});

// Удаляем папку docs перед сборкой
gulp.task('clean', async () => del.sync('docs/**/*'));

// Подзадачи сборки
// gulp.task('buildCss', series('css-libs', 'sass'));

// gulp.task('buildFonts', () => src('app/fonts/**/*') // Переносим шрифты в продакшен
//  .pipe(dest('docs/fonts')));

// gulp.task('buildJs', () => src('app/js/**/*') // Переносим скрипты в продакшен
//  .pipe(dest('docs/js')));

// Сборка проекта
gulp.task('build', parallel('clean', 'css-libs', 'sass', 'libJs', 'buildJs', 'rastr', 'webp', 'svgcss', 'svgsprite', 'ttf', 'fonts', 'html'));

gulp.task('predef', series('html', 'css-libs', 'sass', 'libJs', 'devJs', 'rastr', 'webp', 'svgcss', 'svgsprite', 'ttf', 'fonts', 'browser-sync'));

gulp.task('predefFinal', series('css-libs', 'sassFinal', 'libJs', 'devJs', 'rastr', 'webp', 'svgcss', 'svgsprite', 'ttf', 'fonts', 'html', 'browser-sync'));

gulp.task('final', parallel('predefFinal', 'watch'));

// Запуск по дефолту 'gulp'
gulp.task('default', parallel('predef', 'watch'));

// Очистить кэш GULP
gulp.task('clear', () => cache.clearAll());

/**
 * Created by viclu on 2016/12/8.
 */
// 引用 gulp plugin
var gulp = require('gulp'),                       // 載入 gulp
    connect = require('gulp-connect'),            // 載入 gulp-connect
    watch = require('gulp-watch'),                // 載入 gulp-watch
    concat = require('gulp-concat'),              // 載入 gulp-concat
    uglify = require('gulp-uglify'),              // 載入 gulp-uglify
    sass = require('gulp-sass'),                  // 載入 gulp-sass
    imagemin = require('gulp-imagemin'),          // 載入 gulp-imagemin
    rename = require('gulp-rename'),              // 載入 gulp-rename
    notify = require('gulp-notify'),              // 載入 gulp-notify
    plumber = require('gulp-plumber'),            // 載入 gulp-plumber
    livereload = require('gulp-livereload'),      // 載入 gulp-livereload
    autoprefixer = require('gulp-autoprefixer'),  // 載入 gulp-autoprefixer
    sourcemaps = require('gulp-sourcemaps');      // 載入 gulp-autoprefixer

// Paths
var paths = {
    'js': './source/js/',
    'sass': './source/scss/',
    'img': './source/images/',
    'public': './public/'
};

gulp.task('server', function() {
    connect.server({
        livereload: true
    });
});

gulp.task('livereload', function () {
    return gulp.src(['**/*.css', '**/*.js', '**/*.html'])
        .pipe(watch(['**/*.css', '**/*.js', '**/*.html']))
        .pipe(connect.reload());
});

// JS處理
gulp.task('script', function () {
    return gulp.src(paths.js + './*.js')         // 指定要處理的原始 JavaScript 檔案目錄
        .pipe(plumber())                         // 使用 gulp-plumber 處理例外
        .pipe(concat('index.js'))                // 合併成一隻 index.js
        .pipe(uglify())                          // 將 JavaScript 做最小化
        .pipe(rename({ suffix: '.min' }))        // 檔名變更(增加後綴.min)
        .pipe(gulp.dest(paths.public + './js'))  // 指定最小化後的 JavaScript 檔案目錄
        .pipe(notify({ message: 'script task complete' }))  // 處理結束通知訊息
        .pipe(livereload());                     // 當檔案異動後自動重新載入頁面
});

// CSS處理
gulp.task('styles', function () {
    return gulp.src(paths.sass + './*.scss')      // sass 來源路徑
        .pipe(plumber())                          // 使用 gulp-plumber 處理例外
        .pipe(sourcemaps.init())                  // Initializes sourcemaps
        .pipe(sass({ outputStyle: 'nested' }).on('error', sass.logError))     // scss -> css 轉譯
        .pipe(autoprefixer({ browsers: ['last 2 version']}))                  // autoprefixer前綴
        .pipe(rename({ suffix: '.min' }))         // 檔名變更(增加後綴.min)
        .pipe(sourcemaps.write('./', {includeContent: false, sourceRoot: paths.sass + './*.scss'}))
        // 寫入sourcemaps到當前資料夾(以下下列dest(paths.public + './css')為基準點，sourceRoot：以匯出的資料夾為基準點找原本的scss資料夾位置
        .pipe(gulp.dest(paths.public + './css'))
        .pipe(notify({ message: 'styles task complete' }))                    // 處理結束通知訊息
        .pipe(livereload());                      // 當檔案異動後自動重新載入頁面
});

// 圖片處理
gulp.task('image', function () {
    return gulp.src(paths.img + './*.{jpg,jpeg,png,gif}') // 圖檔來源路徑
        .pipe(imagemin())                                 // 壓縮圖檔
        .pipe(rename({ suffix: '.min' }))                 // 檔名變更(增加後綴.min)
        .pipe(gulp.dest(paths.public + './images'))
        .pipe(notify({ message: 'image task complete' })) // 處理結束通知訊息
        .pipe(livereload());                              // 當檔案異動後自動重新載入頁面
});

// watch監視
gulp.task('watch', function () {
    gulp.watch(paths.js + './*.js', ['script']);
    gulp.watch(paths.sass + './*.scss', ['styles']);
    gulp.watch(paths.img + './*.{jpg,jpeg,png,gif}', ['image']);
    livereload.listen();
});

// 自訂gulp流程
gulp.task('default', ['script','styles','image','server','livereload','watch']);

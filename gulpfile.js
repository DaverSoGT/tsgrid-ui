/* eslint-env node */
/* tsgrid-ui 1.0 — bundler ownership: Less/icons/locales = gulp; JS bundle = tsup (see tsup.config.ts). */
const gulp     = require('gulp')
const header   = require('gulp-header')
const less     = require('gulp-less')
const cleanCSS = require('gulp-clean-css')
const concat   = require('gulp-concat')
const rename   = require('gulp-rename')
const replace  = require('gulp-replace')
const del      = require('del')
const comments = {
    tsgrid : '/* tsgrid-ui 1.0.x (nightly) ('+ (new Date()).toLocaleString('en-us') +') (c) 2014 vitmalina@gmail.com, (c) 2026 DaverSoGT — MIT */\n'
}

let tasks = {

    clean(cb) {
        let files = [
            'dist/tsgrid-ui.js',
            'dist/tsgrid-ui.min.js',
            'dist/tsgrid-ui.css',
            'dist/tsgrid-ui.min.css',
            'dist/grid.css',
            'dist/form.css',
            'dist/tooltip.css',
            'dist/popup.css',
            'dist/sidebar.css',
            'dist/tabs.css',
            'dist/toolbar.css',
            'dist/layout.css',
            'dist/field.css',
        ]
        return del(files)
    },

    less(cb) {
        const out = process.env.TSGRID_CSS_OUT || 'dist/'
        return gulp
            .src(['src/less/*.less'])
            .on('error', function (err) {
                console.log(err.toString())
                this.emit('end')
            })
            .pipe(less())
            .pipe(header(comments.tsgrid))
            .pipe(gulp.dest(out))
            .pipe(cleanCSS())
            .pipe(rename({ suffix: '.min' }))
            .pipe(header(comments.tsgrid))
            .pipe(gulp.dest(out))
    },

    widgets(cb) {
        const out = process.env.TSGRID_CSS_OUT || 'dist/'
        const WIDGET_ENTRIES = [
            'src/less/entries/grid.less',
            'src/less/entries/form.less',
            'src/less/entries/tooltip.less',
            'src/less/entries/popup.less',
            'src/less/entries/sidebar.less',
            'src/less/entries/tabs.less',
            'src/less/entries/toolbar.less',
            'src/less/entries/layout.less',
            'src/less/entries/field.less',
        ]
        return gulp.src(WIDGET_ENTRIES, { base: 'src/less/entries' })
            .on('error', function (err) {
                console.log(err.toString())
                this.emit('end')
            })
            .pipe(less())
            .pipe(header(comments.tsgrid))
            .pipe(gulp.dest(out))
    },

    watch(cb) {
        // JS bundling removed from gulp watch — use `npm run dev` (tsup --watch) for JS changes
        gulp.watch(['src/less/**/*.less'], tasks.less)
    },

    locales(cb) {
        const fs = require('fs')
        const path = require('path')
        const isPrimitive = obj => obj === null || [ 'string', 'number', 'boolean' ].includes( typeof obj )
        const isArrayOfPrimitive = obj => Array.isArray( obj ) && obj.every( isPrimitive )
        const format = arr =>
            `^^^[ ${
                arr.map( val => JSON.stringify( val ) ).join( ', ' )
            } ]`
        const replacer = ( key, value ) => isArrayOfPrimitive( value ) ? format( value ) : value
        const expand = str => str.replace(
            /(?:"\^\^\^)(\[ .* \])(?:\")/g, ( match, a ) =>
                a.replace( /\\"/g, '"' )
        )
        const stringify = (obj, space=4) => expand( JSON.stringify( obj, replacer, space ) )

        return gulp.src(['src/w2locale.js'])
            .pipe(replace(/^export {/gm, 'module.exports = {'))
            .pipe(concat('w2locale.cjs'))
            .pipe(gulp.dest('src/'))
            .on('end', () => {
                process_locales()
                del('./src/w2locale.cjs')
                cb()
            })

        function process_obj(m, o) {
            Object.keys(o).forEach(k => {
                if (typeof m[k] === 'undefined') delete o[k]
            })
            for (const [k, v] of Object.entries(m)) {
                if (typeof o[k] === 'undefined') o[k] = v
                if (typeof v === 'object' && Object.keys(o[k]).length) o[k] = process_obj(v, o[k])
            }
            return Object.assign(m, o)
        }

        function process_locales() {
            const master = require('./src/w2locale.cjs').w2locale
            const dir_locales = './src/locale'
            fs.readdir(dir_locales, (err, files) => {
                files.forEach(file => {
                    let m = JSON.parse(JSON.stringify(master))
                    let filepath = path.join(dir_locales, file)
                    let o = JSON.parse( fs.readFileSync(filepath) )
                    fs.writeFileSync(filepath, stringify(process_obj(m, o)) + '\n')
                })
            })
        }
    },
}

// Gulp owns: clean, less, locales, watch (Less only).
// JS bundling lives in tsup.config.ts (driven by `pnpm build:js`).
// gulp-iconfont removed in v2.14.0 — icons are now static SVG data URIs in icons.less.
exports.default = gulp.series(tasks.clean, tasks.less, tasks.widgets)
exports.dev     = tasks.watch
exports.clean   = tasks.clean
exports.less    = gulp.series(tasks.less, tasks.widgets)
exports.locales = tasks.locales
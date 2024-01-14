import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import html from '@web/rollup-plugin-html';
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';
import { terser } from 'rollup-plugin-terser';
import { generateSW } from 'rollup-plugin-workbox';
import path from 'path';
import { rollup } from 'rollup'
import { config } from 'process'
import copy from 'rollup-plugin-copy';
// GET http://192.168.1.230:8001/assets/Washing.mp4 404 (Not Found) -- why are those assets not available on the server, is assets not included in the build script? i guess this "build": "rimraf dist && rollup -c rollup.config.js && npm run analyze -- --exclude dist", doesnt include the assets folder?
// "Depends on how the static asset is configured. By default lit does not include static assets in the build process"
// Action Items:
// - go back to the build script in thae package.json
// - go to the rollup.config.js
// - in the config, "to add static assets, such as images, stylesheets, javascript files, etc with rollup, you can use plugins like rollup-plugin-copy, or rollup-plugin-assets . First you install the rollup-plugin-copy plugin using your preferred package manager, npm intsall --save etc, then in your rollup.config.js you import {copy} and you put copy...

export default {
  input: 'index.html',
  output: {
    entryFileNames: '[hash].js',
    chunkFileNames: '[hash].js',
    assetFileNames: '[hash][extname]',
    format: 'es',
    dir: 'dist',
  },
  preserveEntrySignatures: false,

  plugins: [
    /** Enable using HTML as rollup entrypoint */
    html({
      minify: true,
      injectServiceWorker: true,
      serviceWorkerPath: 'dist/sw.js',
    }),
    /** Resolve bare module imports */
    nodeResolve(),
    /** Minify JS */
    terser(),
    /** Bundle assets references via import.meta.url */
    importMetaAssets(),
    /** Compile JS to a lower language target */
    babel({
      babelHelpers: 'bundled',
      presets: [
        [
          require.resolve('@babel/preset-env'),
          {
            targets: [
              'last 3 Chrome major versions',
              'last 3 Firefox major versions',
              'last 3 Edge major versions',
              'last 3 Safari major versions',
            ],
            modules: false,
            bugfixes: true,
          },
        ],
      ],
      plugins: [
        [
          require.resolve('babel-plugin-template-html-minifier'),
          {
            modules: { lit: ['html', { name: 'css', encapsulation: 'style' }] },
            failOnError: false,
            strictCSS: true,
            htmlMinifier: {
              collapseWhitespace: true,
              conservativeCollapse: true,
              removeComments: true,
              caseSensitive: true,
              minifyCSS: true,
            },
          },
        ],
      ],
    }),
    /** Create and inject a service worker */
    generateSW({
      navigateFallback: '/index.html',
      // where to output the generated sw
      swDest: path.join('dist', 'sw.js'),
      // directory to match patterns against to be precached
      globDirectory: path.join('dist'),
      // cache any html js and css by default
      globPatterns: ['**/*.{html,js,css,webmanifest}'],
      skipWaiting: true,
      clientsClaim: true,
    }),
    copy({
      targets: [
        { src: 'assets/*', dest: 'dist/assets' }
      ]
    })
  ],
};

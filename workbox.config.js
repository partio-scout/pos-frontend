module.exports = {
  globDirectory: './build/',
  globPatterns: ['**/*.{html,js,css,png,jpg,json}'],
  globIgnores: [
    'service-worker-default.js',
    'service-worker.js',
    'workbox-sw.js',
    'index.html',
  ],
  swSrc: './src/service-worker-template.js',
  swDest: './build/service-worker-default.js',
}

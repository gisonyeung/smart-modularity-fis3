// Karma configuration
// Generated on Wed Aug 09 2017 15:11:07 GMT+0800 (中国标准时间)

var webpackConfig = require('../webpack.test.config.js');

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      'specs/*.spec.js'
    ],
    preprocessors: {
      'specs/*.spec.js': ['webpack', 'sourcemap']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    reporters: ['spec', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['Chrome'],
    singleRun: true, // if true, Karma captures browsers, runs the tests and exits
    concurrency: Infinity,
    coverageReporter: {
      dir: './coverage',
      reporters: [
        { type: 'lcov', subdir: '.' },
        { type: 'text-summary' }
      ]
    }
  })
}

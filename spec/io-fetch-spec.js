/* eslint-disable no-console */

var fetch = require('../src/index');
var metrics = require('legion-metrics');

describe('The fetch module for legion Io', function() {
  it('is sane', function(done) {
    fetch.text('http://demo6.webperformance.com')
         .chain(console.log)
         .run(metrics.Target.create(metrics.merge).receiver()).then(function() {
           done();
         },
    function(problem) {
      done.fail(problem);
    });
  });
});


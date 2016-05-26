/* eslint-disable no-console */

var fetch = require('../src/index');
var metrics = require('legion-metrics');
var obstacle = require('legion-obstacle-course');

describe('The fetch module for legion Io', function() {
  beforeEach(function() {
    this.port = 5000;
    this.server = obstacle.listen(this.port);
    this.host = 'http://localhost:' + this.port;
  });

  afterEach(function() {
    this.server.close();
  });

  it('is sane', function(done) {
    fetch.text(this.host)
         .chain(console.log)
         .run(metrics.Target.create(metrics.merge).receiver()).then(done).catch(done.fail);
  });

  it('measures timings correctly', function(done) {
    var target = metrics.Target.create(metrics.merge);

    fetch.text(this.host + '/delay?response=500&content=750').run(target.receiver()).then(function() {
      var result = JSON.parse(JSON.stringify(target.get()));
      console.log(JSON.stringify(result, null, 2));

      expect(result.tags.protocol['http(s)'].total$sum).toBeGreaterThan(500+750-100);
      expect(result.tags.protocol['http(s)'].total$sum).toBeLessThan(500+750+100);

      expect(result.tags['legion-io-fetch-request'].headers.total$sum).toBeGreaterThan(500-100);
      expect(result.tags['legion-io-fetch-request'].headers.total$sum).toBeLessThan(500+100);

      expect(result.tags['legion-io-fetch-request'].content.total$sum).toBeGreaterThan(750-100);
      expect(result.tags['legion-io-fetch-request'].content.total$sum).toBeLessThan(750+100);
 
      done();
    }).catch(done.fail);
  });
});


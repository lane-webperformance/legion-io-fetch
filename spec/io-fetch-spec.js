/* eslint-disable no-console */
'use strict';

const fetch = require('../src/index');
const metrics = require('legion-metrics');
const obstacle = require('legion-obstacle-course');
const core = require('legion-core');

describe('The fetch module for legion Io', function() {
  beforeEach(function() {
    this.port = 5000;
    this.server = obstacle.http.listen(this.port);
    this.host = 'http://localhost:' + this.port;
  });

  afterEach(function() {
    this.server.close();
  });

  it('is sane', function(done) {
    fetch.text(this.host)
      .chain(console.log)
      .run(core.Services.create().withMetricsTarget(metrics.Target.create(metrics.merge)))
      .then(done).catch(done.fail);
  });

  it('measures timings correctly', function(done) {
    const target = metrics.Target.create(metrics.merge);

    fetch.text(this.host + '/delay?response=500&content=1000').run(core.Services.create().withMetricsTarget(target)).then(() => target.flush().then(metrics => {
      metrics = JSON.parse(JSON.stringify(metrics));
      console.log(JSON.stringify(metrics, null, 2));

      expect(metrics.tags.protocol['http(s)'].values.duration.$avg.avg).toBeGreaterThan(2*(500+1000)/3-100); //this result should be the average of every result below
      expect(metrics.tags.protocol['http(s)'].values.duration.$avg.avg).toBeLessThan(2*(500+1000)/3+100);

      expect(metrics.tags['legion-io-fetch'].total.values.duration.$avg.avg).toBeGreaterThan(500+1000-100);
      expect(metrics.tags['legion-io-fetch'].total.values.duration.$avg.avg).toBeLessThan(500+1000+100);

      expect(metrics.tags['legion-io-fetch'].headers.values.duration.$avg.avg).toBeGreaterThan(500-100);
      expect(metrics.tags['legion-io-fetch'].headers.values.duration.$avg.avg).toBeLessThan(500+100);

      expect(metrics.tags['legion-io-fetch'].content.values.duration.$avg.avg).toBeGreaterThan(1000-100);
      expect(metrics.tags['legion-io-fetch'].content.values.duration.$avg.avg).toBeLessThan(1000+100);
 
      expect(metrics.tags['legion-io-fetch']['headers'].tags['legion-io-fetch']['content']).not.toBeDefined();
    })).then(done).catch(done.fail);
  });
});


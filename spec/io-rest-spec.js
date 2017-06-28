/* eslint-disable no-console */
'use strict';

const fetch = require('../src/index');
const obstacle = require('legion-obstacle-course');
const metrics = require('legion-metrics');
const Io = require('legion-io');
const core = require('legion-core');

describe('The fetch.rest module for legion Io', function() {
  let host, port, server, endpoint;

  beforeEach(function() {
    port = 5000;
    server = obstacle.listen(port);
    host = 'http://localhost:' + port;
    endpoint = host + '/inventory';
  });

  afterEach(function() {
    server.close();
  });

  it('executes RESTful JSON testcases', function(done) {
    const target = metrics.Target.create(metrics.merge);

    const testcase = Io.of()
      .chain(fetch.rest.put(endpoint, { apples : 1, carrots : 2, bannanas : 9 }))
      .chain(fetch.rest.patch(endpoint, { apples : 10 }))
      .chain(fetch.rest.post(endpoint, { carrots : 200, bannanas : 1 }))
      .chain(fetch.rest.get(endpoint))
      .chain(function(res) {
        expect(res.json.apples).toBe(10);
        expect(res.json.carrots).toBe(202);
        expect(res.json.bannanas).toBe(10);

        return target.flush().then(metrics => {
          metrics = JSON.parse(JSON.stringify(metrics));

          expect(metrics.tags['legion-io-fetch']['headers'].tags['outcome']['success'].values.duration.$avg.size).toBeGreaterThan(0);
          expect(metrics.tags['legion-io-fetch']['content'].tags['outcome']['success'].values.duration.$avg.size).toBeGreaterThan(0);
        });
      });

    testcase.run(core.Services.create().withMetricsTarget(target)).then(done).catch(done.fail);
  });
});

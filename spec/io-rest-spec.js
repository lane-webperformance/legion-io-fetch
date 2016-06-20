/* eslint-disable no-console */

var fetch = require('../src/index');
var obstacle = require('legion-obstacle-course');
var metrics = require('legion-metrics');
var Io = require('legion-io');

describe('The fetch.rest module for legion Io', function() {
  var host, port, server, endpoint;

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
    var target = metrics.Target.create(metrics.merge);

    var testcase = Io.of()
      .chain(fetch.rest.put(endpoint, { apples : 1, carrots : 2, bannanas : 9 }))
      .chain(fetch.rest.patch(endpoint, { apples : 10 }))
      .chain(fetch.rest.post(endpoint, { carrots : 200, bannanas : 1 }))
      .chain(fetch.rest.get(endpoint))
      .chain(function(res) {
        expect(res.json.apples).toBe(10);
        expect(res.json.carrots).toBe(202);
        expect(res.json.bannanas).toBe(10);

        const metrics = JSON.parse(JSON.stringify(target.get()));

        expect(metrics.tags['legion-io-fetch']['headers'].tags['outcome']['success'].values.duration.$avg.size).toBeGreaterThan(0);
        expect(metrics.tags['legion-io-fetch']['content'].tags['outcome']['success'].values.duration.$avg.size).toBeGreaterThan(0);
      })
      .chain(done);

    testcase.run(target.receiver()).catch(done.fail);
  });
});

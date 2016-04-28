
var instrument = require('legion-instrument');
var metrics = require('legion-metrics');
var fetch = require('node-fetch');

module.exports.text = instrument(function(url) {
  return fetch(url).then(function(res) {
    return res.text();
  });
}, metrics.tags.protocol('http'));

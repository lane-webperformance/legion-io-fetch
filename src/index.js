
var instrument = require('legion-instrument');
var metrics = require('legion-metrics');
var fetch = require('node-fetch');
//var Io = require('legion-io');

// Tags specific to fetch. The fetch API lets us break these measurements down
// into the time needed to fetch the headers and the time needed to fetch the
// content.
var tags = {};
tags.fetch = metrics.tags.generic('legion-io-fetch-request');
tags.fetch.headers = tags.fetch('headers');
tags.fetch.content = tags.fetch('content');
tags.fetch.total = tags.fetch('total');
tags.fetch_version = metrics.tags.generic('legion-io-fetch-version');
tags.fetch_version.current = tags.fetch_version(require('../package').version);
tags.http = metrics.tags.protocol('http(s)'); //TODO: move this into metrics.tags

// Make an instrumented fetch request. This only gives us the response headers,
// so we don't want to expose this function to the user. 
var startFetch = instrument(function(input,init) {
  return fetch(input,init).then(function(res) {
    return {
      type : res.type,
      url : res.url,
      status : res.status,
      ok : res.ok,
      statusText : res.statusText,
      headers : res.headers,
      _unsafe_original : res //unsafe because, if you don't know what you're
                             //doing, you're likely to goof up the timing
                             //measurements.
    };
  });
}, tags.fetch.headers);

// Instruments downloading the response content of a fetch response.
// 'X' in this case refers to the particular format of the content
// consistent with the fetch API (text, json, blog, etc).
var finishX = function(x) {
  return instrument(function(res) {
    return res._unsafe_original[x]().then(function(x_stuff) {
      res[x] = x_stuff;
      delete res._unsafe_original; //might decide to relax this later.

      return res;
    });
  }, tags.fetch.content);
};

// Constructs a variation of fetch by combining startFetch().chain(finishX).
var fetchX = function(x) {
  return function(input,init) {
    return startFetch(input,init).chain(finishX(x));
    //return Io.local(function(receiver) { return receiver.tag(tags.fetch_version.current); },
    //  instrument(startFetch(input,init).chain(finishX(x)), tags.http));
  };
};

module.exports = fetchX('arrayBuffer');
module.exports.arrayBuffer = fetchX('arrayBuffer');
module.exports.blob = fetchX('blob');        //according to node-fetch documentation, this shouldn't work
module.exports.formData = fetchX('formData');    //does this ever happen? form data from the server to the client?
module.exports.json = fetchX('json');
module.exports.text = fetchX('text');

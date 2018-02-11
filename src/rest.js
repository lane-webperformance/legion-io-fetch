'use strict';

const fetch = require('./fetch');

module.exports.rest = function(input, json, init_) {
  const init = Object.assign({},
    init_, {
      headers : Object.assign({}, {
        'content-type' : 'application/json'
      },
      init_.headers || {}),
      body : init_.body || JSON.stringify(json)
    });

  return fetch.json(input,init);
};

/*
 * Create a RESTful function for the given HTTP method.
 */
function withMethod(method) {
  return function(input, json, init_) {
    const init = Object.assign({},
      init_, {
        method : method });
    
    return module.exports.rest(input, json, init);
  };
}

module.exports.rest.get = function(input, init) {
  return fetch.json(input,init);
};

module.exports.rest.post = withMethod('POST');
module.exports.rest.put = withMethod('PUT');
module.exports.rest.patch = withMethod('PATCH');
module.exports.rest.delete = withMethod('DELETE');

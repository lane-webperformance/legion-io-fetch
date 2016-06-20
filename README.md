
[![Build Status](https://travis-ci.org/lane-webperformance/legion-io-fetch.svg?branch=master)](https://travis-ci.org/lane-webperformance/legion-io-fetch)
[![Dependency Status](https://gemnasium.com/badges/github.com/lane-webperformance/legion-io-fetch.svg)](https://gemnasium.com/github.com/lane-webperformance/legion-io-fetch)

Supports HTTP(S) requests in the legion load testing framework, built on top of
[node-fetch](https://www.npmjs.com/package/node-fetch), which in turn is an
implementation of the new Fetch API.

	fetch = require('legion-io-fetch')

fetch
=====

The fetch module provides an instrumented wrapper over node-fetch. Unlike
in the [WHATWG Fetch Specification](https://fetch.spec.whatwg.org/), it's
useful to commit to reading the entire response body before making the
request so that we can reliably measure the time for the entire exchange.
Accordingly, this API works a little differently from that specification.

The result of every function call is a Legion Io containing a Response.
Most users will be interested in the 'body' field of the response.

Response Object
===============

 * url - the url field of the response, as defined by the fetch specification.
 * status - the status field of the response, as defined by the fetch specification.
 * ok - the ok field of the response, as defined by the fetch specification.
 * statusText - the statusText of the response, as defined by the fetch specification.
 * headers - the Headers object of the response, as defined by the fetch specification.
 * json - the JSON content of the response, if any
 * text - the plain text content of the response, if any

API
===

fetch.text(input,init)
---------------

Makes an instrumented HTTP(S) request to the given URL. The body of the
response will be a JavaScript string.

 * input - typically the URL to request, or a Request object.
 * init - (optional) an init object as defined by the fetch specification.

fetch.json(input,init)
---------------

Makes an instrumented HTTP(S) request to the given URL. The body of the
response will be a JavaScript (JSON) object.

 * input - typically the URL to request, or a Request object.
 * init - (optional) an init object as defined by the fetch specification.

fetch.rest
==========

The fetch.rest module contains specialized methods for RESTful JSON APIs.
Each method corresponds to an HTTP request method (GET, PUT, POST, DELETE, etc)
and exchanges JSON objects as both the request and the response content.

fetch.rest.get(input,init)
--------------------------

Makes an instrumented GET request to the given URL. The body of the
response will be a JavaScript (JSON) object. Note, there isn't a
meaningful difference between this and fetch.json() -- this is provided
in the fetch.rest module for completeness.

 * input - typically the URL to request, or a Request object.
 * init - (optional) an init object as defined by the fetch specification.

fetch.rest.post(input,json,init)
--------------------------

Makes an instrumented POST request to the given URL. Both the body
of the request and the body of the response will be JavaScript (JSON)
objects.

 * input - typically the URL to request, or a Request object.
 * json - a plain Javascript (JSON) object, which will be set as the request
content via JSON.stringify.
 * init - (optional) an init object as defined by the fetch specification.

fetch.rest.put(input,json,init)
--------------------------

Makes an instrumented PUT request to the given URL. Both the body
of the request and the body of the response will be JavaScript (JSON)
objects.

 * input - typically the URL to request, or a Request object.
 * json - a plain Javascript (JSON) object, which will be set as the request
content via JSON.stringify.
 * init - (optional) an init object as defined by the fetch specification.

fetch.rest.patch(input,json,init)
--------------------------

Makes an instrumented PATCH request to the given URL. Both the body
of the request and the body of the response will be JavaScript (JSON)
objects.

 * input - typically the URL to request, or a Request object.
 * json - a plain Javascript (JSON) object, which will be set as the request
content via JSON.stringify.
 * init - (optional) an init object as defined by the fetch specification.

fetch.rest.delete(input,json,init)
--------------------------

Makes an instrumented DELETE request to the given URL. Both the body
of the request and the body of the response will be JavaScript (JSON)
objects.

 * input - typically the URL to request, or a Request object.
 * json - a plain Javascript (JSON) object, which will be set as the request
content via JSON.stringify.
 * init - (optional) an init object as defined by the fetch specification.


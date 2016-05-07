
Supports HTTP(S) requests in the legion load testing framework, built on top of
[node-fetch](https://www.npmjs.com/package/node-fetch), which in turn is an
implementation of the new Fetch API.

	fetch = require('legion-io-fetch')

fetch.text(url)
---------------

Makes an instrumented HTTP(S) request to the given URL and returns the text
of the response content. The entire call is measured and tagged as
protocol:http.


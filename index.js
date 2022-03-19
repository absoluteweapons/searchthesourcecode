/* DEPENDENCIES */
const express = require("express");
const shell = require("shelljs");

/* SERVER */

// configuration
const app = express();
const port = process.env.PORT || 8080;

// start server
app.listen(port);
console.log("Server started! At http://localhost:" + port)

// listen for input
app.get('/', (req, res) => {
  const { domain, search } = req.query
  // search parameters
  const START_URL = domain ? decodeURIComponent(req.query.domain) : undefined;
  const SEARCH_WORD = search ? decodeURIComponent(req.query.search) : undefined;

  if (!START_URL || !SEARCH_WORD) {
    return res.send('Missing params.')
  }

  // set filename to hostname + timestamp
  const protocol = (START_URL.indexOf('http') > -1) ? '' : 'http://'
  const url = new URL(protocol + START_URL)
  const filename 
    = url.hostname 
    + '_'
    + Date.now()
    + '.json'

  const code = scrape(filename, SEARCH_WORD, url)

  // response
  if (code === 0) {
    const results = require(`./stsc/feed/${filename}`)
    
    res.header("Content-Type",'application/json');
    res.send(JSON.stringify(results));
  } else {
    res.send('error')
  }
});

/* FUNCTIONS */

// run scrapy via shelljs
const scrape = (filename, string, url) => {
  const response = shell.exec(`./scrape.sh '${filename}' '${string}' '${url}'`)
  return response.code
};

// TODO error reporting
const error = (message) => {
  console.log(message);
};

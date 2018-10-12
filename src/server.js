const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;


const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getCSS,
  '/bundle.js': htmlHandler.getBundle,
  notReal: jsonHandler.notReal,
  '/addReview': jsonHandler.addReview,
  '/getReviewList': jsonHandler.getReviewList,
  '/getReview': jsonHandler.getReview,
};

// handle POST requests
const handlePost = (request, response) => {
  const res = response;

  // uploads come in as a byte stream that we need
  // to reassemble once it's all arrived
  const body = [];

  // if the upload stream errors out, just throw a
  // a bad request and send it back
  request.on('error', (err) => {
    console.dir(err);
    res.statusCode = 400;
    res.end();
  });

  // on 'data' is for each byte of data that comes in
  // from the upload. We will add it to our byte array.
  request.on('data', (chunk) => {
    body.push(chunk);
  });

  // on end of upload stream.
  request.on('end', () => {
    // combine our byte array (using Buffer.concat)
    // and convert it to a string value (in this instance)
    const bodyString = Buffer.concat(body).toString();
    // since we are getting x-www-form-urlencoded data
    // the format will be the same as querystrings
    // Parse the string into an object by field name
    const bodyParams = query.parse(bodyString);
    // pass to our addUser function
    jsonHandler.addReview(request, res, bodyParams);
  });
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);

  switch (request.method) {
    case 'GET':
      if (urlStruct[parsedUrl.pathname]) {
        urlStruct[parsedUrl.pathname](request, response, params);
      } else {
        jsonHandler.notReal(request, response, params);
      }
      break;
    case 'HEAD':
      if (urlStruct[parsedUrl.pathname]) {
        urlStruct[parsedUrl.pathname](request, response, params);
      } else {
        jsonHandler.notReal(request, response, params);
      }
      break;
    case 'POST':
      if (parsedUrl.pathname === '/addReview') {
        handlePost(request, response);
      }
      break;
    default:
      jsonHandler.notReal(request, response, params);
      break;
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);

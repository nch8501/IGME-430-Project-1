const fs = require('fs'); // pull in the file system module

const index = fs.readFileSync(`${__dirname}/../hosted/client.html`);
const css = fs.readFileSync(`${__dirname}/../hosted/style.css`);
// added script to pull in our js bundle. This script is generated
// by our babel build/watch scripts in our package.json
const jsBundle = fs.readFileSync(`${__dirname}/../hosted/bundle.js`);

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};


const getBundle = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/javascript' });
  response.write(jsBundle);
  response.end();
};

module.exports = {
  getIndex,
  getCSS,
  getBundle,
};

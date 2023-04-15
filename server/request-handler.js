/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
const fs = require('fs');
const path = require('path');
var url = require('url');
let messages = [];
let messageCount = 0;

var requestHandler = function (request, response) {
  // const { headers, method, url } = request;

  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.

  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  if (request.url !== 'classes/messages') { //^
    // response.writeHead(404, { 'Content-Type': 'text/plain' });
    // response.end('404 not found');
    // fs.readFile('/Users/kode/hR/rfp2303-chatterbox-server/chatterbox.html')

    htmlPath = path.join(__dirname, '../chatterbox.html');

    let newPath = url.parse(request.url).pathname;
    //^ resources path = path.join(__dirname, '..', newPath)

    console.log('Request URL:', request.url, ' and newPath:', newPath, '-----htmlPath:', htmlPath);

    fs.readFile(htmlPath, function (error, data) {
      if (error) {
        response.writeHead(404);
        response.write('This page does not exist');
        response.end();
      } else {
        response.writeHead(200, {
          'Content-Type': 'text/html'
        });
        response.write(data);
        response.end();
      }
    });
    // .then(contents => {
    //   response.setHeader('Content-Type', 'text/html');
    //   response.writeHead(200);
    //   response.end(contents);
    // });
  } else { //^ else if (request.url === 'classes/messages')

    let statusCode;
    console.log('Serving request type ' + request.method + ' for url ' + request.url);

    var headers = defaultCorsHeaders;


    if (request.method === 'POST') {
      statusCode = 201;
      let body = [];
      request.on('data', (chunk) => {

        body.push(chunk);
      }).on('end', () => {
        body = Buffer.concat(body).toString();
        let bodyObj = JSON.parse(body);
        //^ give random id as obj property message_id : 674542
        bodyObj['message_id'] = messageCount++;
        messages.push(bodyObj);

        headers['Content-Type'] = 'application/json';
        headers['Data-Type'] = 'application/json';
        response.writeHead(statusCode, headers);
        response.end(body);

      });


    } else if (request.method === 'GET') {
      statusCode = 200;
      headers['Content-Type'] = 'application/json';
      response.writeHead(statusCode, headers);
      console.log(messages);
      response.end(JSON.stringify(messages));

    } else if (request.method === 'OPTIONS') {
      statusCode = 200;
      headers['Allow'] = 'GET, POST';
      response.writeHead(statusCode, headers);
      response.end();
    }
  } //^ else , catches the scripts and css





  // The outgoing status.

  // See the note below about CORS headers.

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  //^ headers['Content-Type'] = 'application/json';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.

  //^ response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, authorization',
  'access-control-max-age': 10 // Seconds.
};


exports.requestHandler = requestHandler;
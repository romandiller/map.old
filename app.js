const path = require('path');
const http = require('http');
const express = require('express');
const minify = require('express-minify-html');
const config = require('./config.json');
const router = require('./controllers/router');

const app = express();

app.use(minify({
  override:      true,
  exception_url: false,
  htmlMinifier: {
    removeComments:            true,
    collapseWhitespace:        true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes:     true,
    removeEmptyAttributes:     true,
  }
}));

app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');

app.use(router);

app.use((req, res, next) => {

	next(404);

});

app.use((err, req, res, next) => {

    res.status(err.status || 404);

    res.render('error');

});

const server = http.createServer(app);

server.listen(config.port, () => {
 
  	console.log(`Server listen ${config.port}...`);

});

require('./controllers/sockets')(server, config);
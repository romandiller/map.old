const path = require('path');
const http = require('http');
const express = require('express');
const favicon = require('express-favicon');
const staticAsset = require('static-asset');

const app = express();

app.use(favicon(path.join(__dirname, 'public/images/favicon.png')));
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');

app.use(staticAsset(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {

	res.render('test.ejs');

});

http.createServer(app).listen(5000, () => {
 
  	console.log(`Server listen: 5000...`);

});
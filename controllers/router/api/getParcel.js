// api requests
'use strict';
var url = require('url');
const request = require("../../request");

exports.get = (req, res, next) => {

	let coords = url.parse(req.url, true).query;

	request.searchParcelByCoords(coords, (result) => {

		res.end(result);

	});
	
};
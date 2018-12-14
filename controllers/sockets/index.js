//sockets
'use strict';
const request = require('../request');

module.exports = (server, config) => {

	const io = require('socket.io')(3000);

	io.sockets.on('connection', (client) => {
	    
	  	console.log('новое socket соединение');

	  	// client.on('searchParcelByCoords', (coords) => { // поиск участка по координатам

	  	// 	request.searchParcelByCoords(coords, (result) => { // отправялем результат

	  	// 		client.emit('parcelByCoords', result);

	  	// 	});

	  	// });

	});

};
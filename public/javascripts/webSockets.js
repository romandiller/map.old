// sockets
'use strict';
import eventEmitter from './eventEmitter.js';
import messages from './messages.js';

export default class WebSockets {

	constructor() {

		this.eventEmitter = eventEmitter.bus;
		this.socket = io.connect('http://prototype.locahost');;
		this.icon = document.getElementById('connection');

		this.listener();

		this.eventEmitter.on('ws:searchParcelByCoords', this.searchParcelByCoords.bind(this));

	}

	iconStatus(action) {

		this.icon.setAttribute('data-connect', action);

	}

	listener() {

		this.socket.on('connect', () => {

			this.iconStatus(true);			

		});

		this.socket.on('disconnect', () => {

			this.iconStatus(false);			

		});

		this.socket.on('parcelByCoords', (data) => { // получили участок по координатам

			let parcelData = (JSON.parse(data) === null) ? null : JSON.parse(data);

			this.eventEmitter.emit('SearchController:showResult', parcelData); // показываем результат поиска

		});

	}

	searchParcelByCoords(data) {

		this.socket.emit('searchParcelByCoords', data);

	}

}
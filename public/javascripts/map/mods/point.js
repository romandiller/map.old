// pointsMode
'use strict';
import eventEmitter from '../../eventEmitter.js';
import Transport from '../../transport.js';

export default class Point {

	constructor() {

		this.eventEmitter = eventEmitter.bus;
		this.transport = new Transport();
		this.curentPoint = false;
		
	}

	init(lat, lng) {

		this.eventEmitter.emit('MapMarker:put', lat, lng); // ставим маркер на точку

		this.transport.ajax(`api/getParcel?lat=${lat}&lng=${lng}`, (data) => { // поиск по точке

			this.eventEmitter.emit('SearchController:showResult', data); // показываем результат поиска

		});

	}

	delete() {

		

	}

}
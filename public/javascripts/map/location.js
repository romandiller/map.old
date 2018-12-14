// location
'use strict';
import eventEmitter from '../eventEmitter.js';
import messages from '../messages.js';
import Map from './map.js';

export default class Location {

	constructor() {

		this.eventEmitter = eventEmitter.bus;
		this.locationDefault = { // настройки геолокации

			enableHighAccuracy: true,
			timeout: 1000 * 30,
			maximumAge: 10000 * 60

		};
		this.positionDefaultCoords = { // Кремль по умолчанию

			lat : 55.75393030000001,
        	lng : 37.620795000000044

		};
		this.message = '';
		this.map = new Map();
		this.eventEmitter.on('Location:init', this.init.bind(this));
		
	}

	init() {

		(navigator && navigator.geolocation)

			? navigator.geolocation.getCurrentPosition(this.getPosition.bind(this), this.positionError.bind(this), this.locationDefault)

			: this.getPosition(this.positionDefaultCoords.lat, this.positionDefaultCoords.lng);

	}

	getPosition(position) { // если все ок показываем определенную область

		this.eventEmitter.emit('showMessage', messages.map.position.ok);

		this.map.init(position.coords.latitude, position.coords.longitude);

	}

	positionError(positionError) { // если ошибка определения геопозиции показываем Москву

		switch (positionError.code) {

			case 1: // заблокировано
				this.message = messages.map.position.block;
				break;

			case 2: // проблемы с подключением к службе геолокации

				this.message = messages.map.position.netError;
				break;

			case 3: // обрыв соединения по таймауту

				this.message = messages.map.position.timeoutError;
				break;

			default: // неизвестная ошибка
				this.message = messages.map.position.unknownError;



		}

		this.eventEmitter.emit('showMessage', this.message);

		this.map.init(this.positionDefaultCoords.lat, this.positionDefaultCoords.lng);

	}

}
// geolocation
'use strict';
import eventEmitter from '../eventEmitter.js';
import messages from '../messages.js';
import GoogleMaps from './google.js';

export default class GeoLocation {

	constructor() {

		this.eventEmitter = eventEmitter.bus;
		this.default = { // Кремль по умолчанию

			lat : 55.75393030000001,
        	lng : 37.620795000000044

		};
		this.message = '';
		this.googleMap = new GoogleMaps();

	}

	getPosition(position) { // если все ок показываем определенную область

		this.eventEmitter.emit('showMessage', messages.map.position.ok);

		this.googleMap.build(position.coords.latitude, position.coords.longitude);

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

		this.googleMap.build(this.default.lat, this.default.lng);

	}

}
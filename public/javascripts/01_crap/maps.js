// maps
'use strict';
import eventEmitter from '../eventEmitter.js';
import GeoLocation from './geolocation.js';

export default class Map {

	constructor() {

		this.eventEmitter = eventEmitter.bus;
		this.location = new GeoLocation();
		this.locationDefault = { // настройки геолокации

			enableHighAccuracy: true,
			timeout: 1000 * 30,
			maximumAge: 10000 * 60

		};
		this.positionDefaultCoords = { // Кремль по умолчанию

			lat : 55.75393030000001,
        	lng : 37.620795000000044

		};
		this.eventEmitter.on('Map:init', this.init.bind(this));
		
	}

	init() {

		(navigator && navigator.geolocation)

			? navigator.geolocation.getCurrentPosition(this.location.getPosition.bind(this.location), this.location.positionError.bind(this.location), this.locationDefault)

			: this.location.getPosition(this.positionDefaultCoords.lat, this.positionDefaultCoords.lng);

	}

}
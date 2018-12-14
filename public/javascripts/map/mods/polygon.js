// polygonsMode
'use strict';
import eventEmitter from '../../eventEmitter.js';

export default class Polygon {

	constructor() {

		this.eventEmitter = eventEmitter.bus;
		this.timeOut = {

			count: 0,
			delay: 300

		};
		this.rectangle = false;
		this.points = [];
		this.move = false;
		
	}

	init() {

		console.log('ok');

	}

	buildPolygon() {

		if (!this.polygonData.length) return;

		let polygon = new google.maps.Polygon({

			paths: this.polygonData,
			strokeColor: '#f0b21b',
			strokeOpacity: 0.8,
			strokeWeight: 1,
			fillColor: '#e43c1e',
			fillOpacity: 0.3
        
        });

        polygon.setMap(this.map);

        this.polygonData = [];

	}

	delete() {



	}

}
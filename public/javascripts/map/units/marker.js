// markers
'use strict';
import eventEmitter from '../../eventEmitter.js';

export default class Markers {

	constructor() {

		this.map = false;
		this.eventEmitter = eventEmitter.bus;
		this.markers = [];

		this.eventEmitter.on('MapMarker:put', this.put.bind(this));
		this.eventEmitter.on('MapMarker:delete', this.delete.bind(this));

	}

	put(lat, lng) { // ставим маркер на карту

		let markerIcon = L.icon({

			iconUrl: 'public/images/marker-icon.png',
			shadowUrl: '',
			iconSize:    [25, 41],
			iconAnchor:  [12, 41],
			popupAnchor: [1, -34],
			tooltipAnchor: [16, -28],
			shadowSize:  [41, 41]

		});

		let marker = new L.marker([lat, lng], { icon: markerIcon }).addTo(this.map);

		this.markers.push(marker);

	}

	delete() {

		this.markers.forEach((item) => {

			this.map.removeLayer(item);

		});

	}

}
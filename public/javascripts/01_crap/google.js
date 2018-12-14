// google maps
'use strict';
import eventEmitter from '../eventEmitter.js';
import messages from '../messages.js';
import Marker from './units/marker.js';
import Point from './units/point.js';
import Rectangle from './units/rectangle.js';
import Polygon from './units/polygon.js';

export default class GoogleMaps {

	constructor() {

		this.eventEmitter = eventEmitter.bus;

		// юниты карты
		this.markers = new Marker();
		this.point = new Point();
		this.rectangle = new Rectangle();
		this.polygon = new Polygon();
		
		this.mapTypes = { // типы карты

			roadmap: google.maps.MapTypeId.ROADMAP, 
			hybrid: google.maps.MapTypeId.HYBRID,
			satellite: google.maps.MapTypeId.SATELLITE

		};
		this.default = { // объект карты

			conteiner: document.getElementById("map"), // контейнер
			map: false, // карта
			options: {

				zoom: 16,
				disableDefaultUI: true,
				disableDoubleClickZoom: true,
		        mapTypeId: this.mapTypes.hybrid,
		        styles: [{
			        featureType: "poi",
			        elementType: "labels",
			        stylers: [{ visibility: "off" }]
			    }]

			},
			currentSearchMode: false, // режим поиска земель
			currentMapData: { // текущие данные по карте: центр и координаты последнего клика

				lat: 0,
				lng: 0,
				center: []

			}

		};

		this.eventEmitter.on('Map:enableSearchMode', this.enableSearchMode.bind(this));
		this.eventEmitter.on('Map:clear', this.clear.bind(this));

	}

	enableSearchMode(mode) { // назначить режим поиска

		this.eventEmitter.emit('showMessage', `${messages.map.events.mode}${messages.map.modeName[mode]}`);

		this.default.currentSearchMode = mode;

	}

	disableSearchMode() { // удалить режим поиска

		this.default.currentSearchMode = false;

		this.eventEmitter.emit('showMessage', `${messages.map.events.clear}`);

	}

	build(lat, lng) { // выводим карту

		this.default.options.center = new google.maps.LatLng(lat, lng);

		this.default.map = new google.maps.Map(this.default.conteiner, this.default.options);

		this.markers.map = this.default.map;
		this.point.map = this.default.map;
		this.rectangle.map = this.default.map;
		this.polygon.map = this.default.map;

		this.mapListener();

	}

	clear() { // чистим карту от объектов

		if (this.default.currentSearchMode === false) return;

		(typeof this[this.default.currentSearchMode].delete === 'function')

			? this[this.default.currentSearchMode].delete()
			
			: this.eventEmitter.emit('showMessage', messages.map.events.soferror);

		this.disableSearchMode();

	}

	mapListener() { // слушатель карты

		this.default.map.addListener('click', (e) => {

			if (this.default.currentSearchMode === false) {

				this.eventEmitter.emit('showMessage', messages.map.events.nomodeclick);

			} else {

				this.default.currentMapData.lat = e.latLng.lat();
				this.default.currentMapData.lng = e.latLng.lng();

				(typeof this[this.default.currentSearchMode].init === 'function') 

					? this[this.default.currentSearchMode].init(this.default.currentMapData)

					: this.eventEmitter.emit('showMessage', messages.map.events.softerror);

			}

		});

		this.default.map.addListener('dragend', (e) => { // смена центра при move

			this.currentData.center[0] = this.map.getCenter().lat();
			this.currentData.center[1] = this.map.getCenter().lng();

		});

	}

}
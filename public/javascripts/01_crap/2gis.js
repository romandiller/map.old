// Map2Gis
'use strict';
export default class Map2Gis {

	constructor() {

		this.map = false;
		this.default = {

			element: document.getElementById("map")

		}

	}

	build2gisMap(position) {

		// _northEast: n.LatLng {lat: 55.44342680146446, lng: 84.42993164062501}
		// _southWest: n.LatLng {lat: 55.07168441601322, lng: 83.59565734863283}
		// 54.843013063969124, 83.69590759277345

		let newCoords = {
			lat: 55.042028245291824,
			long: 82.89924860000612
		}

        this.map = DG.map(this.default.element, {

            // center: [position.coords.latitude, position.coords.longitude],
            center: [newCoords.lat, newCoords.long],
            zoom: 16,
            fullscreenControl: false,
            zoomControl: false,
            keyboard: false,
            doubleClickZoom: false,
            poi: false

        });

        this.Map2GisListener();

	}

	Map2GisListener() {

		this.map.on('click', (e) => {

			let [lat, long] = [e.latlng.lat, e.latlng.lng];
			let [screenX, screenY] = [e.containerPoint.x, e.containerPoint.y];

			console.log('координаты клика ' + lat + ', ' + long + ' широта / долгота');
			console.log('координаты клика ' + screenX + ', ' + screenY + ' на экране');


			// console.log(e);

		});

		// this.map.on('zoomend', (e) => {

		// 	console.log(e);

		// });

		this.map.on('move', (e) => {

			console.log(e.target);

		});

	}


}
// util
'use strict';
import eventEmitter from '../eventEmitter.js';

export default class Util {

	constructor() {

		this.eventEmitter = eventEmitter.bus;
		this.map = false;
		this.styles = {

			position: 'absolute',
			top: 0,
			left: 0

		};
		this.params = {

			coords: {

				lX: 0,
				lY: 0,
				rX: 0,
				rY: 0

			},
			width: 0,
			height: 0

		};

	}

	checkFullArea() { // проверить зону гда расположе тайл, что бы убрать не нужные точки

		// console.log(this.canvas[0]);

	}

	initCanvas(coords) { // вставляем канвас

		this.getCanvasParams(coords);

		console.log(this.params);

	}

	createCanvas() { // создаем канвас

		this.canvas = document.createElement('canvas');

		this.canvas.id = 'utilCanvas';

		this.canvas.style.zIndex = 1000000;

		this.defaultCanvasStyles();

		document.body.appendChild(this.canvas);

	}

	defaultCanvasStyles() { // стили канваса по умолчанию

		this.canvas.width = 0;
		this.canvas.height = 0;

		for (let key in this.styles) {

			this.canvas.style[key] = this.styles[key];

		}

	}

	setCanvasStyle(styles) {

		for (let key in styles) {

			this.canvas.style[key] = styles[key] + 'px';

		}

	}

	getCanvasParams(coords) { // собираем канвас

		console.log(coords);

		// this.params.coords.lX = L.latLngToLayerPoint(coords.northWest.lat);
		// this.params.coords.lY = L.latLngToLayerPoint();
		// this.params.coords.rX = L.latLngToLayerPoint();
		// this.params.coords.rY = L.latLngToLayerPoint();

	}

}
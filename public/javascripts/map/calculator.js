// calculator
'use strict';
import eventEmitter from '../eventEmitter.js';

export default class Calculator {

	constructor() {

		this.eventEmitter = eventEmitter.bus;

		this.RECOMMEND_SIZE = 10; // шаг
		this.BIAS_TO_CENTER = 0.5; // хз

		this.gorizontLineLength = 0; // длина горизонтальная линия
		this.heightLineLength = 0; // длина вертикальная линия

		this.points = [];

		this.data = { // параметра области в кв.км.

			area: 0,
			perimitr: 0,
			width: 0,
			height: 0

		}

	}

	getArea() { // вычисляем площадь участка

		return (this.data.width * this.data.height);

	}

	getPerimitr() { // вычесляем периметр
		
		return ((this.data.width + this.data.height) * 2);

	}

	getWidthAndHeight(southWest, southEast, northEast) { // получаем длины вертикальной и горизонтальной линии

		this.points = [

			new L.LatLng(southWest[0], southWest[1]),
			new L.LatLng(southEast[0], southEast[1]),
			new L.LatLng(northEast[0], northEast[1])

		];

		this.data.width = +(this.points[0].distanceTo(this.points[1])).toFixed(0);
		this.data.height = +(this.points[1].distanceTo(this.points[2])).toFixed(0);

	}

	getRectangleData(points) { // вычисляем данные выделенной области

		this.getWidthAndHeight(points.southWest, points.southEast, points.northEast);

		this.data.area = this.getArea(); // северо-запад, северо-восток, юго-восток
		this.data.perimitr = this.getPerimitr();

	}

	getTargetsInSelectedArea(x_min, x_max, y_min, y_max) { // вычисляем матрицу координат, которые входят в выделенную область

		let targets = [];

		let x_side_len = x_max - x_min;
		let y_side_len = y_max - y_min;

		let x_total_count = Math.round(this.data.width / this.RECOMMEND_SIZE);
		let y_total_count = Math.round(this.data.height / this.RECOMMEND_SIZE);

		let x_closest_size = x_side_len / x_total_count;
		let y_closest_size = y_side_len / y_total_count;

		for (let x = 0; x < x_total_count; x++) {
		  
		  for (let y = 0; y < y_total_count; y++) {

		    let coord_x = x_min + x_closest_size * (x + this.BIAS_TO_CENTER);
		    let coord_y = y_min + y_closest_size * (y + this.BIAS_TO_CENTER);

		    targets.push([coord_x, coord_y]);

		  }

		}

		return targets;

	}

}
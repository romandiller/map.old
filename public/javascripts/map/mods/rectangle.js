// rectanglesMode
'use strict';
import eventEmitter from '../../eventEmitter.js';
import messages from '../../messages.js';
import Calculator from '../calculator.js';
import Util from '../util.js';
// import Popup from '../units/popup.js';

export default class Rectangle {

	constructor() {

		this.eventEmitter = eventEmitter.bus;
		this.util = new Util();
		// this.popup = new Popup();
		this.calculator = new Calculator();

		this.timeOut = { // цифры для таймаута движения прямоугольника

			count: 0,
			delay: 300

		};
		this.rectangle = {  // данные прямоугольника

			element: false, // сам элемент
			conners: [], // координаты углов
			popupContent: '', // контент попапа
			area: 0, // площадь
			perimitr: 0, // периметр
			width: 0, // ширина
			height: 0 // высота

		};
		this.move = false; // флаг, ставим при изменении прямоугольника
		this.options = {

			stroke: true, // рамка
			weight: 2, // толщина рамки
			color: "#2f3640", // цвет рамки
			weight: 1,
			fillOpacity: 0.7

		};
		this.map = false; // карта
		this.points = []; // координаты точек для прямоугольника
		this.targets = []; // цели для поиска
		this.targetsLimit = 10000;

		this.eventEmitter.on('Rectangle:deleteRectangle', this.deleteRectangle.bind(this));
		this.eventEmitter.on('Rectangle:initTargets', this.initTargets.bind(this));
		// this.eventEmitter.on('Rectangle:deleteMapLayer', this.deleteMapLayer.bind(this));

	}

	init(lat, lng) { // обработка кликов из вне

		if (this.points.length === 1) {

			this.savePoint(lat, lng);
			this.buildRectangle();

		} else if (this.points.length === 2) {

			if (this.move === true) return; // если после движения то ничего не делаем

			this.deleteRectangle();
			this.savePoint(lat, lng);
			this.eventEmitter.emit('MapMarker:put', lat, lng);

		} else {

			this.savePoint(lat, lng);
			this.eventEmitter.emit('MapMarker:put', lat, lng);

		}

	}

	savePoint(lat, lng) { // сохраняем точки для прямоугольника

		this.points.push({ lat: lat, lng: lng });

	}

	buildRectangle() { // строим прямоугольник

		if (!this.points.length) return;

		this.eventEmitter.emit('MapMarker:delete');

		let bounds = [

			[this.points[0].lat, this.points[1].lng],
			[this.points[1].lat, this.points[0].lng]
		
		];

		this.options.renderer = this.map.canvas; // рендер вектора будет на канвасе, который мы добавили

		this.rectangle.element = L.rectangle(bounds, this.options).addTo(this.map); // прямоугольник
		
		this.createRectangle();

		this.rectangle.element.enableEdit(); // включаем режим редактирования прямоугольника

		// вешаем события изменения состояния прямоугольника

		this.rectangle.element.on('editable:drawing:move', () => { // слушаем изменения прямоугольника

			this.move = true;

			this.rectangle.element.closePopup();

			this.targets = [];

			this.eventEmitter.emit('MapMarker:delete');		

		});	

		//  в конце каждого изменения переопределяем все параметры

		this.rectangle.element.on('editable:dragend', () => { // изменение положения

			this.reBuildRectangle();

		});

		this.rectangle.element.on('editable:vertex:dragend', () => { // изменение масштаба

			this.reBuildRectangle();

		});

	}

	createRectangle() { // создаем прямоугольника

		this.rectangle.conners = this.rectangle.element.getLatLngs()[0]; // получем новые углы

		this.calculator.getRectangleData({  // задаем новые параметры прямоугольника

			southWest: [this.rectangle.conners[0].lat, this.rectangle.conners[0].lng], // юго-запад
			northWest: [this.rectangle.conners[1].lat, this.rectangle.conners[1].lng], // северо-запад
			northEast: [this.rectangle.conners[2].lat, this.rectangle.conners[2].lng], // северо-восток
			southEast: [this.rectangle.conners[3].lat, this.rectangle.conners[3].lng] // юго-восток

		});

		this.rectangle.area = this.calculator.data.area;
		this.rectangle.perimitr = this.calculator.data.perimitr;
		this.rectangle.width = this.calculator.data.width;
		this.rectangle.height = this.calculator.data.height;

		this.targets = this.calculator.getTargetsInSelectedArea( // создаем координаты целей

			this.rectangle.conners[1].lat, 
			this.rectangle.conners[3].lat, 
			this.rectangle.conners[1].lng, 
			this.rectangle.conners[3].lng

		);

		this.createPopup(); // добавляем попапк к прямоугольнику

	}

	reBuildRectangle() { // пересоздаем прямоугольник

		clearTimeout(this.timeOut.count);

		this.timeOut.count = setTimeout(() => {

			this.createRectangle();

			this.move = false;

		}, this.timeOut.delay);

	}

	createPopup() {

		this.rectangle.popupContent = (this.targets.length > this.targetsLimit) 

			? this.popupContentFail() 
			: this.popupContent(

				  this.rectangle.area,
				  this.rectangle.perimitr,
				  this.rectangle.width,
				  this.rectangle.height

			  );

		this.rectangle.element.bindPopup(this.rectangle.popupContent).openPopup();

	}

	deleteRectangle() { // удаляем прямоугольник

		if (!this.rectangle.element) return;

		this.map.removeLayer(this.rectangle.element);
		this.points = [];
		this.rectangle = {

			element: false,
			conners: [],
			popupContent: '',
			area: 0,
			perimitr: 0,
			width: 0,
			height: 0

		};

	}

	initTargets(callback) { // возвращаем массив целей для searchController

		this.rectangle.element.closePopup();

		this.deleteRectangle();

		// this.util.checkFullArea();

		// this.targets.forEach((item) => {

		// 	this.eventEmitter.emit('MapMarker:put', item[0], item[1]);

		// });

		callback(this.targets);

	}

	popupContentFail() { // если много выделил 

		return `<div id="popupFail">
					<p>Вы выбрали слишком большой участок, измените его размер!</p>
					<p>У вас ${this.targets.length} целей, это же пиздец. Росреестр не выдержит. Надо меньше ${this.targetsLimit} целей.</p>
				</div>`;

	}

	popupContent(area, perimitr, horizont, vertical) { // выводим попап выделенной области

		return `<button id="globalSearch" data-action="globalSearch">Поиск объектов</button>
				  <div id="layerInfo">
				      <p class="area"><span>Площадь:</span> ${area} кв. м.</p>
				      <p class="perimeter"><span>Перимитр:</span> ${perimitr} м.</p>
				      <p class="horizont"><span>Горизонт:</span> ${horizont} м.</p>
				      <p class="vertical"><span>Вертикаль:</span> ${vertical} м.</p>
				      <p class="targets"><span>Число целей:</span> ${this.targets.length}</p>
				  </div>`;

	}

}
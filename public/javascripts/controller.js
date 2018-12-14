// controller
'use strict';
import eventEmitter from './eventEmitter.js';

export default class Controller {

	constructor() {

		this.eventEmitter = eventEmitter.bus;
		this.timeOut = 0;

	}

	searchByPoint(target) { // поиск по одной точке

		let mode = 'point';

		this.eventEmitter.emit('Map:enableSearchMode', mode);

		this.clearControls();

		target.setAttribute('data-select', true);

	}

	searchByPolygon(target) { // поиск по точкам polygon

		let mode = 'polygon';

		this.eventEmitter.emit('Map:enableSearchMode', mode);

		this.clearControls();

		target.setAttribute('data-select', true);

	}

	searchByRectangle(target) { // поиск по rectangle

		let mode = 'rectangle';

		this.eventEmitter.emit('Map:enableSearchMode', mode);

		this.clearControls();

		target.setAttribute('data-select', true);

	}

	clearMap(target) { // очистка карты

		clearTimeout(this.timeOut);

		this.timeOut = setTimeout(() => {

			this.eventEmitter.emit('Map:disableSearchMode');

			this.clearControls();

		}, 100);

	}

	editMapLayer() { // двигать выделенную область

		this.eventEmitter.emit('Rectangle:editMapLayer');

	}

	deleteMapLayer() { // удалить выделенную область
		
		this.eventEmitter.emit('Rectangle:deleteMapLayer');

	}

	globalSearch() { // поиск по выделенной области

		this.eventEmitter.emit('SearchController:globalSearch');

	}

	clearControls() { // очистить контролы

		let controls = document.querySelectorAll('button');

		for (let i = 0; i < controls.length; i++) {

			if (controls[i].getAttribute('data-select')) controls[i].setAttribute('data-select', false);

		}

	}

	showDetails(target) { // показать детали

		this.eventEmitter.emit('SearchController:showParcelDetails', target);

	}

	closeDetails(target) { // закрыть детали

		this.eventEmitter.emit('infoWindow:closeDetails');

	}

}
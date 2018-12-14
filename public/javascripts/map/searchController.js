// searchController
'use strict';
import eventEmitter from '../eventEmitter.js';

export default class SearchController {

	constructor() {

		this.eventEmitter = eventEmitter.bus;
		this.target = {  // новый объект

			new: false,
			parcel: false

		};
		this.searchList = []; // массив элементов текущего поиска

		this.eventEmitter.on('SearchController:showResult', this.showResult.bind(this));
		this.eventEmitter.on('SearchController:emptyResult', this.clearSearch.bind(this));
		this.eventEmitter.on('SearchController:showParcelDetails', this.showParcelDetails.bind(this));
		this.eventEmitter.on('SearchController:clearSearch', this.clearSearch.bind(this));
		this.eventEmitter.on('SearchController:globalSearch', this.globalSearch.bind(this));

	}

	globalSearch() {

		this.eventEmitter.emit('Rectangle:initTargets', (targetsArray) => {

			console.log('Поиск завершен...');

			console.log(targetsArray);

		});

	}

	showParcelDetails(target) { // показываем данные выбранного участка

		console.log('открыли детали - searchController');

		// this.searchList.forEach((item) => {

		// 	if ((item.parcel !== null) && (item.parcel.cadNum === target.querySelector('.cadNum').innerHTML)) {

		// 		this.eventEmitter.emit('infoWindow:openDetails', item.parcel);
				
		// 	}

		// });

	}

	showResult(data) { // выводим результаты поиска в асайд

		this.setDataInSearchList(data);

		this.eventEmitter.emit('infoWindow:showResult', this.searchList);

		this.searchList.forEach((item) => {

			if (item !== null && item.new) {

				item.parcels.forEach((item2) => {

					this.eventEmitter.emit('Tile:showParcelTile', {

                        img: `/public/images/parcels/${item2.imageName}`,
                        bound: [[item2.swLat, item2.swLng],[item2.neLat, item2.neLng]],
                        notTarget: true,
                        offset: { x: 550 / 2, y: 0 }

					});

				});

				// this.eventEmitter.emit('TargetsFilter');

				delete item.new;

			}

		});

	}

	setDataInSearchList(data) { // если элемент есть уже в массиве, то мимо

		if (this.searchList.length === 0 || data === null) {

			this.searchList.push(data);

		} else {

			this.searchList.every((item) => {

				if (item === null) return true;
				if (item.id !== data.id) return true;

			}) && this.searchList.push(data);

		}

	}

	clearSearch() { // чистим поиск

		this.searchList = [];

		this.eventEmitter.emit('infoWindow:clearInfoWindow');

	}

	isEmptyObject(object) { // проверяем на пустоту объект

		for (let key in object) {

			if (object.hasOwnProperty(key)) {

				return true;

			}

			return false;

		}

	}

}
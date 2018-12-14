// search 
'use strict';

export default class Transport { // модуль транспорт аякс и сокеты

	constructor() {



	}

	ajax(url, callback) {

		let xhr = new XMLHttpRequest();

		xhr.open("GET", url);

		xhr.onreadystatechange = () => {
			
			if (xhr.readyState == 4) callback(JSON.parse(xhr.responseText));

		}

		xhr.send();

	}

}
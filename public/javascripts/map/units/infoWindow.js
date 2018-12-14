// render
'use strict';
import eventEmitter from '../../eventEmitter.js';

export default class infoWindow {

	constructor() {

		this.eventEmitter = eventEmitter.bus;
		this.conteiner = false; // инфо-окно для вывода инфы по пришедшим участкам
		this.header = false; // заголовок инфо
		this.content = false; // блок для результатов поиска
		this.details = false; // блок деталей объекта

		this.createModalWindow();

		this.eventEmitter.on('infoWindow:showResult', this.showResult.bind(this));
		this.eventEmitter.on('infoWindow:clearInfoWindow', this.clearInfoWindow.bind(this));
		
		this.eventEmitter.on('infoWindow:openDetails', this.openDetails.bind(this));
		this.eventEmitter.on('infoWindow:closeDetails', this.closeDetails.bind(this));

	}

	objectTemplate(object) { // если пришел объект

		let li = document.createElement('li');
		li.classList.add('parcelOnce');
		li.setAttribute('data-action', 'showDetails');
		li.innerHTML = `<p><span class="title">Кадастровый номер:</span> <span>${object.cadNum}</span></p>`;

		this.content.appendChild(li);

	}

	arrayTemplate(array) { // если пришел массив

		let li = document.createElement('li');
		li.classList.add('parcelArray');
		li.setAttribute('data-action', 'showDetails');

		let str = ``;

		array.forEach((item) => {

			str += `<p><span class="title">Кадастровый номер:</span> <span>${item.cadNum}</span></p>`;

		});

		li.innerHTML = str;

		this.content.appendChild(li);

	}

	emptyTemplate() { // если пришел null

		let li = document.createElement('li');
		li.classList.add('parcelEmpty');
		li.innerHTML = `<p>Нет данных от Росреестра</p>`;

		this.content.appendChild(li);

	}

	showResult(searchList) { // выводим результаты поиска

		this.content.innerHTML = '';

		searchList.forEach((item) => {

			(item === null) ? this.emptyTemplate() : (item !== null && item.parcels.length > 1) ? this.arrayTemplate(item.parcels) : this.objectTemplate(item.parcels[0]);

		});

	}

	clearInfoWindow() {

		this.content.innerHTML = '';

	}


	/*--------------------------------------------------------------------------------*/

	createModalWindow() { // создаем модальное окно

		this.conteiner = document.createElement('aside');
		this.header = document.createElement('h3');
		this.content = document.createElement('ul');
		this.details = document.createElement('div');
		this.detailsContent = document.createElement('div');
		this.filter =document.createElement('div');

		this.header.innerHTML = 'Результаты поиска';
		this.content.id = 'searchList';
		this.details.classList.add('details');
		this.detailsContent.classList.add('detailsContent');
		this.conteiner.setAttribute('data-show', false);
		this.details.setAttribute('data-show', false);

		this.filter.id = 'searchFilter';
		this.filter.setAttribute('data-show', false);
		this.filter.innerHTML = '<button data-action="searchFilter" disabled><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44.023 44.023"><path d="M43.729.29a.98.98 0 0 0-.799-.276H1.099A.985.985 0 0 0 .301.29a.973.973 0 0 0-.203.306.995.995 0 0 0-.098.418c0 .292.129.549.329.731L15 22.284v20.662a.98.98 0 0 0 .077.446.997.997 0 0 0 .923.621.989.989 0 0 0 .749-.354l11.98-11.953a.984.984 0 0 0 .271-.828v-8.589L43.729 1.706a1 1 0 0 0 0-1.416zM27.284 21.288a.988.988 0 0 0-.284.759V30.6l-10 9.977v-18.53a.99.99 0 0 0-.284-.759L2.949 2.014h38.128L27.284 21.288z"/></svg></button>';

		this.details.innerHTML = '<button data-action="closeDetails"><svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"><polygon points="350,160.1 339.9,150 250,239.9 160.1,150 150,160.1 239.9,250 150,339.9 160.1,350 250,260.1 339.9,350 350,339.9 260.1,250 "/></svg></button>';

		this.details.appendChild(this.detailsContent);

		this.conteiner.appendChild(this.header);
		this.conteiner.appendChild(this.content);
		this.conteiner.appendChild(this.details);
		this.conteiner.appendChild(this.filter);

		document.body.insertBefore(this.conteiner, document.body.children[1]); // вставляем перед main

	}

	openDetails(parcel) { // открыть окно деталей

		this.showDetailsContent(parcel);

		this.details.setAttribute('data-show', true);

	}

	showDetailsContent(parcel) { // показываем контен деталей

		let engener = (parcel.cadEngener) ? parcel.cadEngener : 'Данных нет';

		this.detailsContent.innerHTML = `<h3><span>Кадастровый номер участка:</span><br> ${parcel.cadNum}</h3>
										 <p class="addres"><span>Адрес участка:</span><br> ${parcel.address}</p>
										 <p class="area"><span>Площадь участка:</span><br> ${parcel.cadArea} кв.м</p>
										 <p class="cost"><span>Кадастровая стоимость участка:</span><br> ${parcel.cadCost} руб. <br>Дата установления стоимости: ${parcel.dateCadCost}</p>
										 <p class="engener"><span>Кадастровый инженер:</span><br> ${engener}</p>
										 <p class="kvartal"><span>Квартал:</span><br> ${parcel.cadNumKvartal}</p>
										 <p class="category"><span>Категория земель:</span><br> ${parcel.categoryType}: ${parcel.categoryTypeName}</p>
										 <p class="util"><span>Разрешенное использование:</span><br> ${parcel.utilCode}: ${parcel.utilByDoc}</p>
										 <p class="tax"><span>Максимальный налог:</span><br> ${Math.floor(parcel.tax)} руб.</p>
										 <p class="dateCreate"><span>Дата созадния:</span><br> ${parcel.dateCreate}</p>
										 <p class="datePub"><span>Дата установления границ:</span><br> ${parcel.datePub}</p>
										 <p class="dateActual"><span>Дата установления атрибутов:</span><br> ${parcel.dateActual}</p>`;

	}

	closeDetails() { // закрыть окно деталей

		this.detailsContent.innerHTML = '';
		this.details.setAttribute('data-show', false);

	}

}
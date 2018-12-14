// google maps api
'use strict';
import eventEmitter from '../eventEmitter.js';
import messages from '../messages.js';
import Marker from './units/marker.js'; // маркеры
import infoWindow from './units/infoWindow.js'; // инфо окно
import Tile from './units/tile.js'; // тайл загрузки
import Point from './mods/point.js'; // режим поиска по одной точке
import Rectangle from './mods/rectangle.js'; // режим поиска по нескольким точкам
import SearchController from './searchController.js'; // отрисовщик данных на карте

export default class Map {

	constructor() {

		this.eventEmitter = eventEmitter.bus;
		this.searchController = new SearchController();
		this.urls = {

			pkk5grid: "https://terramark.ru/ajax/gridTilesGrid?x={x}&y={y}&z={z}&dpi=96&transparent=true&format=PNG32&bbox={bbox}&size=256,256&bboxSR=102100&imageSR=102100&f=image",
			parcelTile: 'https://terramark.ru/'

		};
		this.conteiner = document.getElementById("map"), // контейнер карты
		this.map = false; // объект карты
		L.TileLayer.Rosreestr = L.TileLayer.extend({ // слой росреестра
		    options: { // задаем размер тайлов

                tileSize: 256

            },
            getTileUrl: function (point) { // задем юрл тайлу

                let nwPoint = point.multiplyBy(this.options.tileSize);
                let sePoint = nwPoint.add([this.options.tileSize, this.options.tileSize]);
         
                let nw = this._map.options.crs.project(this._map.unproject(nwPoint, point.z)),
                    se = this._map.options.crs.project(this._map.unproject(sePoint, point.z));

                return L.Util.template(this._url, L.extend({

                    s: this._getSubdomain(point),
                    // layers: encodeURIComponent(':0,1,2,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,23,24,29,30,31,32,33,34,35,38,39'),
                    // size: encodeURIComponent(this.options.tileSize + ',' + this.options.tileSize),
                    z: point.z,
                    x: point.x,
                    y: point.y,
                    bbox: encodeURIComponent([nw.x, se.y, se.x, nw.y].join(','))

                }, this.options));

            },
            // onAdd: () => {
                // L.TileLayer.prototype.onAdd.call(this, this._map);

                // if (this.options.clickable) {
                //     L.DomUtil.addClass(this._container, 'huy');
                //     if (this._needInitInteraction) {
                //         this._initInteraction();
                //         this._needInitInteraction = false;

                //         console.log('123');
                //     }
                // }
            // },
            // _needInitInteraction: true,
            // _initInteraction: function () {
            //     let events = ['dblclick', 'click', 'mousedown', 'mouseover', 'mouseout', 'contextmenu', 'zoom'];

            //     for (let i = 0; i < events.length; i++) {

            //         L.DomEvent.on(this._container, events[i], this._fireMouseEvent, this);

            //     }

            // },
            // _fireMouseEvent: function (e) {
            //     if (this._map.dragging && this._map.dragging.moved()) { return; }

            //     let containerPoint = this._map.mouseEventToContainerPoint(e),
            //         layerPoint = this._map.containerPointToLayerPoint(containerPoint),
            //         latlng = this._map.layerPointToLatLng(layerPoint);

            //     this.fire(e.type, {

            //         latlng: latlng,
            //         layerPoint: layerPoint,
            //         containerPoint: containerPoint,
            //         originalEvent: e

            //     });
            // }
		});
		this.layers = { // слои карты

			google: L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
		    
				subdomains:['mt0','mt1','mt2','mt3']

			}),
			rosreestrGrid: new L.TileLayer.Rosreestr(this.urls.pkk5grid, {

				subdomains:['apkk5','bpkk5','cpkk5', 'dpkk5']

			}),
			osm: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			  
				attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'

			})

		};
		this.options = { // опции карты

		    searchOptions: { // параметры, при которых можно запускать глобальный поиск

		    	zoom: 16,
		    	width: 1200,
		    	height: 1200,
		    	targetsLimit: 5000

		    },
		    attributionControl: false, // банер leaflet
		    zoomControl: false, // кнопки zoom +-
		    doubleClickZoom: false, // двойной клик
		    inertia: true, // инертность карты
		    zoom: 13, // начальный зум
		    maxZoom: 17, // максимальный зум
		    minZoom: 5, // минимальный зум
		    editable: true,
		    // preferCanvas: true,

		};
		this.searchMode = { // режимы поиска участков

			mode: false,
			point: new Point(),
			rectangle: new Rectangle()

		};
		
		this.units = { // подключаем юниты

			infoWindow: new infoWindow(),
			markers: new Marker(),
			tile: new Tile()

		};

		this.eventEmitter.on('Map:enableSearchMode', this.enableSearchMode.bind(this));
		this.eventEmitter.on('Map:disableSearchMode', this.disableSearchMode.bind(this));

	}

	enableSearchMode(mode) { // назначить режим поиска участков

		if (!mode) return;
		this.disableSearchMode();
		this.eventEmitter.emit('showMessage', `${messages.map.events.mode}${messages.map.modeName[mode]}`);
		this.searchMode.mode = mode;

		// if (mode === 'rectangle') this.searchMode[this.searchMode.mode].init();

	}

	disableSearchMode() { // закрыть режим поиска

		if (this.searchMode.mode === false) return;

		this.searchMode.mode = false;

		this.eventEmitter.emit('MapMarker:delete');
		this.eventEmitter.emit('Rectangle:deleteRectangle');
		this.eventEmitter.emit('infoWindow:clearInfoWindow');
		this.eventEmitter.emit('Tile:deleteTile');
		this.eventEmitter.emit('SearchController:clearSearch');

		this.eventEmitter.emit('showMessage', `${messages.map.events.clear}`);

	}

	init(lat, lng) { // строим карту

		this.map = L.map(this.conteiner, this.options); // создаем карту
 
		this.map.setView([lat, lng]); // выводим карту

		this.map.addLayer(this.layers.google); // добавляем слой-подложку
		this.map.addLayer(this.layers.rosreestrGrid); // добавляем слой кадастровую сетку

		this.map.canvas = new L.canvas();
		this.map.canvas.addTo(this.map); // добавляем канвас на карту

		// let img = new Image();
		// img.src = 'images/test/1.png';

		// img.addEventListener('load', () => {

		// 	this.map.canvas._ctx.drawImage(img, 0, 0);

		// });

		// this.map.canvas.on('dragend', () => {

		// 	console.log(1);

		// });


		console.log(`Текущий zoom - ${this.map.getZoom()}`);

		this.units.markers.map = this.map; // показываем карту маркерам
		this.units.tile.map = this.map; // показываем карту тайлу для участку
		this.searchMode.rectangle.map = this.map; // показываем прямоугольнику карту

		this.listener(); // вешаем слушателя

	}

	listener() { // слушатель событий карты

		this.map.on('click', (e) => { // клик на карте

			(this.searchMode.mode === false) // если нет режима поиска то нахуй идите

				? this.eventEmitter.emit('showMessage', messages.map.events.nomodeclick) // выключен режим поиска

				: this.searchMode[this.searchMode.mode].init(e.latlng.lat, e.latlng.lng); // запускаем обработчик режима поиска

		});

		this.map.on('zoomend', (e) => { // изменение зума

			console.log(`Текущий zoom - ${this.map.getZoom()}`);

		});

	}

}
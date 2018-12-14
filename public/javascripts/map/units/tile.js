// tile рисуем на карте тайл участка
'use strict';
import eventEmitter from '../../eventEmitter.js';
import Calculator from '../calculator.js';
import Util from '../util.js';

export default class Tile {

	constructor() {

		this.eventEmitter = eventEmitter.bus;
        this.calc = new Calculator();
        this.util = new Util();

        this.timeOut = 300; // таймаут для загрузки тайлов

        this.util.createCanvas();

		this.map = false;
		this.tiles = []; // массив всех тайлов на текущей карте
        this.options = {};

		this.eventEmitter.on('Tile:showParcelTile', this.showParcelTile.bind(this));
        this.eventEmitter.on('Tile:deleteTile', this.deleteTile.bind(this));

	}

	showParcelTile(params) {

        setTimeout(() => {

            params = this.adapterImageOverlay(params);

            let tile = new L.imageOverlay(params.img, params.bound);

            tile.setOpacity(0.5)

            tile.addTo(this.map);

            this.tiles.push(tile);

            tile.on('load', () => {

                this.eventEmitter.emit('MapMarker:delete');

                // let points = {

                //     southWest: { // юго-запад

                //         lat: tile.getBounds()._southWest.lat,
                //         lng: tile.getBounds()._southWest.lng

                //     },
                //     northWest: { // северо-запад

                //         lat: tile.getBounds()._northEast.lat,
                //         lng: tile.getBounds()._southWest.lng

                //     },
                //     northEast: { // северо-восток

                //         lat: tile.getBounds()._northEast.lat,
                //         lng: tile.getBounds()._northEast.lng

                //     },
                //     southEast: { // юго-восток

                //         lat: tile.getBounds()._southWest.lat,
                //         lng: tile.getBounds()._northEast.lng

                //     }

                // }



                let latlng = [

                    L.latLng(tile.getBounds()._southWest.lat, tile.getBounds()._southWest.lng), // юго-запад
                    L.latLng(tile.getBounds()._northEast.lat, tile.getBounds()._southWest.lng), // северо-запад
                    L.latLng(tile.getBounds()._northEast.lat, tile.getBounds()._northEast.lng), // северо-восток
                    L.latLng(tile.getBounds()._southWest.lat, tile.getBounds()._northEast.lng) // юго-восток
                
                ];

                // let latlng = [

                //     L.latLng(tile.getBounds()._southWest.lat, tile.getBounds()._southWest.lng), // юго-запад
                //     L.latLng(tile.getBounds()._northEast.lat, tile.getBounds()._southWest.lng), // северо-запад
                //     L.latLng(tile.getBounds()._northEast.lat, tile.getBounds()._northEast.lng), // северо-восток
                //     L.latLng(tile.getBounds()._southWest.lat, tile.getBounds()._northEast.lng) // юго-восток
                
                // ];

                // let bounds = [

                //     [coords.northWest.lat, coords.northWest.lng],
                //     [coords.southEast.lat, coords.southEast.lng]
                
                // ];

                // let rec = new L.rectangle(bounds, { renderer: this.map.canvas }).addTo(this.map);

                let canvas = this.util.canvas;
                let canvasData = {
                    lXy: 0,
                    rXy: 0,
                    width: 0,
                    height: 0
                };
                // let conners = rec.getLatLngs()[0];

                // console.log(latlng);
                // console.log(bounds);
                // console.log(conners);

                canvasData.lXy = this.map.latLngToContainerPoint([latlng[1].lat, latlng[1].lng]);
                canvasData.rXy = this.map.latLngToContainerPoint([latlng[3].lat, latlng[3].lng]);

                canvasData.width = canvasData.rXy.x - canvasData.lXy.x;
                canvasData.height = canvasData.rXy.y - canvasData.lXy.y;

                canvas.width = document.documentElement.clientWidth;
                canvas.height = document.documentElement.clientHeight;

                let ctx = canvas.getContext('2d');

                let img = new Image();
                img.src = tile._url;
                img.crossOrigin = "Anonymous";

                this.calc.getRectangleData({

                    southWest: [latlng[0].lat, latlng[0].lng],
                    northWest: [latlng[1].lat, latlng[1].lng],
                    northEast: [latlng[2].lat, latlng[2].lng],
                    southEast: [latlng[3].lat, latlng[3].lng]

                });

                let targets = this.calc.getTargetsInSelectedArea(

                    latlng[1].lat, 
                    latlng[3].lat, 
                    latlng[1].lng, 
                    latlng[3].lng

                );

                let pixelsTargets = []; // массив целей в пикселях

                targets.forEach((item) => {

                    let a = this.map.latLngToContainerPoint([item[0], item[1]]);

                    pixelsTargets.push(a);

                });

                let targetsFilter = [];

                img.addEventListener('load', () => {

                    ctx.drawImage(img, canvasData.lXy.x, canvasData.lXy.y, canvasData.width, canvasData.height);                

                    pixelsTargets.forEach((item) => {

                        let imageData = ctx.getImageData(item.x, item.y, 1, 1);
                        let data = imageData.data;

                        if (data[3] === 0) { // если есть заливка создаем новый массив

                            targetsFilter.push(L.point(item.x, item.y)); 

                        }    

                    });

                    targetsFilter.forEach((item) => {

                        ctx.fillRect(item.x, item.y, 1, 1);

                    });

                }, false);

                // this.map.removeLayer(rec);

            });

        }, this.timeOut);

        // tile.on('error', (e) => {

        //     console.log(e);

        //     console.log('error');

        // });

	}

	adapterImageOverlay(params) {

		let latlngSw = new L.LatLng(params.bound[0][0], params.bound[0][1]),
            latlngNe = new L.LatLng(params.bound[1][0], params.bound[1][1]),
            pxSw = this.map.latLngToLayerPoint(latlngSw),
            pxNe = this.map.latLngToLayerPoint(latlngNe),
            width = Math.abs(pxNe.x - pxSw.x) + 1,
            height = Math.abs(pxSw.y - pxNe.y) + 1;


        if (width > height) {
            let middle = (latlngSw.lat + latlngNe.lat) / 2,
                delta = (latlngSw.lat - latlngNe.lat) / 2

            latlngSw.lat = middle + delta * (width / height);
            latlngNe.lat = middle - delta * (width / height);


        } else {
            let middle = (latlngSw.lng + latlngNe.lng) / 2,
                    delta = (latlngSw.lng - latlngNe.lng) / 2;

            latlngSw.lng = middle + delta * (height / width);
            latlngNe.lng = middle - delta * (height / width);

        }

        return {  
            img: params.img,
            bound: [
                [latlngSw.lat, latlngSw.lng],
                [latlngNe.lat, latlngNe.lng]
            ],
            offset: params.offset
        };

	}

    deleteTile() {

        this.tiles.forEach((item) => {

            this.map.removeLayer(item);

        });

        this.tiles = [];

    }

}
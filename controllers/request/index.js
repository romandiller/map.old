// request
'use strict';
const request = require('request');
const fs = require('fs');

class Request {

	static searchParcelByCoords(coords, callback) {

		let url = `https://terramark.ru/rest/parcels?text=${coords.lat},${coords.lng}`;
		let data = [];

		request({

	        method             : 'GET',
	        url                : url,
	        headers            : { 

	        	"Content-Type": "application/json"

	        },
	        timeout            : 10000,
	        gzip               :  true 

        }, (err, response, body) => {

                if (err) console.log(err);

                // callback(response);
                    
        }).on('data', (chunk)=> {

            data.push(chunk);                

        }).on('end', () => {

        	let string = data.toString();
        	let edit = string.replace(/,?(.)$/i,'$1');

        	let ob = (edit === '[]') ? null : JSON.parse(edit);

        	let result = null;

        	if (ob !== null) {

        		result = {

        			id: '',
        			parcels: []

        		};

        		ob.parcels.forEach((item) => {

        			let imageName = item.imgSrc.match(/[0-9_]+.png$/gi); // получаем имя тайла участка - это массив
					item.imageName = imageName[0];
        			
        			result.id += item.cadNum.replace(/:/g, '');
					result.parcels.push(item);
					result.new = true;

        			this.getParcelImage(item.imgSrc, imageName[0]);

        		});

        	}

			callback(JSON.stringify(result));

        });

	}

	static getParcelImage(imageSrc, name) { // грузим на локальный картинку участка

		let image = new Buffer(0);

		request({

			method: 'GET',
			url: `https://terramark.ru${imageSrc}`

		}, (err, response, body) => {

			if (err) console.log(err);



		}).on('data', (chunk)=> {

            image = Buffer.concat([image, chunk]);
            
        }).on('end', () => {

            // fs.writeFile(`public/images/parcels/${name}`, image, (err) => {

            //     if (err) console.log(err.message);

            // });

        }).pipe(fs.createWriteStream(`public/images/parcels/${name}`));

	}

}


module.exports = Request;
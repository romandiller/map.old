const fs = require('fs');

class Service {

	constructor() {

		this.count = 0;
		this.files = [];

	}

	createFilePng() {

		fs.writeFileSync(this.count + '.txt', '');

		this.count++;

	}

	createFileStream() {

		fs.createWriteStream('./' + this.count + '.png');
		this.count++;

		return this;

	}

	returnCounter() {

		this.count++;

		return this.count;

	}

	setUrlString(url ,obj) {

		let str = `${url}?`;

		for (let key in obj) {

			str += `${key}=${obj[key]}&`;

		}

		return str.substring(0, str.length - 1);

	}

}

module.exports = Service;
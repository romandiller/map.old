// Forms
'use strict';
import eventEmitter from './eventEmitter.js';

export default class Forms {

	constructor() {

		this.eventEmitter = eventEmitter.bus;
		 
		this.eventEmitter.on('Forms:test', this.test);

	}

	test(data) {

		console.log(data);

	}

}
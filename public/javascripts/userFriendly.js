// userFriendly
'use strict';
import eventEmitter from './eventEmitter.js';

export default class userFriendly {

	constructor() {

		this.eventEmitter = eventEmitter.bus;
		this.element = document.querySelector('#message p');
		this.timeOut = 0;
		this.delay = 3000;
		this.eventEmitter.on('showMessage', this.showMessage.bind(this));

	}

	showMessage(msg) {

		clearInterval(this.timeOut);

		this.element.innerHTML = msg;

		this.timeOut = setTimeout(() => {

			this.clearMessage();

		}, this.delay);

	}

	clearMessage() {

		this.element.innerHTML = '';

	}

}
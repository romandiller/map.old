'use strict';
import eventEmitter from './eventEmitter.js';
import messages from './messages.js';
import userFriendly from './userFriendly.js';
import Location from './map/location.js';
import Controller from './controller.js';

export default class Application {

	constructor() {

		this.eventEmitter = eventEmitter.bus;
		this.ui = new userFriendly();
		this.location = new Location();
		this.controller = new Controller();

		this.listener();
		
		this.eventEmitter.emit('Location:init');

	}

	listener() { // слушатель событий кнопок

		document.addEventListener('click', (e) => {

			e = e || window.e;
        	let target = e.target || e.srcElement;

        	while (target !== document) {

        		let action = target.dataset.action;

				if (action) {

					e.preventDefault();
				
					(typeof this.controller[action] === 'function') ? this.controller[action](target) : false;

					break;
				
				}
					
        		target = target.parentNode;

        	}

		}, true);

		document.addEventListener('contextmenu', (e) => {

			e.preventDefault();
			
		});

	}

}
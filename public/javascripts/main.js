// main
'use strict';
import eventEmitter from './eventEmitter.js';
import Application from './application.js';

document.addEventListener('DOMContentLoaded', () => {

	eventEmitter.init();
	const application = new Application();

});
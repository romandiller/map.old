// eventEmitter
"use strict";

export default class eventEmitter {

	constructor() {

		this.eventHandlers = {};

	}

	static init() {

		this.bus = new eventEmitter();

	}

	on(eventName, handler) { // добавление события

        if (this.eventHandlers[eventName]) return;
        
        eventName.split(",").map((e) => {

        	this.eventHandlers[eventName] = [];
            this.eventHandlers[eventName].push(handler);

        });

	}

	emit(eventName) { // вызов события

        if (!this.eventHandlers || !this.eventHandlers[eventName]) {

        	console.log('Не назначили обработчик');
        	return;

        }

        for (let i = 0; i < this.eventHandlers[eventName].length; i++) {

            this.eventHandlers[eventName][i].apply(this, [].slice.call(arguments, 1));
        
        }

	}

	off(eventName, handler) { // удаление события

		if (eventName in this.eventHandlers === true) delete this.eventHandlers[eventName];

	}

}
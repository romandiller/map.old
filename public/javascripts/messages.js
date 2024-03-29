// messages
'use strict';

let messages = {

	map: {

		position: {

			ok: 'Мы определили вашу позицию! Спасибо за доверие',
			block: 'Мы уважаем ваше желание и больше не будем определять ваше местоположение! Хорошего вам настроения!',
			timeoutError: 'Местоположение не установленно, превышено время ожидания!',
			netError: 'Проблемы подключения к службе геолокации!',
			unknownError: 'Неизвестная ошибка геолокации!'

		},
		events: {

			nomodeclick: 'Не выбран режим поиска. Выберите нужный режим и выбирайте земли!',
			mode: 'Выбран режим: ',
			clear: 'Режим поиска отключен. Карта очищена!',
			softerror: 'Внимание! Ошибка софта!',
			searchStart: 'Идет поиск змели...',
			searchEnd: 'Поиск закончен!',
			searchFail: 'Поиск не удался. Печалька!'

		},
		modeName: {

			point: 'поиск по точке. Поставьте на карте и получите данные по участку!',
			polygon: 'поиск по нескольким точкам. Поставьте на карте несколько точек и нажмите кнопку!',
			rectangle: 'поиск по прямоугольнику. Поставьте две точки на карте, меняйте размер и жмите кнопку!'

		},
		grid: {

			pkk5loaded: 'Элементы кадастровой карты загружены'

		},
		search: {

			bigzoom: 'Слишком большая зона для поиска! Измените размер выделенного участка',
			allright: 'Все нормально, щас все будет!',
			pleasewelcome: 'Получите распишитесь! Теперь начинайте поиск или изменяйте границы поиска!'

		}

	},
	socket: {

		connect: 'соединение установлено...',
		close: 'соединение закрыто...'

	}

};

export default messages;
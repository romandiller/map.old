let cvs = document.getElementById('canvas');
let button = document.getElementById('button');
let ctx = cvs.getContext('2d');

let colors = [[255,255,0],[228,60,30],[53,198,29]];
let colorLength = colors.length;
let flag = false;

let images = [];
let options = {

	width: 400,
	height: 400

};
let urls = [
	'images/test/1.png',
	'images/test/2.png',
	'images/test/3.png'
];

cvs.width = document.documentElement.clientWidth;
cvs.height = document.documentElement.clientHeight;

function addImage(e) {
	
	if (images.length === colorLength) {

		console.log('больше нельзя добавлять картинок');
		return;

	}

	console.log('Добавили новую картинку');

	let img = new Image();
	img.src = urls[images.length];

	let color = colors.pop();

	images.push(img);

	img.addEventListener('load', () => {

		let x = 0;

		switch (images.length) {

			case 2:
				x = 400;
				break;
			case 3: 
				x = 800;
				break;
			default:
				x = 0;
		}

		ctx.drawImage(img, x, 0, options.width, options.height);

		let imageData = ctx.getImageData(x, 0, img.width, img.height);
		let data = imageData.data;

		for (let i = 0, n = data.length; i < n; i += 4) {
			
			// if (data[i] !== 0 && data[i + 1] !== 0) {

				data[i] = color[0];
				data[i + 1] = color[1];
				data[i + 2] = color[2];

			// }

		}
	     
	    ctx.putImageData(imageData, x, 0);

	});

}

// события click

button.addEventListener('click', addImage);

cvs.addEventListener('click', (e) => {

	if (!images.length) return;

	let imageData = ctx.getImageData(e.offsetX, e.offsetY, 1, 1);
	let data = imageData.data;

	(data[3] === 0) ? console.log('нет объекта') : console.log('есть объект');

}, false);

canvas.addEventListener('contextmenu', (e) => {

	e.preventDefault();

});
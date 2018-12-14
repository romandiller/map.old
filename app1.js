const http = require('http');
const config = require('./config.json');
const Service = require('./service.js');
// const Request = require('./request.js');
// const service = new Service();
// const request = new Request();
const request = require("request");

let terramarkParams = { 

	x             : '1498',
	y             : '645',
	z             : '11',
	dpi           : '96',
	transparent   : 'true',
	format        : 'PNG32',
	bbox          : '9275174.760236427,7396658.353099933,9294742.639477432,7416226.232340938',
	size          : '256,256',
	bboxSR        : '102100',
	imageSR       : '102100',
	f             : 'image' 

};

let land = 'https://terramark.ru/rest/parcels?text=55.78429593735242%2C37.893218994140625&token=fd76b83e78396a995ff225ad15e44bac';

let data2 = {

    layers : 'show%3A0%2C1%2C2%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19%2C20%2C23%2C24%2C29%2C30%2C31%2C32%2C33%2C34%2C35%2C38%2C39',
    dpi : '96',
    format : 'PNG32',
    bbox : '9233593.017622653,2C7362414.56409202,2C9236039.002527844,2C7364860.54899721',
    bboxSR: '102100',
    imageSR: '102100',
    size: '1024,2C1024',
    transparent : 'true',
    f: 'image'

};

let urls = {

    localhost: "http://localhost:5001",
    pkks: "https://" + ['a','b','c'][Math.ceil((Math.random()*1000))%3] +".pkk5.rosreestr.ru/arcgis/rest/services/Cadastre/Cadastre/MapServer/export",
    pkk: "http://" + ['a','b','c'][Math.ceil((Math.random()*1000))%3] +".pkk5.rosreestr.ru/arcgis/rest/services/Cadastre/Cadastre/MapServer/export",
    google: "https://google.com",
    tehnokon: "http://tehnokon.com",
    pkk5: "http://pkk5.rosreestr.ru/arcgis/rest/services/Cadastre/Cadastre/MapServer/export",
    terramark: "https://terramark.ru/ajax/gridTilesGrid?x=1237&y=640&z=11&dpi=96&transparent=true&format=png32&bbox=4167958.2783340905,7494497.749304961,4187526.1575750955,7514065.628545966&size=256,256&bboxSR=102100&imageSR=102100&f=image",
    test: "https://pkk5.rosreestr.ru/arcgis/rest/services/BaseMaps/BaseMap/MapServer/tile/7/36/79?blankTile=false",
    test1: "https://pkk5.rosreestr.ru/arcgis/rest/services/BaseMaps/BaseMap/MapServer/tile/13/2591/5984?blankTile=false",
    tile: "https://pkk5.rosreestr.ru/arcgis/rest/services/BaseMaps/BaseMap/MapServer/tile/16/20727/47868",
    tile2: "https://pkk5.rosreestr.ru/arcgis/rest/services/Cadastre/Cadastre/MapServer/export?layers=show%3A0%2C1%2C2%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19%2C20%2C23%2C24%2C29%2C30%2C31%2C32%2C33%2C34%2C35%2C38%2C39&dpi=96&format=PNG32&bbox=9233593.017622653%2C7362414.56409202%2C9236039.002527844%2C7364860.54899721&bboxSR=102100&imageSR=102100&size=1024%2C1024&transparent=true&f=image",
    testTile: "https://pkk5.rosreestr.ru/arcgis/rest/services/Cadastre/CadastreSelected/MapServer/export?dpi=96&transparent=true&format=png32&layers=show%3A6%2C7&bbox=9233341.558550742%2C7363469.0207661055%2C9233529.963882122%2C7363752.6738006715&bboxSR=102100&imageSR=102100&size=631%2C950&layerDefs=%7B%226%22%3A%22ID%20%3D%20%2754%3A35%3A74530%3A44%27%22%2C%227%22%3A%22ID%20%3D%20%2754%3A35%3A74530%3A44%27%22%7D&f=image"

};

let gridItems = [

    'https://terramark.ru/ajax/gridTilesGrid?x=1237&y=640&z=11&dpi=96&transparent=true&format=png32&bbox=4167958.2783340905,7494497.749304961,4187526.1575750955,7514065.628545966&size=256,256&bboxSR=102100&imageSR=102100&f=image"',
    'https://terramark.ru/ajax/gridTilesGrid?x=1236&y=641&z=11&dpi=96&transparent=true&format=png32&bbox=4148390.3990930854,7474929.870063956,4167958.2783340905,7494497.749304961&size=256,256&bboxSR=102100&imageSR=102100&f=image"',
    'https://terramark.ru/ajax/gridTilesGrid?x=1236&y=642&z=11&dpi=96&transparent=true&format=png32&bbox=4148390.3990930854,7455361.99082295,4167958.2783340905,7474929.870063956&size=256,256&bboxSR=102100&imageSR=102100&f=image"',
    'https://terramark.ru/ajax/gridTilesGrid?x=1239&y=642&z=11&dpi=96&transparent=true&format=png32&bbox=4207094.036816101,7455361.99082295,4226661.916057105,7474929.870063956&size=256,256&bboxSR=102100&imageSR=102100&f=image"',
    'https://pkk5.rosreestr.ru/arcgis/rest/services/Cadastre/Cadastre/MapServer/export?layers=show%3A0%2C1%2C2%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19%2C20%2C23%2C24%2C29%2C30%2C31%2C32%2C33%2C34%2C35%2C38%2C39&dpi=96&format=PNG32&bbox=9231147.032717466%2C7362414.56409202%2C9236039.002527844%2C7367306.533902401&bboxSR=102100&imageSR=102100&size=1024%2C1024&transparent=true&f=image',
    'https://pkk5.rosreestr.ru/arcgis/rest/services/Cadastre/Cadastre/MapServer/export?layers=show%3A0%2C1%2C2%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19%2C20%2C23%2C24%2C29%2C30%2C31%2C32%2C33%2C34%2C35%2C38%2C39&dpi=96&format=PNG32&bbox=9236039.002527844%2C7362414.56409202%2C9240930.972338226%2C7367306.533902401&bboxSR=102100&imageSR=102100&size=1024%2C1024&transparent=true&f=image',
    'https://terramark.ru/ajax/gridTilesGrid?x=1237&y=640&z=11&dpi=96&transparent=true&format=png32&bbox=4167958.2783340905,7494497.749304961,4187526.1575750955,7514065.628545966&size=256,256&bboxSR=102100&imageSR=102100&f=image"',
    'https://terramark.ru/ajax/gridTilesGrid?x=1236&y=641&z=11&dpi=96&transparent=true&format=png32&bbox=4148390.3990930854,7474929.870063956,4167958.2783340905,7494497.749304961&size=256,256&bboxSR=102100&imageSR=102100&f=image"',
    'https://terramark.ru/ajax/gridTilesGrid?x=1236&y=642&z=11&dpi=96&transparent=true&format=png32&bbox=4148390.3990930854,7455361.99082295,4167958.2783340905,7474929.870063956&size=256,256&bboxSR=102100&imageSR=102100&f=image"',
    'https://terramark.ru/ajax/gridTilesGrid?x=1239&y=642&z=11&dpi=96&transparent=true&format=png32&bbox=4207094.036816101,7455361.99082295,4226661.916057105,7474929.870063956&size=256,256&bboxSR=102100&imageSR=102100&f=image"',
    'https://pkk5.rosreestr.ru/arcgis/rest/services/Cadastre/Cadastre/MapServer/export?layers=show%3A0%2C1%2C2%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19%2C20%2C23%2C24%2C29%2C30%2C31%2C32%2C33%2C34%2C35%2C38%2C39&dpi=96&format=PNG32&bbox=9231147.032717466%2C7362414.56409202%2C9236039.002527844%2C7367306.533902401&bboxSR=102100&imageSR=102100&size=1024%2C1024&transparent=true&f=image',
    'https://pkk5.rosreestr.ru/arcgis/rest/services/Cadastre/Cadastre/MapServer/export?layers=show%3A0%2C1%2C2%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19%2C20%2C23%2C24%2C29%2C30%2C31%2C32%2C33%2C34%2C35%2C38%2C39&dpi=96&format=PNG32&bbox=9236039.002527844%2C7362414.56409202%2C9240930.972338226%2C7367306.533902401&bboxSR=102100&imageSR=102100&size=1024%2C1024&transparent=true&f=image',
    'https://pkk5.rosreestr.ru/arcgis/rest/services/Cadastre/Cadastre/MapServer/export?layers=show%3A0%2C1%2C2%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19%2C20%2C23%2C24%2C29%2C30%2C31%2C32%2C33%2C34%2C35%2C38%2C39&dpi=96&format=PNG32&bbox=9236039.002527844%2C7362414.56409202%2C9238484.987433035%2C7364860.54899721&bboxSR=102100&imageSR=102100&size=1024%2C1024&transparent=true&f=image',
    'https://pkk5.rosreestr.ru/arcgis/rest/services/Cadastre/Cadastre/MapServer/export?layers=show%3A0%2C1%2C2%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19%2C20%2C23%2C24%2C29%2C30%2C31%2C32%2C33%2C34%2C35%2C38%2C39&dpi=96&format=PNG32&bbox=9236039.002527844%2C7364860.54899721%2C9238484.987433035%2C7367306.533902401&bboxSR=102100&imageSR=102100&size=1024%2C1024&transparent=true&f=image',
    'https://pkk5.rosreestr.ru/arcgis/rest/services/Cadastre/Cadastre/MapServer/export?layers=show%3A0%2C1%2C2%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19%2C20%2C23%2C24%2C29%2C30%2C31%2C32%2C33%2C34%2C35%2C38%2C39&dpi=96&format=PNG32&bbox=9233593.017622653%2C7362414.56409202%2C9236039.002527844%2C7364860.54899721&bboxSR=102100&imageSR=102100&size=1024%2C1024&transparent=true&f=image',
    'https://pkk5.rosreestr.ru/arcgis/rest/services/Cadastre/Cadastre/MapServer/export?layers=show%3A0%2C1%2C2%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19%2C20%2C23%2C24%2C29%2C30%2C31%2C32%2C33%2C34%2C35%2C38%2C39&dpi=96&format=PNG32&bbox=9233593.017622653%2C7364860.54899721%2C9236039.002527844%2C7367306.533902401&bboxSR=102100&imageSR=102100&size=1024%2C1024&transparent=true&f=image'

];

let newGrid = [
    'http://pkk5.rosreestr.ru/arcgis/rest/services/Cadastre/Cadastre/MapServer/export?x=1498&y=645&z=11&dpi=96&transparent=true&format=PNG32&bbox=9275174.760236427%2C7396658.353099933%2C9294742.639477432%2C7416226.232340938&size=256%2C256&bboxSR=102100&imageSR=102100&f=image'
];

let reqData = [];

let d = 'http://pkk5.rosreestr.ru/api/features/1?text=55.06431236842737%2C83.0222225189209&token=ff4ebbb8430b56972e214173ecf702b0';

let p = 'https://pkk5.rosreestr.ru/api/features/1?text=55,028278%2083,014310';

request({

        method             : 'GET',
        url                : p,
        headers            : { "Content-Type": "application/json" },
        timeout            : 10000,
        gzip               :  true,
        qs: {
            // text: '?text=55.06431236842737%2C83.0222225189209',
            onlyAttributes: false,
            returnGeometry: true,
            limit:10,
            f: "json"
        } 

        }, (err, response, body) => {

                if (err) console.log(err);
                // console.log(response);
                console.log(body.toString());
                    
            }).on('data', (chunk)=> {

                reqData.push(chunk);                

            }).on('end', () => {

                // console.log(reqData.toString());

                // fs.createWriteStream('./test.png');

            });

// let url = service.setUrlString(urls.pkk5, terramarkParams);
// console.log(url);

// newGrid.forEach((item, i) => {

//     request.get({

//         method: 'GET',
//         url: item,
//         timeout: 10000,
//         image: i

//     });

// });
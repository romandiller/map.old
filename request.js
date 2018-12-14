const request = require("request");
const fs = require('fs');

class Request {

	constructor() {

		this.image = new Buffer(0);
		this.proxyServers = {

		    http: {

		        one: "http://1.2.169.39:53580",
		        two: "http://95.78.157.140:8888",
		        three: "http://194.114.128.149:61213",
		        four: "http://176.196.239.46:35656"

		    },
		    https: {

		        one: ""

		    },
		    ktotam : "https://ktotam:ktotam.pro@138.201.245.228:1111" // не работает

		};

	}

	get(options) {

		request({

        method             : options.method,
        url                : options.url,
        headers            : { "Content-Type": "application/json" },
        timeout            : options.timeout,
        gzip               :  true,
        // proxy              : this.proxyServers.ktotam
        // qs                 : terramarkParams

	    }, (err, response, body) => {

	            console.log(err);
	            // console.log(response);
	            console.log(body);
	                
	        }).on('data', (chunk)=> {

	            // console.log(chunk);

	            this.image = Buffer.concat([this.image, chunk]);

	        }).on('end', () => {

	            console.log(this.image);

	            // fs.createWriteStream('./test.png');

	        }).pipe(fs.createWriteStream('./images/' + options.image + '.png'));

	}

}

module.exports = Request;
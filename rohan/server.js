// modules =================================================
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');

// configuration ===========================================

var port = process.env.PORT || 8080; // set our port

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({limit:"50000mb", type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({limit:"50000mb", extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

app.post('/endpoint', function(req, res){
	Canvas = require('canvas');
	
	var obj = {};
	console.log('body: ' + JSON.stringify(req.body));

	if(err) throw err;
	// var URL = window.URL || window.webkitURL;
	// convert blob to image
	var pic = new Canvas.Image;
	console.log("hi1");
	pic.src = req.imgData;
	console.log("hi");
	console.log(pic);

	var fs = require('fs');
	fs.writeFile("/tmp/test.png", pic, function(err) {
		if(err) {
			return console.log(err);
		}
		console.log("File saved");
	});

	// save blob to file

	// pass file to clarify

	// 

	res.send(req.body);
});

// routes ==================================================
// require('./app/routes')(app); // pass our application into our routes

// start app ===============================================
app.listen(port);	
console.log('Magic happens on port ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app






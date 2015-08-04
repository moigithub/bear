// server.js

// BASE SETUP
// =====================================================================

// call the packages we need

var express = require("express");
var app = express();
var bodyParser = require("body-parser");

var mongoose = require("mongoose");
//mongoose.connect("mongodb://node:node@novus.modulusmongo.net:27017/Iganiq8o");
mongoose.connect("mongodb://localhost:27017/Bears");

var Bear = require("./app/models/bear.js");

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();  // get an instance of the express Router

//middleware to use for all request
router.use(function(req, res, next){
	//do something
	console.log("something happening.");
	next(); // make sure we go to the next routes and dont stop here
});

//test route to make sure everthing is working
router.get("/", function(req, res){
	res.json({message: "hoooray! welcome to our api!"});
});


// more routes for our API will happen here


// REGISTER OUR ROUTES ------
// all of our routes will be prefixed with /api
app.use("/api", router);


// on routes that end in /bears
router.route("/bears")
	// create a bear (accessed at POST http://localhost:8080/api/bears)
	.post(function(req,res){
		var bear = new Bear(); // new isntance of Bear model
		bear.name = req.body.name;
		//save
		bear.save(function(err){
			if(err)
				res.send(err);

			res.json({message: "Bear created!"});
		});
	})

	//get all bears ( GET http://localhost:8080/api/bears)
	.get(function(req,res){
		Bear.find(function(err, bears){
			if(err)
				res.send(err);

			res.json(bears);
		});
	});

router.route("/bears/:bear_id")
	// get the bear with that id
	// accessed ( GET http://localhost:8080/api/bears/:bear_id)
	.get(function(req, res){
		Bear.findById(req.params.bear_id, function(err, bear){
			if (err)
				res.send(err);
			res.json(bear);
		});
	})

	// update bear with this id
	// accessed PUT http://localhost:8080/api/bear/:id
	.put(function(req, res){
		// use our bear model to find the bear we want
		Bear.findById(req.params.bear_id, function(err, bear){
			if(err)
				res.send(err);

			bear.name = req.body.name; //update bear info

			bear.save(function(err){
				if(err)
					res.send(err);

				res.json({message:"Bear updated!"});
			});
		})
	})

	//delete bear
	.delete(function(req,res){
		Bear.remove({
			_id: req.params.bear_id
		}, function(err,bear){
			if(err)
				res.send(err);
			res.json({message:"deleted!"});
		})
	})
	;

// START THE SERVER 
// =================================
app.listen(port);
console.log("Magic happens on port"+ port);

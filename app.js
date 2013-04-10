"use strict";

/*
	debug everything \o/
	i know i shouldn't do this, because of this: https://gist.github.com/felixge/955659d1f1d8a530f2ff (https://github.com/felixge/node-mysql/issues/439)
*/

Error.stackTraceLimit = Infinity;

var
	http = require( "http" ),
	path = require( "path" ),
	express = require( "express" ),
	mongoose = require( "mongoose" ),
	config = require( "config" ),
	debug = require( "debug" )( "pin-clone" ),
	parser = require( "./lib/parser" );

var app = express();

/*
	db
*/
mongoose.connect( config.mongo, function( err ){
	if( err ){
		return console.error( err );
	}
	if( !process.env.NOFETCH ){
		parser.refresh();
	}
});

require( "./lib/model/images" );

require( "./lib/model/site" );

/*
	configure
*/

app.configure(function(){
	app.set( "views", path.join( __dirname, "/views" ) );
	app.set( "view engine", "jade");
	app.use( express.favicon() );
	app.use( express.bodyParser() );
	app.use( express.methodOverride() );
	app.use( app.router );
	app.use( express.static(path.join(__dirname, "public" )) );
});

app.configure( "development", function(){
	mongoose.set( "debug", true );
	app.use(express.logger("dev"));
	app.use(express.errorHandler({
		dumpExceptions: true
	}));
});

app.configure( "production", function(){
	app.use( express.errorHandler() );
});

/*
	Routes
*/
app.configure( "development", function(){
	var
		browserify = require( "browserify-middleware" ),
		jadeify2 = require( "jadeify2" );
	browserify.settings({
		//transform: [ "jadeify2" ]
	});
	app.get( "/js/bundle.js", browserify( "./public/js/main.js",{
		transform: [ function(){ console.log("jadeify2 called", arguments ); return jadeify2.apply( this, arguments );} ]
	}));
});

var mainRoute = require( "./lib/routes/main" );

app.get( "/", mainRoute.index );

app.get( "/pin", mainRoute.pin );

app.get( "/pin/:id", mainRoute.pinById );
/*
	creating the http server
*/

var server = http.createServer( app );

server.listen( config.port, function( err ){
	if( err ){
		return console.error( "Couldn't start server, reason: ", err );
	}
	console.log( "Server is running:", server.address().address + ":" + server.address().port );
});
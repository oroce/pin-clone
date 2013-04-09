var
	http = require( "http" ),
	path = require( "path" ),
	express = require( "express" ),
	mongoose = require( "mongoose" ),
	config = require( "config" ),
	browserify = require( "browserify-middleware" ),
	debug = require( "debug" )( "pin-clone" );
	parser = require( "./lib/parser" );
var app = express();

/*
	db
*/
mongoose.connect( config.mongo, function( err ){
	if( err ){
		return console.error( err );
	}

	parser.refresh();
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
	mongoose.set( "verbose", true );
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
	app.get( "/js/bundle.js", browserify( "./public/js/main.js" ) );
});

var mainRoute = require( "./lib/routes/main" );

app.get( "/", mainRoute.index );

app.get( "/pin/:id", mainRoute.pin );

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
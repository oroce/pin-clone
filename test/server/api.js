"use strict";

var
	app = require( "../../app" ),
	supertest = require( "supertest" ),
	mongoose = require( "mongoose" );

var ImageModel = require( "../../lib/model/images" );

before(function(){
	mongoose.connection.on( "error", function() {});
	mongoose.connect( process.env.MONGODB_URL );
});

before(function( done ){
	ImageModel.remove({}, done );
});

after(function( done ){
	mongoose.connection.close( done );
});
describe( "GET /", function(){
	it( "should response with html", function( done ){
		supertest( app )
			.get( "/" )
			.set( "Accept", "application/json" )
			.expect( "Content-Type", /html/ )
			.expect( 200, done );
	});
});

describe( "GET /pin", function(){
	it( "should response with html", function( done ){
		supertest( app )
			.get( "/pin" )
			.set( "Accept", "application/json" )
			.expect( "Content-Type", /json/ )
			.expect( 200, done );
	});
});

describe( "GET /pin/:id", function(){

	beforeEach(function(){
		this.randomId = new mongoose.mongo.BSONPure.ObjectID();
	});

	before(function( done ){
		var self = this;
		new ImageModel({
			originalUrl: "http://example.org",
			image: {
				small: {
					defaultUrl: "http://example.org/small.png"
				},
				medium: {
					defaultUrl: "http://example.org/small.png"
				}
			}
		}).save(function( err, doc ){
			if( err ){
				return done( err );
			}
			self.imageModel = doc;
			done();
		});

	});

	it( "should response with html", function( done ){
		supertest( app )
			.get( "/pin/" + this.imageModel.id )
			.set( "Accept", "text/html" )
			.expect( "Content-Type", /html/ )
			.expect( 200, done );
	});

	it( "should response with json", function( done ){
		supertest( app )
			.get( "/pin/" + this.imageModel.id )
			.set( "Accept", "application/json" )
			.expect( "Content-Type", /json/ )
			.expect( 200, done );
	});

	it( "should response with html with 200 ok", function( done ){
		supertest( app )
			.get( "/pin/" + this.randomId )
			.set( "Accept", "text/html" )
			.expect( "Content-Type", /html/ )
			.expect( 200, done );
	});

	it( "should response with json with 404", function( done ){
		supertest( app )
			.get( "/pin/" + this.randomId )
			.set( "Accept", "application/json" )
			.expect( "Content-Type", /json/ )
			.expect( 404, done );
	});
});
/* jshint -W068 */
"use strict";

var should = require( "should" );

var
	mongoose = require( "mongoose" ),
	ImagesModel = require( "../../lib/model/images" ),
	SiteModel = require( "../../lib/model/site" );

before(function(){
	mongoose.connection.on( "error", function() {});
	mongoose.connect( process.env.MONGODB_URL );
});

after(function( done ){
	mongoose.disconnect( done );
});

describe( "ImagesModel", function(){

	it( "shouldn't create model without originalUrl", function( done ){
		var instance = new ImagesModel({});
		instance.save(function( err ){
			should.exist( err );
			done();
		});
	});

	it( "should return with error if originalUrl isn't valid", function( done ){
		var instance = new ImagesModel({
			originalUrl: "dummy"
		});
		instance.save(function( err ){
			should.exist( err );
			done();
		});
	});

	it( "should create instance with originalUrl", function( done ){
		var instance = new ImagesModel({
			originalUrl: "http://example.org"
		});
		instance.save(function( err, doc ){
			should.not.exist( err );
			should.exist( doc );
			doc.should.have.property( "originalUrl", "http://example.org/" );
			done();
		});
	});
});

describe( "SiteModel", function(){

	it( "should return with error if url isn't valid", function( done ){
		var instance = new SiteModel({
			originalUrl: "dummy"
		});
		instance.save(function( err ){
			should.exist( err );
			done();
		});
	});
});
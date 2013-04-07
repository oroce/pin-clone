/* jshint -W068 */
"use strict";
var
	should = require( "should" ),
	ImageModel = require( "../../public/js/image" ),
	ImagesCollection = require( "../../public/js/images" );

describe( "ImagesCollection", function(){

	before(function(){
		this.imagesCollection = new ImagesCollection();
	});

	it( "ImagesCollection model should be Image", function(){
		should.exist( ImagesCollection.prototype.model );
		ImagesCollection.prototype.model.should.strictEqual( ImageModel );
	});

	it( "ImagesCollection url should be /pin", function(){
		this.imagesCollection.url.should.equal( "/pin" );
	});
});

describe( "ImageModel", function(){

	it( "should throw error if you want create instance without id", function(){
		(function(){
			new ImageModel();
		}).should.throw();
	});

	it( "id should be _id", function(){
		var instance = new ImageModel({
			_id: 1
		});

		instance.id.should.strictEqual( 1 );
	});

	it( "ImageModel instance url should be /pin/:id", function(){
		var instance = new ImageModel({
			_id: 15
		});

		instance.url().should.equal( "/pin/15" );
	});
});
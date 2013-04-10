"use strict";
var
	Backbone = require( "backbone" ),
	util = require( "util" );

var ImageModel = Backbone.Model.extend({
	initialize: function( attrs ){
		if( !this.id ){
			throw new ImageModel.MissingIdError( attrs );
		}

		if( !this.get( "originalUrl") ){
			throw new ImageModel.MissingOriginalUrl();
		}
	},
	idAttribute: "_id",
	urlRoot: "/pin"
}, {
	MissingIdError: function( attrs ){
		Error.call( this, arguments );
		this.message = "Missing ID";
		this.attrs = attrs;
		this.toString = function(){
			return "Missing ID, you passed the following arguments: " + JSON.stringify( attrs );
		}
	},
	MissingOriginalUrl: function(){
		Error.call( this, arguments );
		this.message = "Missing originalUrl";
	}
});

util.inherits( ImageModel.MissingIdError, Error );

util.inherits( ImageModel.MissingOriginalUrl, Error );

module.exports = ImageModel;
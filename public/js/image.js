"use strict";
var Backbone = require( "backbone" );

var ImageModel = Backbone.Model.extend({
	initialize: function(){
		if( !this.id ){
			throw new ImageModel.MissingIdError();
		}

		if( !this.get( "originalUrl") ){
			throw new ImageModel.MissingOriginalUrl();
		}
	},
	idAttribute: "_id",
	urlRoot: "/pin"
}, {
	MissingIdError: function(){
		Error.call( this, arguments );
		this.message = "Missing ID";
	},
	MissingOriginalUrl: function(){
		Error.call( this, arguments );
		this.message = "Missing originalUrl";
	}
});

module.exports = ImageModel;
var
	Backbone = require( "backbone" ),
	ImageModel = require( "../models/image" );

var ImageCollection = Backbone.Collection.extend({
	model: ImageModel,
	url: "/pin"
});

module.exports = ImageCollection;
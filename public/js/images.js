var
	Backbone = require( "backbone" ),
	ImageModel = require( "./image" );

var ImageCollection = Backbone.Collection.extend({
	model: ImageModel,
	url: "/pin"
});

module.exports = ImageCollection;
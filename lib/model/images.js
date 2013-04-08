"use strict";

var
	mongoose = require( "mongoose" ),
	mongooseTypes = require( "mongoose-types" );

mongooseTypes.loadTypes( mongoose );


var ImageSchema = new mongoose.Schema({
	originalUrl: {
		type: mongoose.SchemaTypes.Url,
		required: true
	}
});

module.exports = mongoose.model( "image", ImageSchema );
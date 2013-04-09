"use strict";

var
	mongoose = require( "mongoose" ),
	mongooseTypes = require( "mongoose-types" );

var SiteSchema = new mongoose.Schema({
	url: {
		type: mongoose.SchemaTypes.Url,
		required: true
	}
});

module.exports = mongoose.model( "site", SiteSchema );
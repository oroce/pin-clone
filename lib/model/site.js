"use strict";

var mongoose = require( "mongoose" );

var SiteSchema = new mongoose.Schema({
	url: {
		type: String,
		required: true
	},
	lastChecked: {
		type: Date,
		"default": null
	}
});

module.exports = mongoose.model( "site", SiteSchema );
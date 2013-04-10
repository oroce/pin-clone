"use strict";

var
	mongoose = require( "mongoose" ),
	mongooseTypes = require( "mongoose-types" ),
	mongooseAttachments = require( "mongoose-attachments" ),
	config = require( "config" );
mongooseTypes.loadTypes( mongoose );


var ImageSchema = new mongoose.Schema({
	originalUrl: {
		type: mongoose.SchemaTypes.Url,
		required: true
	},
	articleUrl: {
		type: mongoose.SchemaTypes.Url,
	},
	title: {
		type: String
	}
});

ImageSchema.plugin( mongooseAttachments, {
	directory: "images",
	storage: {
		providerName: "s3",
		options: {
			key: config.s3.key,
			secret: config.s3.secret,
			bucket: config.s3.bucket
		}
	},
	properties: {
		image: {
			styles: {
				original: {
					"delete": "1--1",
					"$format": "png"
				},
				small: {
					"delete": "1--1",
					resize: "250x250^",
					crop: "250x250+0+0",
					gravity: "center",
					"$format": "png"
				},
				medium: {
					"delete": "1--1",
					resize: "800x800^",
					crop: "800x800+0+0",
					gravity: "center",
					"$format": "png"
				}
			}
		}
	}
});
module.exports = mongoose.model( "image", ImageSchema );
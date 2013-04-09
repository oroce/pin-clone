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
					"$format": "png"
				},
				small: {
					resize: "64x64^",
					crop: "64x64+0+0",
					gravity: "center",
					"$format": "png"
				},
				medium: {
					resize: "128x128^",
					crop: "128x128+0+0",
					gravity: "center",
					"$format": "png"
				}
			}
		}
	}
});
module.exports = mongoose.model( "image", ImageSchema );
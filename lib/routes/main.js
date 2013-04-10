"use strict";
var
	mongoose = require( "mongoose" ),
	_ = require( "underscore" );

exports.index = function( req, res ){
	// query db
	res.render( "layout", {
		title: "Pinterest clone for fun"
	});
};

exports.pin = function( req, res, next ){
	mongoose.model( "image" )
		.find({})
		.exec(function( err, images ){
			if( err ){
				return next( err );
			}

			images = images
				.filter(function( imageDoc ){
					return imageDoc.image && imageDoc.image.small && imageDoc.image.small.defaultUrl;
				})
				.map(function( imageDoc ){
					return {
						_id: imageDoc._id,
						articleUrl: imageDoc.articleUrl,
						title: imageDoc.title,
						originalUrl: imageDoc.originalUrl,
						small: imageDoc.image.small.defaultUrl,
						medium: imageDoc.image.medium.defaultUrl,
						original: imageDoc.image.original.defaultUrl
					};
				});

			res.json( images );
		});
};

exports.pinById = function( req, res ){

};
"use strict";
var
	mongoose = require( "mongoose" ),
	moment = require( "moment" );

exports.index = function( req, res ){
	// query db
	res.render( "layout", {
		title: "Pinterest clone for fun"
	});
};

var formatImage = function( imageDoc ){
	return {
		_id: imageDoc._id,
		articleUrl: imageDoc.articleUrl,
		title: imageDoc.title,
		originalUrl: imageDoc.originalUrl,
		small: imageDoc.image.small.defaultUrl,
		medium: imageDoc.image.medium.defaultUrl,
		original: imageDoc.image.original.defaultUrl,
		_addedAt: imageDoc.addedAt,
		addedAt: moment( imageDoc.addedAt ).fromNow()
	};
};

exports.pin = function( req, res, next ){
	var
		since = req.param( "since" ),
		query = {};

	if( since ){
		query.addedAt = {
			"$lt": since
		};
	}
	mongoose.model( "image" )
		.find( query )
		.sort({
			addedAt: -1
		})
		.limit( 30 )
		.exec(function( err, images ){
			if( err ){
				return next( err );
			}

			images = images
				.filter(function( imageDoc ){
					return imageDoc.image && imageDoc.image.small && imageDoc.image.small.defaultUrl;
				})
				.map( formatImage );

			res.json( images );
		});
};

exports.pinById = function( req, res, next ){
	var renderLayout = function(){
		res.render( "layout", {
			title: "Pinterest clone for fun"
		});
	};
	res.format({
		html: renderLayout,
		text: renderLayout,
		json: function(){
			mongoose.model( "image" )
				.findOne({
					_id: req.param( "id" )
				})
				.exec(function( err, doc ){
					if( err ){
						return next( err );
					}

					if( !doc ){
						return res.send( 404 );
					}

					res.json( formatImage( doc ) );
				});
		}
	});
};
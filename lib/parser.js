"use strict";

var
	url = require( "url" ),
	libxmljs = require( "libxmljs" ),
	Tumblr = require( "./parser/tumblr" ),
	Wordpress = require( "./parser/wordpress" ),
	mongoose = require( "mongoose" ),
	async = require( "async" ),
	request = require( "request" );

exports.initScrape = function(){

};

exports.getImages = function getImages( html ){
	if( !html ){
		return null;
	}
	var doc = libxmljs.parseHtmlString( html );

	var imgs = doc.find( "//img" );
	if( !imgs || ( imgs && !imgs.length ) ){
		return null;
	}

	return imgs.map(function( img ){
		return {
			src: img.attr( "src" ).value()
		};
	});
};

exports.normalize = function normalize( from, to ){
	if( !to ){
		return null;
	}
	if( from && from[ from.length - 1 ] !== "/" ){
		from += "/";
	}
	var str = url.resolve( from, to );

	return ( /^http:/ ).test( str ) ? str : null;
};

var type = exports.type = function type( str ){
	if( !str ){
		return null;
	}
	var
		parts = url.parse( str ),
		hostParts = parts.host.split( "." ),
		mainPart = hostParts[ hostParts.length - 2 ],
		type = ( /(tumblr|wordpress)/ ).test( mainPart ) && RegExp.$1||null;

	return type;
};

exports.Tumblr = Tumblr;

exports.Wordpress = Wordpress;

function getCtor( site ){
	var urlType = type( site.url );
	if( urlType === "tumblr" ){
		return Tumblr;
	}
	if( urlType === "wordpress" ){
		return Wordpress;
	}
};

var getContent = exports.getContent = function getContent( sites, cb ){
	var parallels = sites.map(function( site ){
		return function( cb ){
			var ctor = getCtor( site );
			if( !ctor ){
				return cb();
			}

			request( site.url, {
				encoding: null
			}, function( err, response, body ){
				if( err ){
					return cb( err );
				}

				var instance = new ctor( site.url, body );
				instance.saveArticles( instance.getArticles(), cb );
			});
		};
	});
	async.parallelLimit( parallels, 5, cb )
};

exports.refresh = function refresh(){
	mongoose.model( "site" )
		.find()
		.exec(function( err, sites ){
			var reSchedule = function(){
				//setTimeout( refresh, 5000 );
			};
			if( err ){
				console.error( err );
				return reSchedule();
			}

			getContent( sites, function( err ){
				if( err ){
					console.error( err );
				}
				reSchedule();
			});
		});
};


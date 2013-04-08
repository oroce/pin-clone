"use strict";

var
	url = require( "url" ),
	libxmljs = require( "libxmljs" );

exports.initScrape = function(){

};

exports.getImages = function( html ){
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

exports.normalize = function( from, to ){
	if( !to ){
		return null;
	}
	if( from && from[ from.length - 1 ] !== "/" ){
		from += "/";
	}
	var str = url.resolve( from, to );

	return ( /^http:/ ).test( str ) ? str : null;
};

exports.type = function( str ){
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
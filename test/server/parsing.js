/* jshint -W068 */
"use strict";

var should = require( "should" );

var parser = require( "../../lib/parser" );

describe( "parser", function(){

	describe( "url normalize", function(){

		it( "should handle absolute url", function(){
			var ret = parser.normalize( "http://example.org", "/foo" );

			should.exist( ret );
			ret.should.equal( "http://example.org/foo" );
		});

		it( "should handle relative url", function(){
			var ret = parser.normalize( "http://example.org/foo", "bar" );

			should.exist( ret );
			ret.should.equal( "http://example.org/foo/bar" );
		});

		it( "should normalize relative url (which contains dot dot)", function(){
			var ret = parser.normalize( "http://example.org/foo", "../bar" );

			should.exist( ret );
			ret.should.equal( "http://example.org/bar" );
		});

		it( "should return null if url doesnt have protocol", function(){
			var ret = parser.normalize( "bar", "/foo/bar" );

			should.not.exist( ret );
		});

		it( "should return null if `to` is null", function(){
			var ret = parser.normalize( "http://example.org", null );

			should.not.exist( ret );
		});

		it( "should be ok if `from` is not null or not valid url but `to` isn't just path part", function(){
			var ret = parser.normalize( null, "http://example.org/foo" );

			should.exist( ret );
			ret.should.equal( "http://example.org/foo" );
		});

		it( "should be null if `from` is null and `to` is just path", function(){
			var ret = parser.normalize( null, "/foo" );

			should.not.exist( ret );
		});
	});

	describe( "url type", function(){

		it( "should return tumblr type", function(){
			var type = parser.type( "http://devopsreactions.tumblr.com/" );

			should.exist( type );
			type.should.equal( "tumblr" );
		});

		it( "should return wordpress type", function(){
			var type = parser.type( "http://thingsarestillfunny.wordpress.com" );

			should.exist( type );
			type.should.equal( "wordpress" );
		});

		it( "should return null for not valid url", function(){
			var type = parser.type( null );

			should.strictEqual( type, null );
		});

		it( "should return null for non tumblr and wordpress url", function(){
			var type = parser.type( "http://example.org" );

			should.strictEqual( type, null );
		});

	});
});
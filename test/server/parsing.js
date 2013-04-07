/* jshint -W068 */
"use strict";

var should = require( "should" );

var parser = require( "../../lib/parser" );

describe( "parser", function(){

	describe( "image parsing", function(){

		it( "should find one image", function(){
			var ret = parser.getImages( "<div><img src='dummy' /></div>" );
			should.exist( ret );
			ret.should.be.instanceof( Array ).and.have.length( 1 );

			var img = ret[ 0 ];
			should.exist( img );
			img.should.have.property( "src", "dummy" );
		});

		it( "should not throw error", function(){
			(function(){
				parser.getImages( null );
			}).should.not.throw();
		});

		it( "should return null", function(){
			var ret = parser.getImages( "<div></div>" );
			should.not.exist( ret );
		});

	});

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
});
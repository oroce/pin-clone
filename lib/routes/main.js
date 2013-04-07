var mongoose = require( "mongoose" );

exports.index = function( req, res ){
	// query db
	res.render( "index", {
		title: "Pinterest clone for fun",
		images: Array(10).join().split(",").map(function(a,i){
			return {
				title: i,
				small: i
			};
		})
	});
};

exports.pin = function( req, res ){
	res.json({});
};
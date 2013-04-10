var
	libxmljs = require( "libxmljs" ),
	_ = require( "underscore" ),
	parser = module.parent.exports,
	async = require( "async" ),
	mongoose = require( "mongoose" ),
	request = require( "request" ),
	fs = require( "fs" ),
	crypto = require( "crypto" ),
	path = require( "path" ),
	debug = require( "debug" )( "pin:parser:tumblr" ),
	ImageModel = require( "../model/images" );

function Tumblr( url, content, cb ){
	debug( "creating new tumblr, url: %s", url );
	this.url = url;
	this.content = content;
	this.cb = cb;
};


Tumblr.prototype.getArticles = function _TumblrGetArticles(){
	debug( "getting articles" );
	var
		doc = libxmljs.parseHtmlString( this.content ),
		self = this;
	if( !doc ){
		return null;
	}
	/*
	var blogPosts = doc.get( "//div[@id='blog_posts']" );
	if( !blogPosts ){
		return [];
	}

	var articles = blogPosts.find( "./div[@class='item text']" );
	if( !( articles||[] ).length ){
		debug( "no articles found:(" );
		return [];
	}*/
	var imgs = doc.find( "//img[@src]" );
	var data = imgs.map(function( img ){

		return {
			articleUrl: self.url,
			originalUrl: img.attr( "src" ).value()
		};
	});

	return _.compact( data );
};

Tumblr.prototype.saveArticles = function _TumblrSaveArticles( articles, cb ){
	debug( "saving articles: %s", (articles||[] ).length );

	if( !( articles||[] ).length ){
		return process.nextTick( cb );
	}
	async.reject( articles, this.exist.bind( this ), function( articles ){
		articles = _.compact( articles );
		if( !articles.length ){
			debug( "ooh no new articles to download, that aint cool" );
			return cb();
		}
		// calm down, we don't wanna melt down the hw
		async.eachSeries( articles, this.saveArticle.bind( this ), cb );
	}.bind( this ) );
};

Tumblr.prototype.exist = function _TumblrExist( article, cb ){
	debug( "check an image existance" );

	ImageModel
		.findOne({
			originalUrl: article.originalUrl
		})
		.exec(function( err, doc ){
			if( err ){
				return cb( err );
			}
			cb( !!doc )
		});
};


Tumblr.prototype.saveArticle = function _TumblrSaveArticle( article, cb ){
	debug( "save article" );

	var fileName = path.join( process.cwd(), "tmp", crypto.randomBytes( 10 ).toString( "hex" ) );

	request({
		encoding: null,
		url: article.originalUrl
	}, function( err ){
		if( err ){
			return cb( err );
		}
		debug( "saving image done (%s), going to save to db", fileName );
		var model = new ImageModel( article );
		model.attach( "image", { path: fileName }, function( err, doc ){
			if( err ){
				err.fileName = fileName;
				return cb( err );
			}
			/*if( !model.image.small.defaultUrl || !model.image.medium.defaultUrl ){
				debug( "Couldn't create the small or medium image for file: %s", fileName );
				console.error( "Woow, there are no small or medium image" );
				return cb();
			}*/
			model.save( cb );
		});
	})
	.on( "error", function( err ){
		// do not throw error
	})
	.pipe( fs.createWriteStream( fileName ) );
};

module.exports = Tumblr;
var
	Backbone = require( "backbone" ),
	_ = require( "underscore" ),
	imagesTemplate = require( "../templates/images.jade" ),
	imageTemplate = require( "../templates/image.jade" );

var ImagesView = Backbone.View.extend({
	events: {
		"click .pin-container": "showImage"
	},
	initialize: function(){
		this.collection
			.on( "reset", this.render, this )
			.on( "add", this.add, this );

		this.$window = $( window );
		this.$document = $( document );

		this.$window.on( "scroll", _.bind( this.onScroll, this ) );
	},
	render: function(){
		window.imageTemplate = imageTemplate;
		this.$el.empty().append( imagesTemplate({ images: this.collection.toJSON() }) );
		return this;
	},
	add: function( model ){
		this.$el.append( imageTemplate({ image: model.toJSON() } ) );
		return this;
	},
	onScroll: function( e ){
		if( this.$window.scrollTop() >= this.$document.height() - this.$window.height() - 50 ){
			this.loadMore();
		}
	},
	loadMore: function(){
		if( this._loadMoreXhr && this._loadMoreXhr.readyState !== 4 ){
			// we are still loading
			return;
		}
		var lastModel = this.collection.last();
		console.log( "lastModel", lastModel, lastModel&&lastModel.toJSON() )
		this._loadMoreXhr = this.collection.fetch({
			add: true,
			remove: false,
			data: {
				since: lastModel && lastModel.get( "_addedAt" )
			}
		});
	},
	showImage: function( e ){
		var id = $( e.currentTarget ).data( "id" );
		if( !id ){
			return;
		}
		Backbone.history.navigate( "/pin/" + id, true );
	}
});

module.exports = ImagesView;
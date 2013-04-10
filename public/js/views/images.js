var
	Backbone = require( "backbone" ),
	imageTemplate = require( "../templates/images.jade" );

var ImagesView = Backbone.View.extend({
	initialize: function(){
		this.collection.on( "reset", this.render, this )
			.on( "all", console.log.bind( console ))
	},
	render: function(){
		window.imageTemplate = imageTemplate;
		this.$el.empty().append( imageTemplate({ images: this.collection.toJSON() }) );
		return this;
	}
});

module.exports = ImagesView;
var
	Backbone  = require( "backbone" ),
	ImagesCollection = require( "./collections/images" ),
	ImageModel = require( "./models/image" ),
	ImageView = require( "./views/image" ),
	ImagesView = require( "./views/images" );

var Router = Backbone.Router.extend({
	routes: {
		"pin/:id": "image",
		"": "default"
	},
	initialize: function(){
		Backbone.history.start({ pushState: true });
	},
	image: function( id ){
		var model;
		if( this.collection ){
			// reuse existing model
			model = this.collection.get( id );
		}
		if( !model ){
			model = new ImageModel({
				id: id
			});
		}

		var imageView = new ImageView({
			model: model
		}).render();

		model.fetch();
	},

	default: function(){
		if( !this.collection ){
			this.collection = new ImagesCollection();
			this.collection.fetch({
				reset: true
			});
			this.imagesView = new ImagesView({
				collection: this.collection,
				el: ".image-container"
			});
		}

		this.imagesView.render();
	}
});

module.exports = Router;
var
	Backbone = require( "backbone" ),
	imageTemplate = require( "../templates/image-dialog.jade" );

var ImageView = Backbone.View.extend({
	className: "modal hide fade",
	initialize: function(){

	},
	render: function(){
		this.$el.html(
			imageTemplate({
				image: this.model.toJSON()
			})
		).modal();
		return this;
	}
});

module.exports = ImageView;
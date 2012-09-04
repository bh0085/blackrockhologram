var PicSelectionCache=Backbone.Collection.extend({
   
});

var SelectionGalleryView = Backbone.View.extend({
    tagName:"span",
    className:"selection-gallery-view",
    template:$("#selection-gallery-view-template").html(),
    viewsById:null,
    initialize:function(args){
	this.scache = new PicSelectionCache([]);
	this.scache.on("add", this.addPic, this);
	this.scache.on("remove", this.removePic,this);
	this.viewsById = {};
    },
    render:function(){
	this.$el.html(Mustache.render(this.template,
				      {}));
	return this;
    },
    addPic:function(pbpic){
	console.log("adding ", pbpic);
	v = new PBPicView({model:pbpic}).render()
	v.on("closed",this.viewClosed,this);
	this.viewsById[v.model.get('id')] = v;
	this.$('.thumbs').append(v.$el);
	this.changed();
    },
    viewClosed:function(view){
	this.scache.remove(view.model);	
    },
    removePic:function(pbpic){
	console.log("removing");
	this.viewsById[pbpic.get('id')].$el.remove();
	delete this.viewsById[pbpic.get('id')];
	this.changed();
    },
    changed:function(){
	this.$('.selection-count-display')
	    .text(String(this.scache.models.length));

	if(this.scache.models.length ==0){
	    this.$(".selection-more-info").toggleClass("nodisplay",true);
	} else {
	    this.$(".selection-more-info").toggleClass("nodisplay",false);
	    
	    dt = _.reduce(this.scache.models,
			  function(last,e){
			      return last < e.get("datetime")?last:e.get("datetime");
			  },Infinity);
    	    this.$('.selection-time-start-display')
		.text(dt.getHours() % 12 + (dt.getHours()>12 ? "pm" : "am") + " " + dt.getDayName());

	    
	    dt = _.reduce(this.scache.models,
			  function(last,e){
			      return last > e.get("datetime")?last:e.get("datetime");
			  },-Infinity);
    	    this.$('.selection-time-end-display')
		.text(dt.getHours() % 12 + (dt.getHours()>12 ? "pm" : "am") + " " + dt.getDayName());
	    this.$('.selection-creator-count-display')
		.text(String(_.uniq(this.scache.models,
				    false,
				    function(e){
					return e.get("creatorid");
				    }).length));
	}
    }
})

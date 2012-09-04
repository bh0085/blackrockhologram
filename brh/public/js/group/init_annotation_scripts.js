$(function(){
    curgroup =new Group(sessionInfo.group);
    curbin =new Bin(sessionInfo.ebin);
    gview = new GroupView({model:curgroup,
			   bin:curbin});

    cache = _.map(curbin.get("pictures"), 
		  function(e){
		      return new PBPic(e);
		  });

    pchart = new PicChartModel({pics:cache});
    pview = new PicTimeView({model:pchart});
    pview.render().$el.appendTo($('.chart-container'));

    sgallery = new SelectionGalleryView()
    sgallery.render().$el.appendTo($(".widget.selection-gallery-container"))
    pgv = new PlaceGalleryView();
});



Place = Backbone.Model.extend({
    defaults:{
	groupid:none
    }
});
PlaceCache = Backbone.Collection.extend({
    model:Place
})
PlaceView =Backbone.View.extend({
    template:$("#place-view-template"),
    className:"place-view",
    tagName:"div",

    render:function(){
	var json = {};
	this.$el.html(Mustache.render(this.template,json));
	return this;
    }
});
PlaceGalleryView = Backbone.View.extend({
    "tagName":"div",
    className:"place-gallery-view",
    template:$("#place-gallery-view-template"),
    initialize:function(){
	this.pcache = new PlaceCache([]);
	this.pcache.on("add",this.addPlace, this);
	this.pcache.on("remove",this.removePlace, this);
    },
    addPlace:function(place){
	this.viewsById[place.get("cid")]
	    = new PlaceView({"model":place});
    },
    removePlace:function(place){
	this.viewsById[place.get("cid")].$el.remove();
	delete this.viewsById[place.get("cid")];
    },
    render:function(){
	var json = {};
	this.$el.html(Mustache.render(this.template,json));
	return this;

    }
});

function submit_place(){
    selected_ids = _.map(scache.models,
			 function(e){
			     return e.id;
			 });
    data = {
	pb_pic_ids:selected_ids
    };
    $.getJSON("/handleplace/"+curgroup.get("passphrase"),
	      data,
	      place_submitted);
    
    
}

function place_submitted(data){
    new_places = data.places;
    curuser = data.user;
    _.each(data,function(e){
	pgv.pcache.add(new Place(e));
    },this);
    $(".email-submitter").append(
	$("<div>").text("It worked! We've sent you a confirmation email and you'll be hearing from us occasionally")
    );
    
}


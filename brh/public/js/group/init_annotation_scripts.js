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
    pgv.render().$el.appendTo($(".place-gallery-container"));
});



Place = Backbone.Model.extend({
    defaults:{
	groupid:null,
	coordinates:null,
	pictures:null,
    } 
});

PlaceCoordinate = Backbone.Model.extend({
})



PlaceCache = Backbone.Collection.extend({
    model:Place
})
PlaceView =Backbone.View.extend({
    template:$("#place-view-template").html(),
    className:"place-view",
    tagName:"div",

    render:function(){
	var json = this.model.toJSON();
	json.count = this.model.get("pictures").length;
	cols = _.map(_.range(3) ,function(e){return Math.floor(Math.random()*128)+64});

	json.med_color = 'rgba('+cols.join(', ')+',1)';
	json.light_color =  'rgba('+cols_light.join(', ')+',1)';
	json.dark_color =  'rgba('+cols_dark.join(', ')+',1)';
			  
	this.$el.html(Mustache.render(this.template,json));
	return this;
    }
});
PlaceGalleryView = Backbone.View.extend({
    "tagName":"div",
    className:"place-gallery-view",
    template:$("#place-gallery-view-template").html(),
    initialize:function(){
	this.pcache = new PlaceCache([]);
	this.pcache.on("add",this.addPlace, this);
	this.pcache.on("remove",this.removePlace, this);
	this.viewsById = {};
    },
    addPlace:function(place){
	v = new PlaceView({"model":place});
	this.viewsById[place.get("cid")] = v;
	v.render().$el.appendTo(this.$el);
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
    if ($("input.place").val() == ''){
	return;
    }

    selected_ids = _.map(sgallery.scache.models,
			 function(e){
			     return e.id;
			 });
    
    data = {
	pb_picids_json:JSON.stringify(selected_ids),
	name:$("input.place").val()
    };
    $.getJSON("/handleplace/"+curgroup.get("passphrase"),
	      data,
	      place_submitted);
    
    
}

function place_submitted(data){
    new_places = data.place;
    place_pictures = data.place_pictures;
    _.each(data,function(e){
	pgv.pcache.add(new Place(e));
    },this);

    console.log("SUBMITTED!");
}


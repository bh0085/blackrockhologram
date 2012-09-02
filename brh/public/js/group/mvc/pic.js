var PBPic = Backbone.Model.extend({ 

    defaults : function() {
        return {
            added: null,
	    date_taken:null,
            name: null,
	    thumbs:null,
	    has_thumbs: false};
    },
    initialize:function(args){
	this._initialize_date();
    }, 
    url: function (data) {
        var url = '/pbpics/' + this.id;
        return url;
    },
    seconds:function(){
	return Math.random() * 1000;
    },
    _initialize_date: function() {
	var dt, settings, d;
	dt =this.get('date_taken') ? Date.parse(this.get('date_taken')):Date.now();
	d =this.get('date_taken') ? Date.parse(this.get('date_taken')):Date.now();
	d.setSeconds(0);
	d.setHours(0);
	d.setMinutes(0);

	settings = {
	    date_string:[dt.getMonthName(),dt.getDay(),dt.getFullYear()].join(" "),
	    day:Math.floor(dt/ (1000 * 3600 * 24)),
	    age:dt/(1),
	    datetime:dt,
	    date:d
	}
	this.set(settings);
    },
});


var Thumb = Backbone.Model.extend({

});

var ThumbCache = Backbone.Model.extend({

});

var Pic = Backbone.Model.extend({
    seconds:function(){
	return Math.random() * 1000;
    },
    url: function (data) {
        var url = '/pics/' + this.id;
        return url;
    },
})

var PBPicView = Backbone.View.extend({
    template: $("#pb-pic-view-template").html(),
    tagName:"div",
    className:"pb-pic-view",
    render:function(){
	var json = this.model.toJSON();
	json.name = json.name?json.name:"untitled";

	
	var med_width = 150,
	    med_height= 150;
	
	if(json.medium_thumb){
	    json.medium_thumb.left = (med_width - json.medium_thumb.width)/2;
	    json.medium_thumb.top = (med_height - json.medium_thumb.height)/2; 
	} else{ json.medium_thumb = {};}
	this.$el.html(Mustache.render(this.template, json));
	return this;
    }
})


var PicView = Backbone.View.extend({
    template:$("#pic-view-template").html(),
    tagName:"div",
    className:"pb-pic-view",
    render:function(){
	var json= this.model.toJSON();
	this.$el.html(Mustache.render(this.template, json));
	return this;
    }
})
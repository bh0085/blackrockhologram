var Group = Backbone.Model.extend({
    defaults:{
	pb_id:null,
	passphrase:null
    }
})

var Bin = Backbone.Model.extend({
    default:{
	url:null,
	key:null
    }
})

var GroupView = Backbone.View.extend({
    tagName:"div",
    className:"group-view",
    template:$("#group-view-template").html(),
    initialize:function(args){
	this.bin = args.bin;
    },
    render:function(){
	console.log(this.bin);
	this.binview = new BinView({model:this.bin});
	var json = this.model.toJSON();
	this.$el.html(Mustache.render(this.template, json));
	this.$('.bin-container').append(this.binview.render().$el);
	
	
	
	return this;
    }
})



var BinView = Backbone.View.extend({
    tagName:"div",
    classNave:"bin-view",
    template:$("#bin-view-template").html(),
    picviews :[],
    render:function(){
	var json = this.model.toJSON();
	this.$el.html(Mustache.render(this.template,json));
	showpics(cache);
	
	_.each(this.picviews,
	       function(e){
		   e.remove();
	       },this);
	
	_.each(cache,
	       function(e){
		   pv = new PBPicView({"model":e});
		   this.picviews.push(pv);
		   this.$('.pics-container').append(pv.render().$el);
		   
	       }, this);
	return this;
    }
})
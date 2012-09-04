
/* collects a line of pictures in the chart */
PicLineCache = Backbone.Collection.extend({
    model:PBPic,
    time_center:null,
    comparator:function(model){
	
	return time_chart_view.get_x(model);
    }
})

/* displays a line of pictures */

plview = null;
var PicLineView = Backbone.View.extend({
    data:null,
    pics:null,
    creatorid:null,
    tagName:"g",
    user_data:null,
    nthumbs:null,
    pthumbs:null,
    initialize:function(args){
	this.pthumbs = [];
	this.nthumbs = [];
	this.el = this.make(this.tagName);
	this.data = args.data;
	this.creatorid = args.creatorid;
	this.user_data = this.creatorid;
	this.selection_side = args.side;
	this.pics = new PicLineCache(
	    _.filter(this.data,
		     function(e){
			 return e.get("creatorid" ) == this.creatorid;
		     },this));
	plc = this.pics;
	plview = this;
    },
    render:function(){
	d3.select(this.el)
	    .attr("class", "selection-line " + this.selection_side);
	return this;
    },

    toggle:function(on){	
	d3.select(this.el).classed("toggled-off", !on)
    },
    assignThumbs:function(prev_idxs, next_idxs){

	ofs = 0
	_.each(prev_idxs,
	     
	       function(e,i){
		   var do_offset = false;
		   var m =this.pics.models[e];
		   if (!this.pthumbs[i] ||(this.pthumbs[i].model !=m)){
		       if(i >= this.pthumbs.length ){
			   this.pthumbs[i] = 
			       new LineThumbView({
				   model:this.pics.models[e],
				   scale:.75*Math.pow(.5,i)
			       });
		       } else {
			   this.pthumbs[i].model = m;
		       }
		       do_offset=true;
		       this.pthumbs[i].render();
		   }
		       
		   ofs+=this.pthumbs[i].actual_width() + 15;
		   if (do_offset){
		       d3.select(this.pthumbs[i].el)
			   .attr('transform', 'translate('+
				 (-1 * ofs)+',' + (-1*this.pthumbs[i].actual_height()/2) + ')')
			   .attr('class', 'prev thumb');
		   }

		   
	       }, this
	      );


	ofs = 0;
	_.each(next_idxs,
	       function(e,i){
		   do_offset=false;
		   m =this.pics.models[e];
		   if (!this.nthumbs[i] ||(this.nthumbs[i].model !=m)){
		       if(i >= this.nthumbs.length ){
			   this.nthumbs[i] = 
			       new LineThumbView({
				   model:this.pics.models[e],
				   scale:.75*Math.pow(.5,i)
			       });

		       } else {
			   this.nthumbs[i].model = m;
		       }
		       this.nthumbs[i].render();
		       do_offset = true;
		   }
		   if (do_offset){
		       d3.select(this.nthumbs[i].el)
			   .attr('transform', 'translate('+
				 ( ofs)+',' + (-1*this.nthumbs[i].actual_height()/2) + ')')
			   .attr('class', 'next thumb');
		   }
		   ofs+=this.nthumbs[i].actual_width() + 15;
		   
	       }, this
	      );


	_.each(this.pthumbs,
	       function(e2){
		   $(this.el).append(e2.el);
	       },this);
	if( this.pthumbs.length > prev_idxs.length){
	    _.each(_.range(prev_idxs.length,this.pthumbs.length),
		   function(i){		       
		       if( this.pthumbs[i].model){
			   this.pthumbs[i].model = null;
			   this.pthumbs[i].render();
		       }
		   },this);
	}

	_.each(this.nthumbs,
	       function(e2){
		   $(this.el).append(e2.el);
	       },this);
	if( this.nthumbs.length > next_idxs.length){
	    _.each(_.range(next_idxs.length,this.nthumbs.length),
		   function(i){		       
		       if( this.nthumbs[i].model){
			   this.nthumbs[i].model = null;
			   this.nthumbs[i].render();
		       }
		   },this);
	}
	
    },
    
    /**
     * Custom make method needed as backbone does not support creation of
     * namespaced HTML elements.
     */
    make: function(tagName, attributes, content) {
	var el = document.createElementNS('http://www.w3.org/2000/svg', tagName);
	if (attributes) $(el).attr(attributes);
	if (content) $(el).html(content);
	return el;
    }
})


var  LineThumbView = Backbone.View.extend({
    tagName:"g",
    scale:null,
    initialize:function(args){
	this.el= this.make(this.tagName);
	this.scale=args.scale?args.scale:.3;
    },
    render:function(){
	/* renders directly in g... bad */
	var m = this.model;

	if(m !=null){
	    if(this.img == null){  
		this.img = d3.select(this.el)
		    .append('svg:image')
		    .attr("style", "border:1px solid black;border-radius: 15px;")
		    .attr("xlink:href", m.get("medium_thumb").url) 
		    .attr("width", this.actual_width())
		    .attr("height",this.actual_height());
	    } else{
		this.img
		    .attr("xlink:href", m.get("medium_thumb").url) 
		    .attr("width", this.actual_width())
		    .attr("height",this.actual_height());
	    }
	} else {
	    this.img.remove();
	    this.img = null;
	}
	return this;
    },
    actual_width:function(){
	return this.model.get("medium_thumb").width * this.scale;
    },
    actual_height:function(){
	return this.model.get("medium_thumb").height * this.scale;
    },
    /**
     * Custom make method needed as backbone does not support creation of
     * namespaced HTML elements.
     */
    make: function(tagName, attributes, content) {
	var el = document.createElementNS('http://www.w3.org/2000/svg', tagName);
	if (attributes) $(el).attr(attributes);
	if (content) $(el).html(content);
	return el;
    }

});

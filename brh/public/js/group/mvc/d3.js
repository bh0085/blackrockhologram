PicChartModel = Backbone.Model.extend({
    initialize:function(args){
	this.pics = args.pics;
    }
});

/* collects a line of pictures in the chart */
PicLineCache = Backbone.Collection.extend({
    model:PBPic,
    time_center:null,
    comparator:function(model){
	
	return time_chart_view.get_x(model);
    }
})

time_chart_view = null;
PicTimeView = Backbone.View.extend({
    dragging : false,
    selected:null,
    drag_screen_start: null,
    drag_screen_last:null,
    selection_rect_data:null,
    drag_area:null,
    data:null,
    scattered:null,
    n_thumbs_in:1,
    n_thumbs_out:0,
    n_thumbs_out_after:3,
    n_thumbs_in_after:1,
    thumbs_before_line_offset:-80,
    thumbs_after_line_offset:80,
    
    initialize:function(){
	time_chart_view = this;
    },
    mousedown:function(d){
	this.dragging = true;
	this.drag_screen_start = d3.mouse(this.drag_area);
	this.drag_screen_last = d3.mouse(this.drag_area);
	this.selectRange();

    },
    mouseup:function(d){
	this.dragging = false;
    },
    mousemove:function(d){
	if(this.dragging){
	    var m = d3.mouse(this.drag_area);
	    this.drag_screen_last = d3.mouse(this.drag_area);
	    this.selectRange();
	}
    },
    

    
    get_x:function(model){
	return model.get("datetime");
    },
    get_y:function(model){
	return model.get("creatorid");
    },
    tx:function(model){
	return this.sx(this.get_x(model));
    },
    ty:function(model){
	return this.sy(this.get_y(model));
    },
    

    renderSelectionRect:function(){
	var dr = this.selection_rect_data;


	bounds = [this.sx(dr[0]),
		  this.sy(dr[1]),
		  this.sx(dr[2])-this.sx(dr[0]),
		  this.sy(dr[3])-this.sy(dr[1])]
	if(this.selectionRect == null){	    
	    this.selectionRect = this.g
		.append("svg:rect")  // create a new circle for each value
		.attr("x",bounds[0] )
		.attr("y",bounds[1] )
		.attr("width", bounds[2])
		.attr("height", bounds[3])
		.attr("class", "selection-rect")
		.style("opacity", .2);
	    
	} else {
	    this.selectionRect
		.attr("x",bounds[0] )
		.attr("y",bounds[1] )
		.attr("width", bounds[2])
		.attr("height", bounds[3]);
	}
	
    },
    colorSelectedPoints:function(){
	var dr =  this.selection_rect_data;
	inclusion = _.groupBy(this.scattered[0],
			   $.proxy(function(e,i){
			       var x =this.get_x( this.data[i]);
			       var y =this.get_y(this.data[i]);
			       return x > dr[0] && x < dr[2]
				   && y > dr[1] && y < dr[3];
			   }, this));
	
	if(inclusion[true]) d3.selectAll(inclusion[true])
	    .attr("class", "scatter-dot selected");
	
	if(inclusion[false]) d3.selectAll(inclusion[false])
	    .attr("class", "scatter-dot deselected");
    },

    
    
    
    refreshSelectedThumbs:function(){
	var dr = this.selection_rect_data;
	
	line_bounds =
	    _.each(this.thumblines_before, function(tl,i){

		if(!(tl.user_data > dr[1] && tl.user_data < dr[3])){
		    this.thumblines_after[i].toggle(false);
		    this.thumblines_before[i].toggle(false);
		    return
		}
		
		this.thumblines_after[i].toggle(true);
		this.thumblines_before[i].toggle(true);
		starts_selection = _.find(tl.pics.models,
					  function(e){
					      return this.get_x(e) > dr[0];
					  },this);
		ends_selection = _.find(tl.pics.models,
					function(e){
					    return this.get_x(e) > dr[2];
					},this);
		
		sbounds = [tl.pics.models.indexOf(starts_selection),
			   tl.pics.models.indexOf(ends_selection)];
		if(sbounds[1] == -1){
		    sbounds[1] = tl.pics.models.length;
		}
		
		grps = _.groupBy(_.range(tl.pics.models.length),
				 function(e,i){
				     if (i < sbounds[0]){
					 return 'before';
				     } else if( i < sbounds[1]){
					 return 'between';
				     } else {
					 return 'after';
				     }
				 });
		if (!grps.before) grps.before = [];
		if (!grps.after) grps.after = [];
		if (!grps.between) grps.between = [];

		b_prev = grps.before.slice(grps.before.length -1* this.n_thumbs_out,grps.before.length)
		b_next = grps.between.slice(0,Math.min(this.n_thumbs_in, Math.floor(grps.between.length/2)));
		a_prev_slice_start = Math.max(grps.between.length - this.n_thumbs_in_after,
					      b_next.length);
		a_prev = grps.between.slice(a_prev_slice_start,grps.between.length);
		a_next = grps.after.slice(0,Math.min(grps.after.length, this.n_thumbs_out_after));
		
		this.thumblines_after[i].assignThumbs(a_prev,a_next);
		this.thumblines_before[i].assignThumbs(b_prev,b_next);
		
		
		d3.select(this.thumblines_before[i].el)
		    .attr('transform', 'translate('+
			  this.sx(this.selection_rect_data[0])+',' +
			  (this.sy(tl.user_data)+this.thumbs_before_line_offset) + ')');
		d3.select(this.thumblines_after[i].el)
		    .attr('transform', 'translate('+
			  this.sx(this.selection_rect_data[2])+',' +
			  (this.sy(tl.user_data) +this.thumbs_after_line_offset)+ ')');

	    }, this);


    },


    computeSelectedPics:function(){

	var dr =  this.selection_rect_data;
	_.each(this.data,
	       function(e,i){
		   
		   var selected, was_selected;
		   var x =this.get_x(e);
		   var y =this.get_y(e);
		   selected =  x > dr[0] && x < dr[2]
		       && y > dr[1] && y < dr[3];
		   was_selected=sgallery.scache.get(e.get('id'))!=null;

		   if( selected && ! was_selected){
		       sgallery.scache.add(e);
		   } else if( !selected && was_selected){
		       sgallery.scache.remove(e);
		   } else{
		       //do nothing;
		   }
	       },this);
	
    },
    selectRange:function(){
	var xs, ys, included, rect, c;
	xs = [(this.drag_screen_start[0]),
	      (this.drag_screen_last[0])];
	ys = [(this.drag_screen_start[1]),
	      (this.drag_screen_last[1])];
	rect = [d3.min(xs),d3.min(ys),
		d3.max(xs),d3.max(ys)];
	
	data_rect = [this.sx.invert(rect[0]),
		     this.sy.invert(rect[1]),
		     this.sx.invert(rect[2]),
		     this.sy.invert(rect[3])];
	this.selection_rect_data = data_rect;
	this.renderSelectionRect();
	this.colorSelectedPoints();
	this.refreshSelectedThumbs();
	this.computeSelectedPics();

    },
    render:function(){
	pics = _.filter(this.model.pics, function(e){return e.get("datetime")});
	if(pics.length == 0){
	    json = curbin.toJSON();
	    this.$el.html(
		Mustache.render($("#bin-no-pictures-view-template").html(),json));
	    return this;
	}
	pics_data = pics;
	this.data = pics_data;
	
	// data that you want to plot, I've used separate arrays for x and y values
	xdata = _.map(pics, function(e){return e.get("datetime")});
	
	// draw the y axis
	ydata = 
	    _.uniq(
		_.map(
		    this.data,
		    function(e){
			return {id:e.get("creatorid"),
				name:e.get("creator_name")[0]?e.get("creator_name")[0]:"anonymous"};
		    }),
		false,
		function(e){
		    return e.id;
		}
	    );
	this.yunq = _.sortBy(
	    _.map(ydata,function(e){
		return e.id
	    }),function(e){return e});
	    

	

	// size and margins for the chart
	var margin = {top: 100, right: 25, bottom: 100, left: 100}
	, width =400
	, height =150 * this.yunq.length;

	// x and y scales, I've used linear here but there are other options
	// the scales translate data values to pixel values for you

	var dy = d3.max(this.yunq) - d3.min(this.yunq);
	var dx = d3.max(xdata) - d3.min(xdata);
	this.sx = d3.time.scale()
		.domain([d3.min(xdata) , d3.max(xdata)]) 
		.range([0, width]); 

	this.sy = d3.scale.linear()
		.domain([d3.min(this.yunq)-dy*.2, d3.max(this.yunq)+dy*.2])
		.range([0,height]);
	var sx = this.sx, sy = this.sy;


	// the chart object, includes all margins
	this.chart = d3.select(this.el)
	    .append('svg:svg')
	    .attr('width',width + margin.right + margin.left)
	    .attr('height', height + margin.top + margin.bottom)
	    .attr('class', 'chart')
            .attr("d", this.pics);

	// the main object where the chart and axis will be drawn
	this.main = this.chart.append('g')
		.attr('transform', 'translate('+margin.left+', '+ margin.top+')')
		.attr('width',width)
		.attr('height',height)
		.attr('class', 'main')   ;

	this.drag_area = this.chart[0][0];
	this.chart.on("mousedown",$.proxy(this.mousedown,this));
	this.chart.on("mouseup", $.proxy(this.mouseup,this));
	this.chart.on("mousemove", $.proxy(this.mousemove,this));
	



	
	// draw the x axis
	var xAxis = d3.svg.axis()
		.scale(sx)
		.ticks(d3.time.hours, 24);

	this.main.append('g')
	    .attr('transform', 'translate(0,' + height + ')')
	    .attr('class', 'main axis date')
	    .call(xAxis);
	 

	var sy = this.sy;
	this.main.selectAll(".ylabel")
	    .data(ydata)
	    .enter().append("text")
	    .attr("x",0)
	    .attr("y", function(d) { return sy(d.id); })
	    .attr("dx", -10) // padding-right
	    .attr("dy", ".35em") // vertical-align: middle
	    .attr("text-anchor", "end") // text-align: right
	    .text(function(d){return d.name});


	/*
	var yAxis = d3.svg.axis()
		.scale(sy)
		.orient('left')
		.ticks(0);

	this.main.append('g')
	    .attr('transform', 'translate(0,0)')
	    .attr('class', 'main axis yaxis')
	    .call(yAxis);
	 */

	 

	// draw the graph object
	this.g =  this.main.append("svg:g")
	    .attr('class', 'main group'); 

	this.drag_area = this.g[0][0];
	this.g.on("mousedown",$.proxy(this.mousedown,this));
	this.g.on("mouseup", $.proxy(this.mouseup,this));
	this.g.on("mousemove", $.proxy(this.mousemove,this));

	this.scattered =this.g.selectAll("scatter-dots")
	    .data(pics_data)  // using the values in the ydata array
	    .enter().append("svg:circle")  // create a new circle for each value
	    .attr("cy", $.proxy(this.ty,this) ) // translate y value to a pixel
	    .attr("cx", $.proxy(this.tx,this) ) // translate x value
	    .attr("r", 5) // radius of circles
	    .attr("class", "scatter-dot deselected")
	    .style("opacity", 0.6)

	this.thumblines_before = _.map(
	    this.yunq,
	    function(v){
		return  new PicLineView({
		    data:this.data,
		    creatorid:v,
		    side:'before'
		}).render();
	    },this);


	this.thumblines_after = _.map(
	    this.yunq,
	    function(v){
		return  new PicLineView({
		    data:this.data,
		    creatorid:v,
		    side:'after'
		}).render();
	    },this);

	_.each(this.thumblines_before,
	       function(e1,i){
		   $(this.main[0][0]).append($(e1.el));
	     },this);
	_.each(this.thumblines_after,
	       function(e1,i){
		   $(this.main[0][0]).append($(e1.el));
	     },this);


	this.thumbconnectors= [];

	return this;
    }
});
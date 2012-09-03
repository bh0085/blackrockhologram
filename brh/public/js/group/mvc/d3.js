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
    n_thumbs_in:3,
    n_thumbs_out:2,
    thumbs_line_offset:-80,
    
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
			       var x = this.data[i];
			       var y = this.data[i];
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
	_.each(this.thumblines_before,
	       function(tl,i){
		   var next_thumb = _.find(tl.pics.models,
				       function(e){
					   return this.get_x(e) > dr[0];
				       },this);
		   if (next_thumb){
		       next_i = tl.pics.indexOf(next_thumb);
		   } else{
		       next_i = tl.pics.length;
		   }
		   if(next_i >0){
		       prev_i = next_i - 1;
		       prev_thumb = tl.pics.models[prev_i];
		   } else {
		       prev_i = -1;
		       prev_thumb = null;
		   }

		   prange = _.range(Math.max(0,prev_i+1-this.n_thumbs_out),
				    Math.max(0,prev_i+1));
		   nrange = _.range(Math.min(tl.pics.length, next_i),
				    Math.min(tl.pics.length, next_i +this.n_thumbs_in));
		   

		   tl.assignThumbs(prange, nrange);
		   

		   d3.select(tl.el)
		       .attr('transform', 'translate('+
			     this.sx(this.selection_rect_data[0])+',' +
			     (this.sy(tl.user_data)+this.thumbs_line_offset) + ')');

	       },
	       this
	      )
	_.each(this.thumblines_after,
	       function(tl,i){
		   var next_thumb = _.find(tl.pics.models,
				       function(e){
					   return this.get_x(e) > dr[2];
				       },this);
		   if (next_thumb){
		       next_i = tl.pics.indexOf(next_thumb);
		   } else{
		       next_i = tl.pics.length;
		   }
		   if(next_i >0){
		       prev_i = next_i - 1;
		       prev_thumb = tl.pics.models[prev_i];
		   } else {
		       prev_i = -1;
		       prev_thumb = null;
		   }


		   prange = _.range(Math.max(0,prev_i+1-this.n_thumbs_in),
				    Math.max(0,prev_i+1));
		   nrange = _.range(Math.min(tl.pics.length, next_i),
				    Math.min(tl.pics.length, next_i +this.n_thumbs_out));
		  
		   tl.assignThumbs(prange, nrange);
		   

		   d3.select(tl.el)
		       .attr('transform', 'translate('+
			     this.sx(this.selection_rect_data[2])+',' +
			     (this.sy(tl.user_data) +this.thumbs_line_offset)+ ')');

	       },
	       this
	      )
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
	ydata = _.map(pics, function(e){return e.get('creatorid')});

	// size and margins for the chart
	var margin = {top: 0, right: 0, bottom: 0, left: 0}
	, width ="100%"
	, height ="100%";

	// x and y scales, I've used linear here but there are other options
	// the scales translate data values to pixel values for you

	var dy = d3.max(ydata) - d3.min(ydata);
	var dx = d3.max(xdata) - d3.min(xdata);
	this.sx = d3.time.scale()
		.domain([d3.min(xdata) , d3.max(xdata)])  // the range of the values to plot
		.range([100,500]);        // the pixel range of the x-axis

	this.sy = d3.scale.linear()
		.domain([d3.min(ydata)-dy*.2, d3.max(ydata)+dy*.2])
		.range([100, 500]);
	var sx = this.sx, sy = this.sy;


	// the chart object, includes all margins
	this.chart = d3.select(this.el)
	    .append('svg:svg')
	    .attr('width',"100%")// width + margin.right + margin.left)
	    .attr('height',"100%")// height + margin.top + margin.bottom)
	    .attr('class', 'chart')
            .attr("d", this.pics);

	// the main object where the chart and axis will be drawn
	var main = this.chart.append('g')
		.attr('width', "100%")
		.attr('height', "100%")
		.attr('class', 'main')   ;

	this.drag_area = this.chart[0][0];
	this.chart.on("mousedown",$.proxy(this.mousedown,this));
	this.chart.on("mouseup", $.proxy(this.mouseup,this));
	this.chart.on("mousemove", $.proxy(this.mousemove,this));
	

	/*
	// draw the x axis
	var xAxis = d3.svg.axis()
		.scale(sx)
		.ticks(d3.time.hours, 24);

	main.append('g')
	    .attr('transform', 'translate(0,' + height + ')')
	    .attr('class', 'main axis date')
	    .call(xAxis);
	 */

	// draw the y axis
	var y_unique_vals = _.unique(_.sortBy(ydata,function(e){return e}));
	this.yunq = y_unique_vals;

	/*
	var yAxis = d3.svg.axis()
		.scale(sy)
		.orient('left')
		.ticks(y_unique_vals);

	main.append('g')
	    .attr('transform', 'translate(0,0)')
	    .attr('class', 'main axis yaxis')
	    .call(yAxis);

	 */

	// draw the graph object
	this.g =  main.append("svg:g")
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
	    .on("click", function(d){console.log(d);}); // opacity of circle

	this.thumblines_before = _.map(
	    y_unique_vals,
	    function(v){
		return  new PicLineView({
		    data:this.data,
		    creatorid:v,
		    side:'before'
		}).render();
	    },this);


	this.thumblines_after = _.map(
	    y_unique_vals,
	    function(v){
		return  new PicLineView({
		    data:this.data,
		    creatorid:v,
		    side:'after'
		}).render();
	    },this);

	_.each(this.thumblines_before,
	       function(e1,i){
		   $(this.chart[0][0]).append($(e1.el));
	     },this);
	_.each(this.thumblines_after,
	       function(e1,i){
		   $(this.chart[0][0]).append($(e1.el));
	     },this);


	this.thumbconnectors= [];

	return this;
    }
});
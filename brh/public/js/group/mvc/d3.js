PicChartModel = Backbone.Model.extend({
    initialize:function(args){
	this.pics = args.pics;
    }
});

PicLine = Backbone.Collection.extend({
    model:PBPic,
    center
})

PicTimeView = Backbone.View.extend({
    dragging : false,
    selected:null,
    drag_screen_start: null,
    drag_screen_last:null,
    drag_area:null,
    data:null,
    scttered:null,
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
	x =  model.get("datetime");
	return this.x(x)
    },
    get_y:function(model){
	y =  model.get("creatorid");
	return this.y(y)
    },
    selectRange:function(){
	var xs, ys, included, rect, c;
	xs = [(this.drag_screen_start[0]),
		 (this.drag_screen_last[0])];
	ys = [(this.drag_screen_start[1]),
	      (this.drag_screen_last[1])];
	rect = [d3.min(xs),d3.min(ys),
		d3.max(xs),d3.max(ys)];
	
	data_rect = [this.x.invert(rect[0]),
		     this.y.invert(rect[1]),
		     this.x.invert(rect[2]),
		     this.y.invert(rect[3])];
	dr = data_rect;
	console.log(data_rect);
	
	if(this.selectionRect == null){
	    this.selectionRect = this.g
		.append("svg:rect")  // create a new circle for each value
		.attr("x", $.proxy(function(d){return this.x(dr[0]);},this) )
		.attr("y", $.proxy(function(d){return this.y(dr[1])},this) )
		.attr("width", $.proxy(function(d){return this.x(dr[2])-this.x(dr[0])},this))
		.attr("height",$.proxy(function(d){return this.y(dr[3])-this.y(dr[1])},this))
	    
		.attr("class", "selection-rect")
		.style("opacity", .2);
	
	} else {
	    this.selectionRect
	    	.attr("x", $.proxy(function(d){return this.x(data_rect[0]);
					       console.log(this.x(data_rect[0]))},this) )
		.attr("y", $.proxy(function(d){return this.y(data_rect[1])},this) )
		.attr("width", $.proxy(function(d){return this.x(data_rect[2])-this.x(data_rect[0])},this))
		.attr("height",$.proxy(function(d){return this.y(data_rect[3])-this.y(data_rect[1])},this));
	}

	inclusion = _.groupBy(this.scattered[0],
			   $.proxy(function(e,i){
			       var x = this.get_x(this.data[i]);
			       var y = this.get_y(this.data[i]);
			       return x > rect[0] && x < rect[2]
				   && y > rect[1] && y < rect[3];
			   }, this));
	if(inclusion[true]) d3.selectAll(inclusion[true])
	    .attr("class", "scatter-dot selected");
	
	if(inclusion[false]) d3.selectAll(inclusion[false])
	    .attr("class", "scatter-dot deselected");

    },
    
    render:function(){
	pics = _.filter(this.model.pics, function(e){return e.get("datetime")});
	pics_data = pics;
	this.data = pics_data;
	
	// data that you want to plot, I've used separate arrays for x and y values
	xdata = _.map(pics, function(e){return e.get("datetime")});
	ydata = _.map(pics, function(e){return e.get('creatorid')});

	// size and margins for the chart
	var margin = {top: 20, right: 15, bottom: 60, left: 60}
	, width =600 - margin.left - margin.right
	, height = 400 - margin.top - margin.bottom;

	// x and y scales, I've used linear here but there are other options
	// the scales translate data values to pixel values for you

	var dy = d3.max(ydata) - d3.min(ydata);
	var dx = d3.max(xdata) - d3.min(xdata);
	this.x = d3.time.scale()
		.domain([d3.min(xdata) , d3.max(xdata)])  // the range of the values to plot
		.range([ 0, width ]);        // the pixel range of the x-axis

	this.y = d3.scale.linear()
		.domain([d3.min(ydata)-dy*.2, d3.max(ydata)+dy*.2])
		.range([ height, 0 ]);
	var x = this.x, y = this.y;


	// the chart object, includes all margins
	this.chart = d3.select(this.el)
	    .append('svg:svg')
	    .attr('width', width + margin.right + margin.left)
	    .attr('height', height + margin.top + margin.bottom)
	    .attr('class', 'chart')
            .attr("d", this.pics);

	// the main object where the chart and axis will be drawn
	var main = this.chart.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
		.attr('width', width)
		.attr('height', height)
		.attr('class', 'main')   ;

	this.drag_area = this.chart[0][0];
	this.chart.on("mousedown",$.proxy(this.mousedown,this));
	this.chart.on("mouseup", $.proxy(this.mouseup,this));
	this.chart.on("mousemove", $.proxy(this.mousemove,this));
	
	// draw the x axis
	var xAxis = d3.svg.axis()
		.scale(x)
		.ticks(d3.time.hours, 24);

	main.append('g')
	    .attr('transform', 'translate(0,' + height + ')')
	    .attr('class', 'main axis date')
	    .call(xAxis);
	/*
	
	main.append('g')
	    .attr('transform', 'translate(0,' + height + ')')
	    .attr('class', 'main axis date')
	    .call(xAxis);

	this.drag_area = this.g;
	this.g.on("mousedown",$.proxy(this.mousedown,this));
	this.g.on("mouseup", $.proxy(this.mouseup,this));
	this.g.on("mousemove", $.proxy(this.mousemove,this));

	 */

	// draw the y axis
	var y_unique_vals = _.unique(_.sortBy([2,3,1],function(e){return e}));
	var yAxis = d3.svg.axis()
		.scale(y)
		.orient('left')
		.ticks(y_unique_vals);

	main.append('g')
	    .attr('transform', 'translate(0,0)')
	    .attr('class', 'main axis yaxis')
	    .call(yAxis);

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
	    .attr("cy", $.proxy(this.get_y,this) ) // translate y value to a pixel
	    .attr("cx", $.proxy(this.get_x,this) ) // translate x value
	    .attr("r", 5) // radius of circles
	    .attr("class", "scatter-dot deselected")
	    .style("opacity", 0.6)
	    .on("click", function(d){console.log(d);}); // opacity of circle
	return this;
    }
});
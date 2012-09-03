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

    _.each(cache.slice(0,3),
	   function(e){
	       new PBPicView({model:e}).render()
		   .$el.appendTo($(".thumbs-container"));
	   });
});



function showpics(pics,el){
    if(pics.length ==0){
	return;
    }

};
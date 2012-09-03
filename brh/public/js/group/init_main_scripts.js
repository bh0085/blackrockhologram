$(function(){
    curgroup =new Group(sessionInfo.group);
    curbin =new Bin(sessionInfo.ebin);
    gview = new GroupView({model:curgroup,
			   bin:curbin});
    cache = _.map(curbin.get("pictures"), 
		  function(e){
		      return new PBPic(e);
		  });
    $("body").append(gview.render().$el);
});

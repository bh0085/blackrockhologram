$(function(){
    curgroup =new Group(sessionInfo.group);
    curbin =new Bin(sessionInfo.ebin);
    $(".bin-link-display").attr("href", curgroup.get("bin_url"));

});

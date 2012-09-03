function submit_email(ev){
    $.getJSON("/handleemail/"+curgroup.get("passphrase"),
	      {"email":$("input.email").val()},
	      email_submitted);
}

function email_submitted(data){
 
    curuser = data.user;
    $(".email-submitter").append(
	$("<div>").text("It worked! We've sent you a confirmation email and you'll be hearing from us occasionally")
    );
    
}

$(function(){

    curgroup =new Group(sessionInfo.group);
    curbin =new Bin(sessionInfo.ebin);

})
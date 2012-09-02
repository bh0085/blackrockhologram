function submit_passphrase(ev){
    $.getJSON("/handlepass",
	      {"passphrase":$("input.passphrase").val()},
	      passphrase_submitted);
}

function passphrase_submitted(data){
    $(".passphrase-submitter").append(
	$("<div>",{class:"passphrase-link"})
	    .append($("<a>",{href:data.link}).text(data.link))
    );
    
}


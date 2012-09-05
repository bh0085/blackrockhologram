function submit_passphrase(ev){
    $.getJSON("/handlepass",
	      {"passphrase":$("input.passphrase").val()},
	      passphrase_submitted);
}

function passphrase_submitted(data){
    window.location = data.link
    
    
}


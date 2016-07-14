console.log('content.js')
var customized_event = {};
var current_ele;
var hover = true;


function getPathTo(element) {
    if (element.id!=='')
        return 'id("'+element.id+'")';
    if (element===document.body)
        return element.tagName;

    var ix= 0;
    var siblings= element.parentNode.childNodes;
    for (var i= 0; i<siblings.length; i++) {
        var sibling= siblings[i];
        if (sibling===element)
            return getPathTo(element.parentNode)+'/'+element.tagName+'['+(ix+1)+']';
        if (sibling.nodeType===1 && sibling.tagName===element.tagName)
            ix++;
    }
}

function cancel_click_events(){
	all = document.getElementsByTagName('*');
	for (var i = 0, l = all.length; l > i; i++){
		all[i].onclick = function() {return(false);};
	}
}

function save_element_tag(){
	new_event = $('#custom_event').val();
	path = $('#current_hover').text();
	if( new_event==""){
		alert("No event selected");
	}
	else if(path==""){
		alert("No element selected");
	}
	else{
		chrome.storage.sync.set({path:new_event,url:window.location.href}, function() {
        console.log('Event Created!');
        $('#custom_event').val() = '';
        hover = true;
      });
	}
}


chrome.runtime.onMessage.addListener(function (msg, sender, response) {
	if((msg.from =='background'){
		
	}
	if ((msg.from === 'popup') && (msg.subject === 'customize')) {
	  	var link = document.createElement( "link" );
		link.href = chrome.extension.getURL('src/hover.css');
		link.type = "text/css";
		link.rel = "stylesheet";
		link.media = "screen,print";
		document.getElementsByTagName( "head" )[0].appendChild( link );
		cancel_click_events();
		var div = document.createElement('div');
		document.body.appendChild(div);
		div.innerHTML = '<span class="edit_bar_cell">Edit Mode: <span> <div class="edit_bar_cell" id="current_hover"></div><label class="edit_bar_cell">Tracking Call to Assign</label><input id="custom_event" class="edit_bar_cell" type="text" placeholder="product viewed"><button class="edit_bar_cell" id="save">save</button>'
		div.className = 'edit_mode';

		var intervalid = 0;
		document.body.addEventListener('click', function() {
		    console.log(current_ele);
		    document.getElementById("current_hover").innerHTML = getPathTo(current_ele);
		    hover = false;
		    setTimeout(function(){hover=true},2000)
		});
	  	var ovrly = document.createElement('div');
		document.body.appendChild(ovrly);
		ovrly.id = 'overlay';

	  	var cur, overlay = $("#overlay"),
	    no = [document.body, document.documentElement, document];
	    $('.edit_mode').each(function(){no.push(this)});
	    $('.edit_bar_cell').each(function(){no.push(this)});
		$(document).mousemove(function(e) {
		if(hover){
	    if (e.target === cur) {
	        return;
	    }

	    if (~no.indexOf(e.target)) {
	    	if(cur != null){current_ele = cur;}
	        cur = null;
	        overlay.hide();
	        return;
	    }

	    var target = $(e.target),
	        offset = target.offset(),
	        width = target.outerWidth(),
	        height = target.outerHeight();

	    cur = e.target;
	    if(cur != null){
	    	current_ele = cur;
	    }
		
	    overlay.css({
	        top: offset.top,
	        left: offset.left,
	        width: width,
	        height: height
	    }).show();
	}

});

  }

  	

	
});

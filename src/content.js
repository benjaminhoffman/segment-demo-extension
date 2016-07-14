console.log('content.js')
var customized_event = {};
var current_ele;



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
function add_mouse_overs(){
	var all = document.getElementsByTagName("*");
	var max_width = Math.max(document.documentElement["clientWidth"], document.body["scrollWidth"], document.documentElement["scrollWidth"], document.body["offsetWidth"], document.documentElement["offsetWidth"]);
	for (var i = 0, l = all.length; l > i; i++){
		all[i].onclick = function() {return(false);};
		/*if (all[i].offsetWidth < .5*max_width && all[i].offsetWidth > 10){
  		all[i].onmouseover=function(){current_ele = this; console.log(this);};
  		}*/
	}
}

chrome.runtime.onMessage.addListener(function (msg, sender, response) {
  console.log(msg.from);
  console.log(msg.subject);
  if ((msg.from === 'popup') && (msg.subject === 'customize')) {
  	var link = document.createElement( "link" );
		link.href = chrome.extension.getURL('src/hover.css');
		link.type = "text/css";
		link.rel = "stylesheet";
		link.media = "screen,print";
		document.getElementsByTagName( "head" )[0].appendChild( link );
	add_mouse_overs();
	var div = document.createElement('div');
	document.body.appendChild(div);
	div.innerHTML = '<span class="edit_bar_cell">Edit Mode: <span> <div class="edit_bar_cell" id="current_hover"></div><label class="edit_bar_cell">Tracking Call to Assign</label><input class="edit_bar_cell" type="text" placeholder="product viewed"><button class="edit_bar_cell" id="save">save</button>'
	div.className = 'edit_mode';

	var intervalid = 0;
	document.body.addEventListener('click', function() {
	    console.log(current_ele);
	    document.getElementById("current_hover").innerHTML = getPathTo(current_ele);
	    all = document.getElementsByTagName("*");
	    for (var i = 0, l = all.length; l > i; i++){
  			all[i].onmouseover=null;
  		}
  		if(intervalid == 0){
  			setTimeout(add_mouse_overs,2000);
  		}
	});
  	var ovrly = document.createElement('div');
	document.body.appendChild(ovrly);
	ovrly.id = 'overlay';

  	var cur, overlay = $("#overlay"),
    no = [document.body, document.documentElement, document];
    $('.edit_mode').each(function(){no.push(this)});
    $('.edit_bar_cell').each(function(){no.push(this)});
	$(document).mousemove(function(e) {

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


});

  }

  	

	
});

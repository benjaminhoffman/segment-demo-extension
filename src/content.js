console.log('content.js')
var customized_event = {};
var current_ele;
var hover = true;

function getPathTo(element) {
    if (element.id!=='')
        return '~DIV#'+element.id;
    if (element===document.body)
        return '~'+element.tagName;

    var siblings= element.parentNode.childNodes;
    for (var i= 0; i<siblings.length; i++) {
        var sibling= siblings[i];
        if (sibling===element)
            return getPathTo(element.parentNode)+' '+element.tagName;
    }
}

function cancel_click_events(){
	all = document.getElementsByTagName('*');
	for (var i = 0, l = all.length; l > i; i++){
		all[i].onclick = function() {return(false);};
		if($(all[i]).attr('href') != undefined){
			if($(all[i]).attr('href').indexOf('css')===-1) { 
				$(all[i]).attr('href',"javascript:void(0)");
			}
		}
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
		var path_key = path;
		var data = {};
		data[path_key] = new_event;
		data[window.location.href] = path_key;
		chrome.storage.sync.set(data, function() {
        console.log('Event Created!');
        $('#custom_event').val('');
        hover = true;
      });
	}
}


function send_event_message(event_to_send){
	data = {}
	console.log(event_to_send);
	data['event'] = event_to_send;
	console.log(data);
	chrome.runtime.sendMessage(data);
}

chrome.storage.sync.get(null, function(localstorage){
console.log(localStorage);
var allKeys = Object.keys(localstorage);
console.log(allKeys);
if(localstorage[window.location.href]){
	var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src="src/analytics-min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="3.1.0";
    analytics.load('cuOgSJgFEt1tN3lSUEfvWv6g1NM1hXmY');
    analytics.page();
    }
		var keyarrayLength = allKeys.length;
		for (var j = 0; j < keyarrayLength; j++){ 
			console.log(allKeys[j]);
			if(allKeys[j].charAt(0) == '~'){
				path = allKeys[j].substr(1);
				console.log(path);
				var event = localstorage[allKeys[j]];
				console.log(event)
				var select=document.querySelector(path);
				console.log(select);
				if(select != null){
					select.id = "custom_event_trigger";
					oldhref = select.href;
					$(select).removeAttr("href");
					document.getElementById("custom_event_trigger").onclick = function(){send_event_message(event); window.location.href=oldhref;};
				}
				else{
					send_event_message(event);
				}
			}
		}
	}
});




chrome.runtime.onMessage.addListener(function (msg, sender, response) {
	if ((msg.from === 'popup') && (msg.subject === 'clear')) {
		chrome.storage.sync.clear(function() {
        alert('ALL event data cleared');
		});
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
		document.getElementById('save').onclick = save_element_tag;
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

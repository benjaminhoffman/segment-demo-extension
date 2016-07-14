console.log('content.js')

const trackEvent = {};
const port = chrome.runtime.connect({ name: "events" });

port.postMessage({ url: window.location.href });

port.onMessage.addListener(function(msg,trackEvent) {
	console.log(msg)
	if(msg){
		var link = document.createElement( "link" );
		link.href = chrome.extension.getURL('src/hover.css');
		link.type = "text/css";
		link.rel = "stylesheet";
		link.media = "screen,print";
		document.getElementsByTagName( "head" )[0].appendChild( link );
		var overlay = document.createElement('div');
		document.body.appendChild(overlay);
		overlay.id = "add_event"
		overlay.class = "overlay"
		overlay.innerHTML = '<img src="https://cdn3.iconfinder.com/data/icons/interface/100/close_button_1-512.png" class="closebtn" onclick="function(){document.getElementById(\'add_event\').style.width = \'0%\'}"><div class="overlay-content"><div>Event Name:<input type="text" name="event_name" value="" maxlength="100" /><button onclick="function(){document.getElementById(\'add_event\').style.width = \'0%\'}>Done</button></div></div>'

		var all = document.getElementsByTagName("*");
		for (var i=0, max=all.length; i < max; i++) {
     		all[i].onclick=function(){
     			document.getElementById("add_event").style.width = "100%";
     		}
		}
		overlay.onclick=null;
		var div = document.createElement('div');
		document.body.appendChild(div);
		div.textContent = 'Tagging Mode';
		div.className = 'edit_mode';
	}
	else{
	  document.body.addEventListener('click', function() {
	    console.log(trackEvent)
	    port.postMessage({ trackEvent: trackEvent })
	  });
	}
});

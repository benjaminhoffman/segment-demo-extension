console.log('content.js')
var customized_event = {};
var current_ele = '';

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
  	var info = function(ele) {
  		return function() {
  			console.log('element_clicked');
    		chrome.runtime.sendMessage({
      			from:    'content',
      			subject: 'id: '+ele.id+':name: '+ele.name
    		});
  		}
	};

	var all = document.getElementsByTagName("div");;
	for (var i = 0, l = all.length; l > i; i++){
  		all[i].onmouseover=function(){current_ele = this.id; console.log(this.id);};
	}
  }

  	var div = document.createElement('div');
	document.body.appendChild(div);
	div.innerHTML = '<span class="edit_bar_cell">Edit Mode: <span> <div class="edit_bar_cell" id="current_hover"></div><label class="edit_bar_cell">Tracking Call to Assign</label><input class="edit_bar_cell" type="text" placeholder="product viewed"><button class="edit_bar_cell" id="save">save</button>'
	div.className = 'edit_mode';

	document.body.addEventListener('click', function() {
	    console.log(current_ele);
	    document.getElementById("current_hover").innerHTML = current_ele;
	    for (var i = 0, l = all.length; l > i; i++){
  			all[i].onmouseover=null;
  		}
	});

	
});

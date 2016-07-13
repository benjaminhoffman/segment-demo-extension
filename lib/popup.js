var PROD_NAME = '<span class="field"> \
  <label>Prod Name: </label> \
  <input type="text" name="prodName" value="Monopoly" /> \
</span><br />'

var PROD_ID =
'<span class="field"> \
  <label>Product ID: </label> \
  <input type="text" name="prodId" value="507f1f77bcf86cd799439011" /> \
</span><br />'

var CAT =
'<span class="field"> \
  <label>Category: </label> \
  <input type="text" name="cat" value="Games" /> \
</span><br />'

var PRICE =
'<span class="field"> \
  <label>Price: </label> \
  <input type="text" name="price" value="18.99" /> \
</span><br />'

var QUANTITY =
'<span class="field"> \
  <label>Quantity: </label> \
  <input type="text" name="quantity" value="3" /> \
</span><br />'

var CART_ID =
'<span class="field"> \
  <label>Cart Id: </label> \
  <input type="text" name="cartId" value="d92jd29jd92jd29j92d92jd" /> \
</span><br />'

var PRODUCTS =
'<span class="field"> \
  <label>Products: </label> \
  <input type="text" name="products" value="Monopoly, Chess, Checkers" /> \
</span><br />'

var TOTAL =
'<span class="field"> \
  <label>Total: </label> \
  <input type="text" name="total" value="64.49" /> \
</span><br />'

var CUSTOM =
'<span class="field" id="customEvent"> \
  <label>Event Name:</label> \
  <input type="text" name="customTrack" id="customTrackName" /><br /> \
</span> \
<span class="field"> \
  <input type="text" name="customKey1" value="key1" class="label-custom" /> : \
  <input type="text" name="customVal1" value="val1" class="input-custom" /> \
</span><br />'


function addFormFields (eventName) {
  var innerHtml = '';
  switch (eventName) {
    case '*Custom*':
      innerHtml = CUSTOM;
      break;
    case 'Product Viewed':
      innerHtml = PROD_NAME + PROD_ID + CAT + PRICE + QUANTITY;
      break;
    case 'Product Added':
      innerHtml = PROD_NAME + PROD_ID + CAT + PRICE + QUANTITY;
      break;
    case 'Cart Viewed':
      innerHtml = CART_ID + PRODUCTS + TOTAL;
      break;
    default:
      break;
  }
  document.getElementById('customFields').innerHTML = innerHtml;
}

function removeCustomTextArea () {
  if (document.getElementById('customFields')) {
    document.getElementById('customFields').innerHTML = '';
  }
}


// capture form data and serialize
function getFormData(e) {
  var formData = {}
  formData.trackCall = {}
  var rawData = {}

  // if user chooses event name other than custom
  var trackName = document.getElementById("predefinedEvents");
  if (trackName.value !== '*Custom*') {

    // serialize our form data
    for (var i = 0; i < e.target.length; i++) {
      rawData[e.target[i].name] = e.target[i].value;
    }

    // create nested trackcall
    for (var key in rawData) {
      formData.trackCall[key] = rawData[key];
    }

    // convert products string into an array
    if (formData.trackCall.products) {
      delete formData.trackCall.products;
      formData.trackCall.products = rawData.products.split(',')
    }

    delete formData.trackCall.url;
    delete formData.trackCall[""];

    // create url property
    formData['url'] = rawData.url;


  } else {
    // TODO: need logic for custom event
  }


  // if user clicks 'Custom' for event name
  if (trackName.value === 'Custom') {
    // capture the string user entered for their custom event name and assign to trackCall
    formData.trackCall.name = document.getElementById('customTrackName').value;
  } else {
    // otherwise, pull track event name from dropdown
    formData.trackCall.name = trackName.value;
  }
  console.log(formData);
  debugger
  return formData;
}

document.addEventListener('DOMContentLoaded', function () {

  // prefill pageUrl form field w/ current page URL
  function setCurrentTabUrl() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var tabUrl = tabs[0].url;
      document.getElementById("pageUrl").value = tabUrl;
    });
  }
  setCurrentTabUrl();

  // edits custom form fields
  var trackName = document.getElementById("predefinedEvents");
  trackName.addEventListener('change', function() {
    var dropdownValue = trackName.value;
    addFormFields(dropdownValue);
  });


  document.getElementById("defineEvent").addEventListener('submit', function(e) {

    var formData = getFormData(e);

    // open a port and send our formData to backgound.js
    var port = chrome.runtime.connect({ name: 'events' });
    port.postMessage({newEvent: formData});

    // close extension on form submit
    // window.close();

  });
});

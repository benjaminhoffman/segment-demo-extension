
const PROD_NAME = '<span class="field"> \
  <label>Prod Name: </label> \
  <input type="text" name="prodName" value="Monopoly" /> \
</span><br />'

const PROD_ID =
'<span class="field"> \
  <label>Product ID: </label> \
  <input type="text" name="prodId" value="507f1f77bcf86cd799439011" /> \
</span><br />'

const CAT =
'<span class="field"> \
  <label>Category: </label> \
  <input type="text" name="cat" value="Games" /> \
</span><br />'

const PRICE =
'<span class="field"> \
  <label>Price: </label> \
  <input type="text" name="price" value="18.99" /> \
</span><br />'

const QUANTITY =
'<span class="field"> \
  <label>Quantity: </label> \
  <input type="text" name="quantity" value="3" /> \
</span><br />'

const CART_ID =
'<span class="field"> \
  <label>Cart Id: </label> \
  <input type="text" name="cartId" value="d92jd29jd92jd29j92d92jd" /> \
</span><br />'

const PRODUCTS =
'<span class="field"> \
  <label>Products: </label> \
  <input type="text" name="products" value="Monopoly,Chess,Checkers" /> \
</span><br />'

const SKU =
'<span class="field"> \
  <label>SKU: </label> \
  <input type="text" name="sku" value="G-32" /> \
</span><br />'


const TOTAL =
'<span class="field"> \
  <label>Total: </label> \
  <input type="text" name="total" value="64.49" /> \
</span><br />'

const CUSTOM =
'<span class="field" id="customEvent"> \
  <label>Event Name:</label> \
  <input type="text" name="customTrack" id="customTrackName" value="Button Clicked" /><br /> \
</span> \
<span class="field"> \
  <label>Custom Prop1:</label> \
  <input type="text" name="customKey1" value="price" class="label-custom" /> : \
  <input type="text" name="customVal1" value="8.99" class="input-custom" /> \
</span><br /> \
<span class="field"> \
  <label>Custom Prop2:</label> \
  <input type="text" name="customKey2" value="size" class="label-custom" /> : \
  <input type="text" name="customVal2" value="large" class="input-custom" /> \
</span><br /> \
<span class="field"> \
  <label>Custom Prop3:</label> \
  <input type="text" name="customKey3" value="color" class="label-custom" /> : \
  <input type="text" name="customVal3" value="blue" class="input-custom" /> \
</span><br />'


function addFormFields (eventName) {
  let innerHtml = '';
  switch (eventName) {
    case '*Custom*':
      innerHtml = CUSTOM;
      break;
    case 'Product List Viewed':
        innerHtml = CAT + PRODUCTS;
        break;
    case 'Product Clicked':
      innerHtml = PROD_NAME + PROD_ID + SKU + CAT + PRICE + QUANTITY;
      break;
    case 'Product Added':
      innerHtml = PROD_NAME + PROD_ID + SKU + CAT + PRICE + QUANTITY;
      break;
    case 'Checkout Started':
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
  const rawData = {};
  const formData = {
    trackCall: {
      properties: {}
    }
  };

  // if user chooses event name other than custom
  const trackName = document.getElementById("predefinedEvents");
  if (trackName.value !== '*Custom*') {

    // serialize our form data
    for (var i = 0; i < e.target.length; i++) {
      rawData[e.target[i].name] = e.target[i].value;
    }

    // create nested trackcall
    for (var key in rawData) {
      formData.trackCall.properties[key] = rawData[key];
    }

    // convert products string into an array
    if (formData.trackCall.properties.products) {
      delete formData.trackCall.properties.products;
      formData.trackCall.properties.products = rawData.products.split(',')
    }

    // delete properties we don't want
    delete formData.trackCall.properties.url;
    delete formData.trackCall.properties[""];
    delete formData.trackCall.properties.method;
    delete formData.trackCall.properties.userId;

    // cache the current URL so we'll know which page to fire this event on
    formData.url = rawData.url;

    // capture the dropdown value and assign it to this track event name
    formData.trackCall.event = trackName.value;
    formData.trackCall.userId = rawData.userId;

  } else {
    // serialize our form data
    for (var i = 0; i < e.target.length; i++) {
      rawData[e.target[i].name] = e.target[i].value;
    }

    // build our flat track properties object
    formData.url = rawData.url;
    formData.trackCall.event = rawData.customTrack;
    formData.trackCall.userId = rawData.userId;
    formData.trackCall.properties[rawData.customKey1] = rawData.customVal1;
    formData.trackCall.properties[rawData.customKey2] = rawData.customVal2;
    formData.trackCall.properties[rawData.customKey3] = rawData.customVal3;
  }
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

  // resets all of extension's localStorage
  document.getElementById("reset").addEventListener('click', function(e) {
    var port = chrome.runtime.connect({ name: 'events' });
    port.postMessage({ clear: true })

    // close extension on form submit
    window.close();
  });

  // adds event for this page on form submit
  // and overwrites any events for this page
  document.getElementById("defineEvent").addEventListener('submit', function(e) {
    console.log('onSubmit')
    const formData = getFormData(e);

    // open a port and send our formData to backgound.js
    const port = chrome.runtime.connect({ name: 'events' });
    port.postMessage({ newEvent: formData });
    port.postMessage({ reload: true });

    // reload webpage & close extension on form submit
    chrome.tabs.reload();
    window.close();
  });
});

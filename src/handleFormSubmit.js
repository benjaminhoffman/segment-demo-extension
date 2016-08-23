
// serialize form input data

export function serializeFormData(e) {
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
    var key_arr = [];
    var value_arr = [];
    for (var key in rawData) {
      //if (key.includes("Key")){
        //rawData[key]
        key_arr.push('Key: '+key);
      //}
      //if (key.includes("Val")){
        //rawData[key]
        value_arr.push('Val: '+key);
      //}
    }
    var count = 0;
    for (var real_key in key_arr){
      if (count >= value_arr.length){
        break;
      }
      else{
        formData.trackCall.properties[key_arr[real_key]] = rawData[value_arr[count]];
        count ++;
      }
    }
  }
  return formData;
}

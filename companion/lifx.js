export function LifxAPI(apiKey) {
  if (apiKey !== undefined) {
    this.apiKey = apiKey;
  }
  else {
    this.apiKey = "None";
  }
};

// power: on, off
// selector: e.g. id:d3b2f2d97452
LifxAPI.prototype.toggleBulbs = function(selector) {
  let self = this;
  return new Promise(function(resolve, reject) {
    let url = `https://api.lifx.com/v1/lights/${selector}/toggle`;
    console.log(`URL: ${url}`);
    let myRequest = new Request(url, { 
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${self.apiKey}` 
      },
      body: {"duration": 1}
    });
    
    console.log("key: " + self.apiKey);
    //TODO: Add handling for missing api key
    
    fetch(myRequest).then(function(response) {
      console.log(`Response(${response.status}): ${JSON.stringify(response.body)}`);
      return response.json();
    }).then(function(json) {
      //console.log("Got JSON response from server:" + JSON.stringify(json));
      console.log("Preparing response from json");
      resolve(json);
    }).catch(function (error) {
      reject(error);
    });
  });
}

LifxAPI.prototype.listBulbs = function() {
  let self = this;
  return new Promise(function(resolve, reject) {
    let url = "https://api.lifx.com/v1/lights/";
    let myRequest = new Request(url, { 
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${self.apiKey}` 
      }
    });
    
    //TODO: Add handling for missing api key
    //console.log("key: " + self.apiKey);
    
    fetch(myRequest).then(function(response) {
      return response.json();
    }).then(function(json) {
      //console.log("Got JSON response from server:" + JSON.stringify(json));
      console.log("Preparing data");
      
      let lights = [];
      json.forEach( (light) => {
        //console.log("Adding light");
        let l = {
          "id": light["id"],
          "name": light["label"],
          "power": light["power"],
          "brightness": light["brightness"]
        }
        lights.push(l);
      });
      console.log("Added lights");
      lights.sort( (a,b) => { return ('' + a.name).localeCompare(b.name) } );
      
      resolve(lights);
    }).catch(function (error) {
      reject(error);
    });
  });
}

import { me } from "companion";
import * as messaging from "messaging";
import { settingsStorage } from "settings";

import { LifxAPI } from "./lifx.js"
import { ACTION_TOGGLE } from "../common/globals.js";

let lifxApi = null;

settingsStorage.onchange = function(evt) {
  initLifx();
  getLifxLights();
}

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  // Ready to send or receive messages
  initLifx();
  getLifxLights();
}

// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {
  if (evt.data.action === ACTION_TOGGLE) {
    console.log(`Toggle: ${JSON.stringify(evt.data)}`);
    toggleLifxLights(evt.data.selector);
  }
  else {
    // Output the message to the console
    console.log(`Unknown action:  + ${JSON.stringify(evt.data)}`);
  }
}

function toggleLifxLights(selector) {
  //console.log("Got selector: " + selector);
  lifxApi.toggleBulbs(selector).then(function(data) {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      console.log(`Toggle data: ${JSON.stringify(data)}`);
      //messaging.peerSocket.send(data); - send some response to app?
    }
  }, function(error) {
    console.log(`Reject error: ${error}`);
  }
  ).catch(function (e) {
    console.log(`error: ${JSON.stringify(e)}`);
  });
}

function initLifx() {
  if(lifxApi == null) {
    let apikey = settingsStorage.getItem("lifxToken");

    if (apikey) {
      try {
        apikey = JSON.parse(apikey).name;
      }
      catch (e) {
        console.log(`Error parsing setting value: ${e}`);
      }
    }

    lifxApi = new LifxAPI(apikey);
  }
}

function getLifxLights() {
  lifxApi.listBulbs().then(function(data) {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      console.log(`Get lights: ${JSON.stringify(data)}`);
      messaging.peerSocket.send(data);
    }
  }).catch(function (e) {
    console.log(`error: ${JSON.stringify(e)}`);
  });
}
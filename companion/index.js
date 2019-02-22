import { me } from "companion";
import * as messaging from "messaging";
import { settingsStorage } from "settings";

import { LifxAPI } from "./lifx.js"
import { ACTION_LIGHTS_LOADED, ACTION_TOGGLE, ACTION_TOGGLE_RESPONSE } from "../common/globals.js";

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
      messaging.peerSocket.send({
        "action": ACTION_TOGGLE_RESPONSE,
        "status": data.results[0].status,
        "lightId": data.results[0].id
      });
    }
  }, function(error) {
    console.log(`Reject error: ${error}`);
    messaging.peerSocket.send({
      "action": ACTION_TOGGLE_RESPONSE,
      "status": "error"
    });
  }
  ).catch(function (e) {
    console.log(`error: ${JSON.stringify(e)}`);
    messaging.peerSocket.send({
      "action": ACTION_TOGGLE_RESPONSE,
      "status": "error"
    });
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
      messaging.peerSocket.send({
        "action": ACTION_LIGHTS_LOADED,
        "data": data
      });
    }
  }).catch(function (e) {
    console.log(`error: ${JSON.stringify(e)}`);
  });
}
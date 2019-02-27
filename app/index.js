import * as messaging from "messaging";
import { LifxUI } from "./ui.js";
import { ACTION_LIGHTS_LOADED, ACTION_TOGGLE, ACTION_TOGGLE_RESPONSE, ACTION_NO_API_KEY } from "../common/globals.js";

let toggle = function(selector) {
  //console.log(`Selector: ${selector}`);
  messaging.peerSocket.send({
    "action": ACTION_TOGGLE,
    "selector": selector
  });
};

let ui = new LifxUI(toggle);

ui.updateUI("disconnected");

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  ui.updateUI("loading");
  messaging.peerSocket.send("Hi!");
}

// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {
  if (evt.data.action === ACTION_LIGHTS_LOADED) {
    ui.updateUI("loaded", evt.data.data);
  }
  else if (evt.data.action === ACTION_TOGGLE_RESPONSE) {
    ui.updateUI("toggle", evt.data);
  }
  else if (evt.data.action === ACTION_NO_API_KEY) {
    ui.updateUI("noapikey", evt.data);
  }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  ui.updateUI("error");
}

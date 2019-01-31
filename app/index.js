import * as messaging from "messaging";
import { LifxUI } from "./ui.js";
import { ACTION_TOGGLE } from "../common/globals.js";

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
  ui.updateUI("loaded", evt.data);
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  ui.updateUI("error");
}

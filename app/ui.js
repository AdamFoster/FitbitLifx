import document from "document";
import { MAX_LIGHTS } from "../common/globals.js";

export function LifxUI(toggle) {
  this.lightData = [];
  this.lightList = document.getElementById("lightList");
  this.statusText = document.getElementById("status");
  
  let items = this.lightList.getElementsByClassName("light-item");

  this.tiles = [];
  for (let i = 0; i < MAX_LIGHTS; i++) {
    let tile = document.getElementById(`light-${i}`);
    if (tile) {
      this.tiles.push(tile);
    }
  }

  items.forEach((element, index) => {
    let touch = element.getElementById("light-tile-touchbox");
    touch.onclick = (evt) => {
      console.log(`touched: ${index}`);

      if (this.lightData[index].connected) { //only try to change power if light is connected
        toggle(`id:${this.lightData[index].id}`);
        let oldpower = this.lightData[index].power;
        this.tiles[index].getElementById("power").text = oldpower === "on" ? "off" : "on";
      }
    }
  });
}

LifxUI.prototype.updateUI = function(state, data) {
  if (state === "loaded") {
    this.lightList.style.display = "inline";
    this.statusText.text = "";

    this.updateLights(data);
  }
  else {
    this.lightList.style.display = "none";

    if (state === "loading") {
      this.statusText.text = "Loading lights ...";
    }
    else if (state === "disconnected") {
      this.statusText.text = "Please wait for connection to phone..."
    }
    else if (state === "error") {
      this.statusText.text = "Something terrible happened.";
    }
    else {
      this.statusText.text = "How did we get here?";
    }
  }
}

LifxUI.prototype.updateLights = function(data) {
  this.lightData = data;
  for (let i = 0; i < MAX_LIGHTS; i++) {
    let tile = this.tiles[i];
    if (!tile) {
      continue;
    }

    const light = data[i];
    if (!light) {
      tile.style.display = "none";
      continue;
    }

    tile.style.display = "inline";
    tile.getElementById("lightName").text = light.name;
    tile.getElementById("brightness").text = (100*light.brightness).toFixed(0) + " %";
    tile.getElementById("power").text = light.power;
    if (!light.connected) {
      tile.getElementById("lightName").style.fill = "grey";
      tile.getElementById("brightness").style.fill = "grey";
      tile.getElementById("brightness").text = "offline";
      tile.getElementById("power").style.opacity = 0;
    }
  }
}

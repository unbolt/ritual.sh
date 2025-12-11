// Configuration
const config = {
  buildingsFar: { count: [10, 15], windows: [10, 30] },
  buildingsMid: { count: [6, 10], windows: [20, 40] },
  buildingsNear: { count: [5, 10], windows: [4, 8] },
};

// Helper function to get random integer between min and max (inclusive)
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to create a building with random windows
function createBuilding(minWindows, maxWindows) {
  const building = document.createElement("div");
  building.className = "building";

  const windowsContainer = document.createElement("div");
  windowsContainer.className = "building-windows";

  const numWindows = randomInt(minWindows, maxWindows);

  for (let i = 0; i < numWindows; i++) {
    const window = document.createElement("div");
    window.className = "window-light";
    windowsContainer.appendChild(window);
  }

  building.appendChild(windowsContainer);
  return building;
}

// Function to populate a layer with buildings
function populateLayer(layerName, numBuildings, windowRange) {
  const layer = document.querySelector(`.${layerName}`);
  if (!layer) {
    console.warn(`Layer ${layerName} not found`);
    return;
  }

  // Clear existing buildings
  layer.innerHTML = "";

  for (let i = 0; i < numBuildings; i++) {
    const building = createBuilding(windowRange[0], windowRange[1]);
    layer.appendChild(building);
  }
}

// Initialize all layers
function initializeCityscape() {
  populateLayer(
    "buildings-far",
    randomInt(...config.buildingsFar.count),
    config.buildingsFar.windows,
  );

  populateLayer(
    "buildings-mid",
    randomInt(...config.buildingsMid.count),
    config.buildingsMid.windows,
  );

  populateLayer(
    "buildings-near",
    randomInt(...config.buildingsNear.count),
    config.buildingsNear.windows,
  );
}

// Run when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeCityscape);
} else {
  initializeCityscape();
}

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

  // Check for data-count attribute and use it if present
  const dataCount = layer.dataset.count;
  const buildingCount = dataCount ? parseInt(dataCount, 10) : numBuildings;

  // Clear existing buildings
  layer.innerHTML = "";
  for (let i = 0; i < buildingCount; i++) {
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

  document.querySelectorAll(".window-light").forEach((window) => {
    if (Math.random() < 0.5) {
      window.setAttribute("data-off", "");
    } else {
      const colorChoice = Math.random() * 100;
      let hue, sat, light;

      if (colorChoice <= 85) {
        hue = 40 + Math.random() * 20;
        sat = 70 + Math.random() * 30;
        light = 50 + Math.random() * 30;
      } else if (colorChoice <= 95) {
        hue = 320 + Math.random() * 20;
        sat = 60 + Math.random() * 40;
        light = 60 + Math.random() * 20;
      } else {
        hue = 260 + Math.random() * 40;
        sat = 50 + Math.random() * 50;
        light = 50 + Math.random() * 30;
      }

      window.style.setProperty("--hue", hue);
      window.style.setProperty("--sat", `${sat}%`);
      window.style.setProperty("--light", `${light}%`);
    }
  });
}

// Run when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeCityscape);
} else {
  initializeCityscape();
}

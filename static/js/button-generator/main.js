/**
 * Button Generator - Main Application File
 *
 * This demonstrates how to use the modular button generator system.
 * Effects are imported and registered with the generator.
 */

import { ButtonGenerator } from "./button-generator-core.js";
import { UIBuilder } from "./ui-builder.js";

// Import effects (each effect file exports a register() function)
import * as solidBg from "./effects/background-solid.js";
import * as gradientBg from "./effects/background-gradient.js";
import * as textureBg from "./effects/background-texture.js";
import * as emojiWallpaper from "./effects/background-emoji-wallpaper.js";
import * as externalImage from "./effects/background-external-image.js";
import * as rainbowBg from "./effects/background-rainbow.js";
import * as rain from "./effects/background-rain.js";
import * as starfield from "./effects/background-starfield.js";
//import * as bubbles from "./effects/background-bubbles.js";
import * as aurora from "./effects/background-aurora.js";
import * as fire from "./effects/background-fire.js";
import * as border from "./effects/border.js";
import * as standardText from "./effects/text-standard.js";
import * as textShadow from "./effects/text-shadow.js";
import * as waveText from "./effects/wave-text.js";
import * as rainbowText from "./effects/rainbow-text.js";
import * as spinText from "./effects/spin-text.js";
import * as glitch from "./effects/glitch.js";
import * as pulse from "./effects/pulse.js";
import * as shimmer from "./effects/shimmer.js";
import * as scanline from "./effects/scanline.js";
import * as rgbSplit from "./effects/rgb-split.js";
import * as noise from "./effects/noise.js";
import * as rotate from "./effects/rotate.js";
import * as hologram from "./effects/hologram.js";
import * as spotlight from "./effects/spotlight.js";

/**
 * Initialize the button generator application
 */
export function init() {
  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupApp);
  } else {
    setupApp();
  }
}

/**
 * Setup the application
 */
async function setupApp() {
  console.log("Initializing Button Generator...");

  // Setup collapsible sections
  setupCollapsible();

  // Get canvas
  const canvas = document.getElementById("button-canvas");
  if (!canvas) {
    console.error("Canvas element not found!");
    return;
  }

  // Create button generator
  const generator = new ButtonGenerator(canvas, {
    fps: 20,
    duration: 2,
    fonts: [
      "Arial",
      "Lato",
      "Roboto",
      "Open Sans",
      "Montserrat",
      "Oswald",
      "Bebas Neue",
      "Roboto Mono",
      "VT323",
      "Press Start 2P",
      "DSEG7-Classic",
    ],
  });

  // Register all effects
  console.log("Registering effects...");
  solidBg.register(generator);
  gradientBg.register(generator);
  textureBg.register(generator);
  emojiWallpaper.register(generator);
  //externalImage.register(generator);
  rainbowBg.register(generator);
  rain.register(generator);
  starfield.register(generator);
  //bubbles.register(generator);
  aurora.register(generator);
  fire.register(generator);
  border.register(generator);
  standardText.register(generator);
  textShadow.register(generator);
  waveText.register(generator);
  rainbowText.register(generator);
  spinText.register(generator);
  glitch.register(generator);
  pulse.register(generator);
  shimmer.register(generator);
  scanline.register(generator);
  rgbSplit.register(generator);
  noise.register(generator);
  rotate.register(generator);
  hologram.register(generator);
  spotlight.register(generator);

  console.log(`Registered ${generator.getAllEffects().length} effects`);

  // Build UI from effects
  console.log("Building UI...");
  const controlsContainer = document.querySelector(".controls-section");
  if (!controlsContainer) {
    console.error("Controls container not found!");
    return;
  }

  const uiBuilder = new UIBuilder(controlsContainer);
  uiBuilder.buildUI(generator.getAllEffects());
  uiBuilder.setupConditionalVisibility();

  // Preload fonts
  console.log("Loading fonts...");
  await generator.preloadFonts();

  // Bind controls (after UI is built)
  generator.bindControls();

  // Setup additional UI handlers
  setupUIHandlers(generator);

  // Setup download button
  setupDownloadButton(generator);

  // Setup presets
  setupPresets(generator);

  // Initial draw
  generator.updatePreview();

  console.log("Button Generator ready!");
}

/**
 * Setup collapsible section functionality
 */
function setupCollapsible() {
  const headers = document.querySelectorAll(".control-group-header");
  console.log("Found", headers.length, "collapsible headers");

  headers.forEach((header) => {
    header.addEventListener("click", () => {
      const controlGroup = header.closest(".control-group");
      if (controlGroup) {
        controlGroup.classList.toggle("collapsed");
      }
    });
  });
}

/**
 * Setup UI handlers for conditional visibility
 */
function setupUIHandlers(generator) {
  // Note: Conditional visibility is now handled automatically by UIBuilder.setupConditionalVisibility()
  // This function is kept for any additional custom handlers if needed in the future
}

/**
 * Setup download button
 */
function setupDownloadButton(generator) {
  const downloadBtn = document.getElementById("download-button");
  if (!downloadBtn) return;

  downloadBtn.addEventListener("click", async () => {
    const originalText = downloadBtn.textContent;
    downloadBtn.disabled = true;
    downloadBtn.textContent = "Generating GIF...";

    try {
      const blob = await generator.exportAsGif((progress, stage) => {
        if (stage === "generating") {
          const percent = Math.round(progress * 100);
          downloadBtn.textContent = `Generating: ${percent}%`;
        } else if (stage === "encoding") {
          const percent = Math.round(progress * 100);
          downloadBtn.textContent = `Encoding: ${percent}%`;
        }
      });

      // Download the blob
      const link = document.createElement("a");
      link.download = "button-88x31.gif";
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);

      downloadBtn.textContent = originalText;
    } catch (error) {
      console.error("Error generating GIF:", error);
      alert("Error generating GIF. Please try again.");
      downloadBtn.textContent = originalText;
    } finally {
      downloadBtn.disabled = false;
    }
  });
}

/**
 * Setup preset buttons
 */
function setupPresets(generator) {
  // Random preset
  const randomBtn = document.getElementById("preset-random");
  if (randomBtn) {
    randomBtn.addEventListener("click", () => {
      applyRandomPreset();
      generator.updatePreview();
    });
  }

  // Classic preset
  const classicBtn = document.getElementById("preset-classic");
  if (classicBtn) {
    classicBtn.addEventListener("click", () => {
      applyClassicPreset();
      generator.updatePreview();
    });
  }

  // Modern preset
  const modernBtn = document.getElementById("preset-modern");
  if (modernBtn) {
    modernBtn.addEventListener("click", () => {
      applyModernPreset();
      generator.updatePreview();
    });
  }
}

/**
 * Apply random preset
 */
function applyRandomPreset() {
  const randomColor = () =>
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0");

  // Random background
  const bgTypeEl = document.getElementById("bg-type");
  if (bgTypeEl) {
    bgTypeEl.value = ["solid", "gradient", "texture"][
      Math.floor(Math.random() * 3)
    ];
    bgTypeEl.dispatchEvent(new Event("change"));
  }

  setControlValue("bg-color", randomColor());
  setControlValue("gradient-color1", randomColor());
  setControlValue("gradient-color2", randomColor());
  setControlValue("gradient-angle", Math.floor(Math.random() * 360));

  // Random text colors
  setControlValue("text-color", randomColor());
  setControlValue("text-gradient-color1", randomColor());
  setControlValue("text-gradient-color2", randomColor());
  setControlValue("text2-color", randomColor());
  setControlValue("text2-gradient-color1", randomColor());
  setControlValue("text2-gradient-color2", randomColor());

  // Random border
  setControlValue("border-color", randomColor());
  setControlValue("border-width", Math.floor(Math.random() * 6));
}

/**
 * Apply classic 90s preset
 */
function applyClassicPreset() {
  setControlValue("bg-type", "gradient");
  setControlValue("gradient-color1", "#6e6e6eff");
  setControlValue("gradient-color2", "#979797");
  setControlValue("gradient-angle", 90);

  setControlValue("text-color-type", "solid");
  setControlValue("text-color", "#000000");
  setControlValue("text2-color-type", "solid");
  setControlValue("text2-color", "#000000");

  setControlValue("border-width", 2);
  setControlValue("border-color", "#000000");
  setControlValue("border-style", "outset");

  setControlValue("font-family", "VT323");
  setControlValue("font-family2", "VT323");

  document.getElementById("bg-type")?.dispatchEvent(new Event("change"));
}

/**
 * Apply modern preset
 */
function applyModernPreset() {
  setControlValue("bg-type", "gradient");
  setControlValue("gradient-color1", "#0a0a0a");
  setControlValue("gradient-color2", "#1a0a2e");
  setControlValue("gradient-angle", 135);

  setControlValue("text-color-type", "gradient");
  setControlValue("text-gradient-color1", "#00ffaa");
  setControlValue("text-gradient-color2", "#00ffff");
  setControlValue("text-gradient-angle", 90);

  setControlValue("text2-color-type", "gradient");
  setControlValue("text2-gradient-color1", "#ff00ff");
  setControlValue("text2-gradient-color2", "#ff6600");

  setControlValue("border-width", 1);
  setControlValue("border-color", "#00ffaa");
  setControlValue("border-style", "solid");

  setControlValue("font-family", "Roboto Mono");
  setControlValue("font-family2", "Roboto Mono");

  document.getElementById("bg-type")?.dispatchEvent(new Event("change"));
  document
    .getElementById("text-color-type")
    ?.dispatchEvent(new Event("change"));
  document
    .getElementById("text2-color-type")
    ?.dispatchEvent(new Event("change"));
}

/**
 * Helper to set control value
 */
function setControlValue(id, value) {
  const el = document.getElementById(id);
  if (el) {
    if (el.type === "checkbox") {
      el.checked = value;
    } else {
      el.value = value;
    }

    // Update value display if it exists
    const valueDisplay = document.getElementById(id + "-value");
    if (valueDisplay) {
      valueDisplay.textContent = value;
    }
  }
}

// Auto-initialize when imported
init();

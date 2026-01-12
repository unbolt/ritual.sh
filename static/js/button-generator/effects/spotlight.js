/**
 * EXAMPLE EFFECT
 *
 * This is a template for creating new effects.
 * Copy this file and modify it to create your own custom effects.
 *
 * This example creates a "spotlight" effect that highlights a circular area
 * and darkens the rest of the button.
 */

import { ButtonEffect } from "../effect-base.js";

/**
 * Spotlight Effect
 * Creates a moving circular spotlight that highlights different areas
 */
export class SpotlightEffect extends ButtonEffect {
  constructor() {
    super({
      // Unique ID for this effect (used in control IDs)
      id: "spotlight",

      // Display name shown in UI
      name: "Spotlight",

      // Effect type determines render order category
      // Options: 'background', 'border', 'text', 'text2', 'general'
      type: "general",

      // Category for organizing effects in UI
      category: "Visual Effects",

      // Render order within type (lower = earlier)
      // 1-9: backgrounds, 10-19: borders, 20-29: transforms,
      // 30-49: text, 50-79: overlays, 80-99: post-processing
      renderOrder: 60,
    });
  }

  /**
   * Define UI controls for this effect
   * These controls will be automatically bound to the generator
   */
  defineControls() {
    return [
      // Main enable/disable checkbox
      {
        id: "animate-spotlight",
        type: "checkbox",
        label: "Spotlight Effect",
        defaultValue: false,
        description: "Moving circular spotlight",
      },

      // Spotlight size control
      {
        id: "spotlight-size",
        type: "range",
        label: "Spotlight Size",
        defaultValue: 20,
        min: 10,
        max: 50,
        step: 1,
        showWhen: "animate-spotlight", // Only show when checkbox is enabled
        description: "Radius of the spotlight",
      },

      // Darkness of the vignette
      {
        id: "spotlight-darkness",
        type: "range",
        label: "Darkness",
        defaultValue: 1,
        min: 0,
        max: 1,
        step: 0.1,
        showWhen: "animate-spotlight",
        description: "How dark the non-spotlight area should be",
      },

      // Speed of movement
      {
        id: "spotlight-speed",
        type: "range",
        label: "Movement Speed",
        defaultValue: 1,
        min: 1,
        max: 3,
        step: 1,
        showWhen: "animate-spotlight",
        description: "Speed of spotlight movement",
      },
    ];
  }

  /**
   * Determine if this effect should be applied
   * @param {Object} controlValues - Current values of all controls
   * @returns {boolean}
   */
  isEnabled(controlValues) {
    return controlValues["animate-spotlight"] === true;
  }

  /**
   * Apply the effect to the canvas
   *
   * @param {CanvasRenderingContext2D} context - Canvas 2D rendering context
   * @param {Object} controlValues - Current values of all controls
   * @param {AnimationState|null} animState - Animation state (null for static render)
   * @param {Object} renderData - Render information: { width, height, centerX, centerY }
   */
  apply(context, controlValues, animState, renderData) {
    // Skip if no animation (spotlight needs movement)
    if (!animState) return;

    // Get control values
    const size = controlValues["spotlight-size"] || 20;
    const darkness = controlValues["spotlight-darkness"] || 0.5;
    const speed = controlValues["spotlight-speed"] || 1;

    // Calculate spotlight position
    // Move in a circular pattern using animation phase
    const phase = animState.getPhase(speed);
    const spotX = renderData.centerX + Math.cos(phase) * 20;
    const spotY = renderData.centerY + Math.sin(phase) * 10;

    // Create radial gradient for spotlight effect
    const gradient = context.createRadialGradient(
      spotX,
      spotY,
      0, // Inner circle (center of spotlight)
      spotX,
      spotY,
      size, // Outer circle (edge of spotlight)
    );

    // Center is transparent (spotlight is bright)
    gradient.addColorStop(0, `rgba(0, 0, 0, 0)`);
    // Edge fades to dark
    gradient.addColorStop(0.5, `rgba(0, 0, 0, ${darkness * 0.3})`);
    gradient.addColorStop(1, `rgba(0, 0, 0, ${darkness})`);

    // Apply the gradient as an overlay
    context.fillStyle = gradient;
    context.fillRect(0, 0, renderData.width, renderData.height);

    // Optional: Add a bright center dot
    context.fillStyle = "rgba(255, 255, 255, 0.3)";
    context.beginPath();
    context.arc(spotX, spotY, 2, 0, Math.PI * 2);
    context.fill();
  }

  /**
   * Optional: Add helper methods for your effect
   */
  calculateSpotlightPath(progress, width, height) {
    // Example helper method
    return {
      x: width * progress,
      y: height / 2,
    };
  }
}

/**
 * Registration function
 * This is called to add the effect to the generator
 *
 * @param {ButtonGenerator} generator - The button generator instance
 */
export function register(generator) {
  generator.registerEffect(new SpotlightEffect());
}

/**
 * USAGE:
 *
 * 1. Copy this file to a new name (e.g., my-effect.js)
 * 2. Modify the class name, id, and effect logic
 * 3. Import in main.js:
 *    import * as myEffect from './effects/my-effect.js';
 * 4. Register in setupApp():
 *    myEffect.register(generator);
 * 5. Add HTML controls with matching IDs
 */

/**
 * TIPS:
 *
 * - Use animState.progress for linear animations (0 to 1)
 * - Use animState.getPhase(speed) for periodic animations (0 to 2π)
 * - Use Math.sin/cos for smooth periodic motion
 * - Check if (!animState) at the start if your effect requires animation
 * - The context is automatically saved/restored, so feel free to transform
 * - Use renderData for canvas dimensions and center point
 * - Look at existing effects for more examples
 */

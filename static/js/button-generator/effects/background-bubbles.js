import { ButtonEffect } from "../effect-base.js";

/**
 * Bubbles rising background effect
 * Floating bubbles that rise with drift
 */
export class BubblesEffect extends ButtonEffect {
  constructor() {
    super({
      id: "bg-bubbles",
      name: "Bubbles",
      type: "general",
      category: "Background Animations",
      renderOrder: 55,
    });

    this.bubbles = [];
    this.initialized = false;
  }

  defineControls() {
    return [
      {
        id: "animate-bubbles",
        type: "checkbox",
        label: "Bubbles Effect",
        defaultValue: false,
      },
      {
        id: "bubble-count",
        type: "range",
        label: "Bubble Count",
        defaultValue: 15,
        min: 5,
        max: 40,
        step: 1,
        showWhen: "animate-bubbles",
        description: "Number of bubbles",
      },
      {
        id: "bubble-speed",
        type: "range",
        label: "Rise Speed",
        defaultValue: 1,
        min: 0.3,
        max: 3,
        step: 0.1,
        showWhen: "animate-bubbles",
        description: "Speed of rising bubbles",
      },
      {
        id: "bubble-drift",
        type: "range",
        label: "Drift Amount",
        defaultValue: 1,
        min: 0,
        max: 3,
        step: 0.1,
        showWhen: "animate-bubbles",
        description: "Side-to-side drift",
      },
      {
        id: "bubble-color",
        type: "color",
        label: "Bubble Color",
        defaultValue: "#4da6ff",
        showWhen: "animate-bubbles",
        description: "Color of bubbles",
      },
    ];
  }

  isEnabled(controlValues) {
    return controlValues["animate-bubbles"] === true;
  }

  apply(context, controlValues, animState, renderData) {
    if (!animState) return;

    const count = controlValues["bubble-count"] || 15;
    const speed = controlValues["bubble-speed"] || 1;
    const drift = controlValues["bubble-drift"] || 1;
    const bubbleColor = controlValues["bubble-color"] || "#4da6ff";

    // Initialize bubbles on first frame or count change
    if (!this.initialized || this.bubbles.length !== count) {
      this.bubbles = [];
      for (let i = 0; i < count; i++) {
        this.bubbles.push({
          x: Math.random() * renderData.width,
          startY: Math.random(), // Store as 0-1 ratio instead of pixel value
          size: 3 + Math.random() * 8,
          speedMultiplier: 0.5 + Math.random() * 1,
          driftPhase: Math.random() * Math.PI * 2,
          driftSpeed: 0.5 + Math.random() * 1,
        });
      }
      this.initialized = true;
    }

    // Parse color for gradient
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : { r: 77, g: 166, b: 255 };
    };

    const rgb = hexToRgb(bubbleColor);

    // Draw bubbles
    this.bubbles.forEach((bubble) => {
      // Calculate Y position based on animation progress for perfect looping
      // Each bubble has a different starting offset and speed
      const bubbleProgress =
        (animState.progress * speed * bubble.speedMultiplier + bubble.startY) %
        1;

      // Convert to pixel position (bubbles rise from bottom to top)
      const bubbleY =
        renderData.height + bubble.size - bubbleProgress * (renderData.height + bubble.size * 2);

      // Drift side to side
      const driftOffset =
        Math.sin(
          animState.getPhase(bubble.driftSpeed * 0.5) + bubble.driftPhase
        ) *
        drift *
        2;
      const currentX = bubble.x + driftOffset;

      // Draw bubble with gradient for 3D effect
      const gradient = context.createRadialGradient(
        currentX - bubble.size * 0.3,
        bubbleY - bubble.size * 0.3,
        0,
        currentX,
        bubbleY,
        bubble.size
      );

      gradient.addColorStop(
        0,
        `rgba(${rgb.r + 40}, ${rgb.g + 40}, ${rgb.b + 40}, 0.6)`
      );
      gradient.addColorStop(
        0.6,
        `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)`
      );
      gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`);

      context.fillStyle = gradient;
      context.beginPath();
      context.arc(currentX, bubbleY, bubble.size, 0, Math.PI * 2);
      context.fill();

      // Add highlight
      context.fillStyle = "rgba(255, 255, 255, 0.4)";
      context.beginPath();
      context.arc(
        currentX - bubble.size * 0.3,
        bubbleY - bubble.size * 0.3,
        bubble.size * 0.3,
        0,
        Math.PI * 2
      );
      context.fill();
    });
  }
}

export function register(generator) {
  generator.registerEffect(new BubblesEffect());
}

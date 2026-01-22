import { ButtonEffect } from "../effect-base.js";

/**
 * Sparkle/Twinkle background effect
 * Random twinkling stars overlay - classic 88x31 button aesthetic
 */
export class SparkleEffect extends ButtonEffect {
  constructor() {
    super({
      id: "bg-sparkle",
      name: "Sparkle",
      type: "background-animation",
      category: "Background Animations",
      renderOrder: 15,
    });

    this.sparkles = [];
    this.initialized = false;
  }

  defineControls() {
    return [
      {
        id: "animate-sparkle",
        type: "checkbox",
        label: "Sparkle Effect",
        defaultValue: false,
      },
      {
        id: "sparkle-density",
        type: "range",
        label: "Sparkle Count",
        defaultValue: 20,
        min: 5,
        max: 50,
        step: 1,
        showWhen: "animate-sparkle",
        description: "Number of sparkles",
      },
      {
        id: "sparkle-size",
        type: "range",
        label: "Max Size",
        defaultValue: 3,
        min: 1,
        max: 5,
        step: 0.5,
        showWhen: "animate-sparkle",
        description: "Maximum sparkle size",
      },
      {
        id: "sparkle-speed",
        type: "range",
        label: "Twinkle Speed",
        defaultValue: 1.5,
        min: 0.5,
        max: 3,
        step: 0.1,
        showWhen: "animate-sparkle",
        description: "How fast sparkles twinkle",
      },
      {
        id: "sparkle-color",
        type: "color",
        label: "Sparkle Color",
        defaultValue: "#ffffff",
        showWhen: "animate-sparkle",
        description: "Color of sparkles",
      },
    ];
  }

  isEnabled(controlValues) {
    return controlValues["animate-sparkle"] === true;
  }

  apply(context, controlValues, animState, renderData) {
    if (!animState) return;

    const density = controlValues["sparkle-density"] || 20;
    const maxSize = controlValues["sparkle-size"] || 3;
    const speed = controlValues["sparkle-speed"] || 1.5;
    const sparkleColor = controlValues["sparkle-color"] || "#ffffff";

    // Initialize sparkles on first frame or density change
    if (!this.initialized || this.sparkles.length !== density) {
      this.sparkles = [];
      for (let i = 0; i < density; i++) {
        this.sparkles.push({
          x: Math.random() * renderData.width,
          y: Math.random() * renderData.height,
          phase: Math.random() * Math.PI * 2,
          size: 1 + Math.random() * (maxSize - 1),
          speedMult: 0.7 + Math.random() * 0.6,
        });
      }
      this.initialized = true;
    }

    // Parse color
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : { r: 255, g: 255, b: 255 };
    };

    const rgb = hexToRgb(sparkleColor);

    // Draw sparkles
    this.sparkles.forEach((sparkle) => {
      // Calculate twinkle phase - each sparkle has its own timing
      const phase = animState.getPhase(speed * sparkle.speedMult) + sparkle.phase;

      // Use sin² for smooth fade in/out, with some sparkles fully off
      const rawAlpha = Math.sin(phase);
      const alpha = rawAlpha > 0 ? rawAlpha * rawAlpha : 0;

      if (alpha < 0.05) return; // Skip nearly invisible sparkles

      const size = sparkle.size * (0.5 + alpha * 0.5);

      // Draw 4-point star shape
      context.save();
      context.translate(sparkle.x, sparkle.y);
      context.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;

      // Draw diamond/star shape
      context.beginPath();

      // Horizontal points
      context.moveTo(-size, 0);
      context.lineTo(0, -size * 0.3);
      context.lineTo(size, 0);
      context.lineTo(0, size * 0.3);
      context.closePath();
      context.fill();

      // Vertical points
      context.beginPath();
      context.moveTo(0, -size);
      context.lineTo(size * 0.3, 0);
      context.lineTo(0, size);
      context.lineTo(-size * 0.3, 0);
      context.closePath();
      context.fill();

      // Center glow
      const gradient = context.createRadialGradient(0, 0, 0, 0, 0, size * 0.5);
      gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`);
      gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(0, 0, size * 0.5, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });
  }
}

export function register(generator) {
  generator.registerEffect(new SparkleEffect());
}

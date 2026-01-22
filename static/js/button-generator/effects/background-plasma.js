import { ButtonEffect } from "../effect-base.js";

/**
 * Plasma background effect
 * Classic demoscene sine wave plasma - iconic 90s visual
 */
export class PlasmaEffect extends ButtonEffect {
  constructor() {
    super({
      id: "bg-plasma",
      name: "Plasma",
      type: "background-animation",
      category: "Background Animations",
      renderOrder: 5,
    });
  }

  defineControls() {
    return [
      {
        id: "animate-plasma",
        type: "checkbox",
        label: "Plasma Effect",
        defaultValue: false,
      },
      {
        id: "plasma-scale",
        type: "range",
        label: "Pattern Scale",
        defaultValue: 1.5,
        min: 0.5,
        max: 3,
        step: 0.1,
        showWhen: "animate-plasma",
        description: "Size of plasma patterns",
      },
      {
        id: "plasma-speed",
        type: "range",
        label: "Animation Speed",
        defaultValue: 1,
        min: 0.5,
        max: 3,
        step: 0.1,
        showWhen: "animate-plasma",
        description: "Speed of plasma movement",
      },
      {
        id: "plasma-color-scheme",
        type: "select",
        label: "Color Scheme",
        defaultValue: "classic",
        options: [
          { value: "classic", label: "Classic (Purple/Cyan)" },
          { value: "fire", label: "Fire (Red/Orange)" },
          { value: "ocean", label: "Ocean (Blue/Green)" },
          { value: "psychedelic", label: "Psychedelic (Rainbow)" },
          { value: "matrix", label: "Matrix (Green)" },
        ],
        showWhen: "animate-plasma",
        description: "Color palette for plasma",
      },
    ];
  }

  isEnabled(controlValues) {
    return controlValues["animate-plasma"] === true;
  }

  /**
   * Get color based on scheme and value
   */
  getColor(value, scheme) {
    // Normalize value from -4..4 to 0..1
    const normalized = (value + 4) / 8;

    switch (scheme) {
      case "fire": {
        // Black -> Red -> Orange -> Yellow -> White
        const r = Math.min(255, normalized * 400);
        const g = Math.max(0, Math.min(255, (normalized - 0.3) * 400));
        const b = Math.max(0, Math.min(255, (normalized - 0.7) * 400));
        return { r, g, b };
      }

      case "ocean": {
        // Deep blue -> Cyan -> Light green
        const r = Math.max(0, Math.min(100, normalized * 100));
        const g = Math.min(255, normalized * 300);
        const b = Math.min(255, 100 + normalized * 155);
        return { r, g, b };
      }

      case "psychedelic": {
        // Full rainbow cycling
        const hue = normalized * 360;
        return this.hslToRgb(hue, 100, 50);
      }

      case "matrix": {
        // Black -> Dark green -> Bright green -> White
        const intensity = normalized;
        const r = Math.max(0, Math.min(255, (intensity - 0.8) * 1000));
        const g = Math.min(255, intensity * 300);
        const b = Math.max(0, Math.min(255, (intensity - 0.9) * 500));
        return { r, g, b };
      }

      case "classic":
      default: {
        // Classic demoscene: purple/magenta/cyan
        const r = Math.min(255, 128 + Math.sin(normalized * Math.PI * 2) * 127);
        const g = Math.min(255, 64 + Math.sin(normalized * Math.PI * 2 + 2) * 64);
        const b = Math.min(255, 128 + Math.sin(normalized * Math.PI * 2 + 4) * 127);
        return { r, g, b };
      }
    }
  }

  /**
   * Convert HSL to RGB
   */
  hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r, g, b;
    if (h < 60) {
      r = c; g = x; b = 0;
    } else if (h < 120) {
      r = x; g = c; b = 0;
    } else if (h < 180) {
      r = 0; g = c; b = x;
    } else if (h < 240) {
      r = 0; g = x; b = c;
    } else if (h < 300) {
      r = x; g = 0; b = c;
    } else {
      r = c; g = 0; b = x;
    }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
    };
  }

  apply(context, controlValues, animState, renderData) {
    if (!animState) return;

    const scale = controlValues["plasma-scale"] || 1.5;
    const speed = controlValues["plasma-speed"] || 1;
    const scheme = controlValues["plasma-color-scheme"] || "classic";

    const { width, height } = renderData;

    // Perfect looping via ping-pong: animate forward first half, reverse second half
    // progress goes 0->1, we convert to 0->1->0 (triangle wave)
    const progress = animState.progress;
    let pingPong;
    if (progress < 0.5) {
      // First half: 0->1
      pingPong = progress * 2;
    } else {
      // Second half: 1->0
      pingPong = (1 - progress) * 2;
    }

    // Scale the time value for visible animation
    const time = pingPong * Math.PI * 2 * speed;

    // Get image data for pixel manipulation
    const imageData = context.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Scale factor for the plasma pattern (smaller = larger patterns)
    const scaleFactor = 10 / scale;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Classic plasma formula
        const value =
          Math.sin(x / scaleFactor + time) +
          Math.sin(y / scaleFactor + time * 1.3) +
          Math.sin((x + y) / scaleFactor + time * 0.7) +
          Math.sin(Math.sqrt(x * x + y * y) / scaleFactor + time);

        const color = this.getColor(value, scheme);

        const idx = (y * width + x) * 4;
        data[idx] = color.r;
        data[idx + 1] = color.g;
        data[idx + 2] = color.b;
        data[idx + 3] = 255;
      }
    }

    context.putImageData(imageData, 0, 0);
  }
}

export function register(generator) {
  generator.registerEffect(new PlasmaEffect());
}

import { ButtonEffect } from "../effect-base.js";

/**
 * Aurora/Plasma background effect
 * Flowing organic color patterns using layered gradients
 */
export class AuroraEffect extends ButtonEffect {
  constructor() {
    super({
      id: "bg-aurora",
      name: "Aurora",
      type: "general",
      category: "Background Animations",
      renderOrder: 55,
    });
  }

  defineControls() {
    return [
      {
        id: "animate-aurora",
        type: "checkbox",
        label: "Aurora Effect",
        defaultValue: false,
      },
      {
        id: "aurora-speed",
        type: "range",
        label: "Flow Speed",
        defaultValue: 1,
        min: 1,
        max: 3,
        step: 1,
        showWhen: "animate-aurora",
        description: "Speed of flowing colors",
      },
      {
        id: "aurora-intensity",
        type: "range",
        label: "Intensity",
        defaultValue: 0.6,
        min: 0.2,
        max: 1,
        step: 0.1,
        showWhen: "animate-aurora",
        description: "Brightness and opacity",
      },
      {
        id: "aurora-complexity",
        type: "range",
        label: "Complexity",
        defaultValue: 3,
        min: 2,
        max: 6,
        step: 1,
        showWhen: "animate-aurora",
        description: "Number of wave layers",
      },
      {
        id: "aurora-color-scheme",
        type: "select",
        label: "Color Scheme",
        defaultValue: "northern",
        options: [
          { value: "northern", label: "Northern Lights" },
          { value: "purple", label: "Purple Dream" },
          { value: "fire", label: "Fire" },
          { value: "ocean", label: "Ocean" },
          { value: "rainbow", label: "Rainbow" },
        ],
        showWhen: "animate-aurora",
        description: "Color palette",
      },
    ];
  }

  isEnabled(controlValues) {
    return controlValues["animate-aurora"] === true;
  }

  getColorScheme(scheme, hue) {
    switch (scheme) {
      case "northern":
        return [
          { h: 120, s: 70, l: 50 }, // Green
          { h: 160, s: 70, l: 50 }, // Teal
          { h: 200, s: 70, l: 50 }, // Blue
        ];
      case "purple":
        return [
          { h: 270, s: 70, l: 50 }, // Purple
          { h: 300, s: 70, l: 50 }, // Magenta
          { h: 330, s: 70, l: 50 }, // Pink
        ];
      case "fire":
        return [
          { h: 0, s: 80, l: 50 }, // Red
          { h: 30, s: 80, l: 50 }, // Orange
          { h: 50, s: 80, l: 50 }, // Yellow-Orange
        ];
      case "ocean":
        return [
          { h: 180, s: 70, l: 50 }, // Cyan
          { h: 200, s: 70, l: 50 }, // Light Blue
          { h: 220, s: 70, l: 50 }, // Blue
        ];
      case "rainbow":
        return [
          { h: (hue + 0) % 360, s: 70, l: 50 },
          { h: (hue + 120) % 360, s: 70, l: 50 },
          { h: (hue + 240) % 360, s: 70, l: 50 },
        ];
      default:
        return [
          { h: 120, s: 70, l: 50 },
          { h: 180, s: 70, l: 50 },
          { h: 240, s: 70, l: 50 },
        ];
    }
  }

  apply(context, controlValues, animState, renderData) {
    if (!animState) return;

    const speed = controlValues["aurora-speed"] || 1;
    const intensity = controlValues["aurora-intensity"] || 0.6;
    const complexity = controlValues["aurora-complexity"] || 3;
    const colorScheme = controlValues["aurora-color-scheme"] || "northern";

    const time = animState.getPhase(speed);

    // Create flowing hue shift that loops properly (only used for rainbow scheme)
    // Convert phase (0 to 2π) to hue degrees (0 to 360)
    const hueShift = (time / (Math.PI * 2)) * 360;
    const colors = this.getColorScheme(colorScheme, hueShift);

    // Draw multiple overlapping gradients to create aurora effect
    context.globalCompositeOperation = "screen"; // Blend mode for aurora effect

    for (let i = 0; i < complexity; i++) {
      const phase = time + i * ((Math.PI * 2) / complexity);

      // Calculate wave positions
      const wave1X =
        renderData.centerX + Math.sin(phase) * renderData.width * 0.5;
      const wave1Y =
        renderData.centerY + Math.cos(phase * 1.3) * renderData.height * 0.5;

      // Create radial gradient
      const gradient = context.createRadialGradient(
        wave1X,
        wave1Y,
        0,
        wave1X,
        wave1Y,
        renderData.width * 0.8,
      );

      // Pick color based on wave index
      const colorIdx = i % colors.length;
      const color = colors[colorIdx];

      const baseOpacity = intensity * 0.3;

      // Rainbow scheme already has hueShift applied in getColorScheme
      // Other schemes use their fixed colors
      gradient.addColorStop(
        0,
        `hsla(${color.h}, ${color.s}%, ${color.l}%, ${baseOpacity})`,
      );
      gradient.addColorStop(
        0.5,
        `hsla(${color.h}, ${color.s}%, ${color.l}%, ${baseOpacity * 0.5})`,
      );
      gradient.addColorStop(
        1,
        `hsla(${color.h}, ${color.s}%, ${color.l}%, 0)`,
      );

      context.fillStyle = gradient;
      context.fillRect(0, 0, renderData.width, renderData.height);
    }

    // Reset composite operation
    context.globalCompositeOperation = "source-over";
  }
}

export function register(generator) {
  generator.registerEffect(new AuroraEffect());
}

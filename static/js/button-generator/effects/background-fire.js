import { ButtonEffect } from "../effect-base.js";

/**
 * Fire background effect
 * Animated flames rising from bottom using particles
 */
export class FireEffect extends ButtonEffect {
  constructor() {
    super({
      id: "bg-fire",
      name: "Fire",
      type: "general",
      category: "Background Animations",
      renderOrder: 55,
    });

    this.particles = [];
    this.initialized = false;
  }

  defineControls() {
    return [
      {
        id: "animate-fire",
        type: "checkbox",
        label: "Fire Effect",
        defaultValue: false,
      },
      {
        id: "fire-intensity",
        type: "range",
        label: "Intensity",
        defaultValue: 50,
        min: 20,
        max: 100,
        step: 5,
        showWhen: "animate-fire",
        description: "Number of flame particles",
      },
      {
        id: "fire-height",
        type: "range",
        label: "Flame Height",
        defaultValue: 0.6,
        min: 0.3,
        max: 1,
        step: 0.1,
        showWhen: "animate-fire",
        description: "How high flames reach",
      },
      {
        id: "fire-speed",
        type: "range",
        label: "Speed",
        defaultValue: 1,
        min: 0.3,
        max: 3,
        step: 0.1,
        showWhen: "animate-fire",
        description: "Speed of rising flames",
      },
      {
        id: "fire-color-scheme",
        type: "select",
        label: "Color Scheme",
        defaultValue: "normal",
        options: [
          { value: "normal", label: "Normal Fire" },
          { value: "blue", label: "Blue Flame" },
          { value: "green", label: "Green Flame" },
          { value: "purple", label: "Purple Flame" },
          { value: "white", label: "White Hot" },
        ],
        showWhen: "animate-fire",
        description: "Flame color",
      },
    ];
  }

  isEnabled(controlValues) {
    return controlValues["animate-fire"] === true;
  }

  getFireColors(scheme) {
    switch (scheme) {
      case "normal":
        return [
          { r: 255, g: 60, b: 0 }, // Red-orange
          { r: 255, g: 140, b: 0 }, // Orange
          { r: 255, g: 200, b: 0 }, // Yellow
        ];
      case "blue":
        return [
          { r: 0, g: 100, b: 255 }, // Blue
          { r: 100, g: 180, b: 255 }, // Light blue
          { r: 200, g: 230, b: 255 }, // Very light blue
        ];
      case "green":
        return [
          { r: 0, g: 200, b: 50 }, // Green
          { r: 100, g: 255, b: 100 }, // Light green
          { r: 200, g: 255, b: 150 }, // Very light green
        ];
      case "purple":
        return [
          { r: 150, g: 0, b: 255 }, // Purple
          { r: 200, g: 100, b: 255 }, // Light purple
          { r: 230, g: 180, b: 255 }, // Very light purple
        ];
      case "white":
        return [
          { r: 255, g: 200, b: 150 }, // Warm white
          { r: 255, g: 240, b: 200 }, // Light white
          { r: 255, g: 255, b: 255 }, // Pure white
        ];
      default:
        return [
          { r: 255, g: 60, b: 0 },
          { r: 255, g: 140, b: 0 },
          { r: 255, g: 200, b: 0 },
        ];
    }
  }

  apply(context, controlValues, animState, renderData) {
    if (!animState) return;

    const intensity = controlValues["fire-intensity"] || 50;
    const height = controlValues["fire-height"] || 0.6;
    const speed = controlValues["fire-speed"] || 1;
    const colorScheme = controlValues["fire-color-scheme"] || "normal";

    const colors = this.getFireColors(colorScheme);
    const maxHeight = renderData.height * height;

    // Spawn new particles at the bottom
    for (let i = 0; i < intensity / 10; i++) {
      this.particles.push({
        x: Math.random() * renderData.width,
        y: renderData.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -(2 + Math.random() * 3) * speed,
        size: 2 + Math.random() * 6,
        life: 1.0,
        colorIndex: Math.random(),
      });
    }

    // Update and draw particles
    this.particles = this.particles.filter((particle) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Add some turbulence
      particle.vx += (Math.random() - 0.5) * 0.2;
      particle.vy *= 0.98; // Slow down as they rise

      // Fade out based on height and time
      const heightRatio =
        (renderData.height - particle.y) / renderData.height;
      particle.life -= 0.015;

      if (particle.life > 0 && particle.y > renderData.height - maxHeight) {
        // Choose color based on life (hotter at bottom, cooler at top)
        const colorProgress = 1 - particle.life;
        const colorIdx = Math.floor(colorProgress * (colors.length - 1));
        const colorBlend = (colorProgress * (colors.length - 1)) % 1;

        const c1 = colors[Math.min(colorIdx, colors.length - 1)];
        const c2 = colors[Math.min(colorIdx + 1, colors.length - 1)];

        const r = Math.floor(c1.r + (c2.r - c1.r) * colorBlend);
        const g = Math.floor(c1.g + (c2.g - c1.g) * colorBlend);
        const b = Math.floor(c1.b + (c2.b - c1.b) * colorBlend);

        // Draw particle with gradient
        const gradient = context.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size
        );

        gradient.addColorStop(
          0,
          `rgba(${r}, ${g}, ${b}, ${particle.life * 0.8})`
        );
        gradient.addColorStop(
          0.5,
          `rgba(${r}, ${g}, ${b}, ${particle.life * 0.5})`
        );
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        context.fillStyle = gradient;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();

        return true;
      }
      return false;
    });

    // Limit particle count
    if (this.particles.length > intensity * 5) {
      this.particles = this.particles.slice(-intensity * 5);
    }
  }
}

export function register(generator) {
  generator.registerEffect(new FireEffect());
}

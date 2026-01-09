import { ButtonEffect } from "../effect-base.js";

/**
 * Starfield background effect
 * Twinkling stars with optional shooting stars
 */
export class StarfieldEffect extends ButtonEffect {
  constructor() {
    super({
      id: "bg-starfield",
      name: "Starfield",
      type: "general",
      category: "Background Animations",
      renderOrder: 55,
    });

    this.stars = [];
    this.initialized = false;
  }

  defineControls() {
    return [
      {
        id: "animate-starfield",
        type: "checkbox",
        label: "Starfield Effect",
        defaultValue: false,
      },
      {
        id: "star-density",
        type: "range",
        label: "Star Density",
        defaultValue: 30,
        min: 10,
        max: 80,
        step: 5,
        showWhen: "animate-starfield",
        description: "Number of stars",
      },
      {
        id: "star-twinkle-speed",
        type: "range",
        label: "Twinkle Speed",
        defaultValue: 1,
        min: 0.1,
        max: 3,
        step: 0.1,
        showWhen: "animate-starfield",
        description: "Speed of twinkling",
      },
      {
        id: "star-shooting-enabled",
        type: "checkbox",
        label: "Shooting Stars",
        defaultValue: true,
        showWhen: "animate-starfield",
        description: "Enable shooting stars",
      },
      {
        id: "star-color",
        type: "color",
        label: "Star Color",
        defaultValue: "#ffffff",
        showWhen: "animate-starfield",
        description: "Color of stars",
      },
    ];
  }

  isEnabled(controlValues) {
    return controlValues["animate-starfield"] === true;
  }

  apply(context, controlValues, animState, renderData) {
    if (!animState) return;

    const density = controlValues["star-density"] || 30;
    const twinkleSpeed = controlValues["star-twinkle-speed"] || 1;
    const shootingEnabled = controlValues["star-shooting-enabled"] !== false;
    const starColor = controlValues["star-color"] || "#ffffff";

    // Initialize stars with deterministic positions (seed-based)
    if (!this.initialized || this.stars.length !== density) {
      this.stars = [];
      for (let i = 0; i < density; i++) {
        // Use density as part of the seed so pattern changes with density
        // Use multiple large prime seeds for better distribution
        const densitySeed = density * 97531; // Density affects all stars
        const seed1 = (i * 2654435761) + densitySeed;
        const seed2 = (i * 2246822519) + 3141592653 + densitySeed;
        const seed3 = (i * 3266489917) + 1618033988 + densitySeed;
        const seed4 = (i * 374761393) + 2718281828 + densitySeed;
        const seed5 = (i * 1103515245) + 12345 + densitySeed;

        // Hash-like function for better pseudo-random distribution
        const hash = (s) => {
          const x = Math.sin(s * 0.0001) * 10000;
          return x - Math.floor(x);
        };

        this.stars.push({
          x: hash(seed1) * renderData.width,
          y: hash(seed2) * renderData.height,
          size: 0.5 + hash(seed3) * 1.5,
          twinkleOffset: hash(seed4) * Math.PI * 2,
          twinkleSpeed: 0.5 + hash(seed5) * 1.5,
        });
      }
      this.initialized = true;
    }

    // Draw twinkling stars
    this.stars.forEach((star) => {
      const twinkle =
        Math.sin(
          animState.getPhase(twinkleSpeed * star.twinkleSpeed) +
            star.twinkleOffset,
        ) *
          0.5 +
        0.5;
      const opacity = 0.3 + twinkle * 0.7;

      context.fillStyle = starColor;
      context.globalAlpha = opacity;
      context.beginPath();
      context.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      context.fill();
      context.globalAlpha = 1.0;
    });

    // Shooting stars - deterministic based on frame number
    if (shootingEnabled) {
      // Define shooting star spawn schedule (deterministic)
      const shootingStarSpawns = [
        { startFrame: 5, seed: 12345 },
        { startFrame: 18, seed: 67890 },
        { startFrame: 31, seed: 24680 },
      ];

      shootingStarSpawns.forEach((spawn) => {
        const framesSinceSpawn = animState.frame - spawn.startFrame;
        const duration = 25; // Frames the shooting star is visible

        if (framesSinceSpawn >= 0 && framesSinceSpawn < duration) {
          // Calculate deterministic properties from seed
          const hash = (s) => {
            const x = Math.sin(s * 0.0001) * 10000;
            return x - Math.floor(x);
          };

          const startX = hash(spawn.seed * 1) * renderData.width;
          const startY = -10;
          const vx = (hash(spawn.seed * 2) - 0.5) * 2;
          const vy = 3 + hash(spawn.seed * 3) * 2;

          // Calculate position based on frames elapsed
          const x = startX + vx * framesSinceSpawn;
          const y = startY + vy * framesSinceSpawn;
          const life = 1.0 - framesSinceSpawn / duration;

          if (life > 0) {
            // Draw shooting star trail
            const gradient = context.createLinearGradient(
              x,
              y,
              x - vx * 5,
              y - vy * 5,
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${life * 0.8})`);
            gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

            context.strokeStyle = gradient;
            context.lineWidth = 2;
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x - vx * 5, y - vy * 5);
            context.stroke();
          }
        }
      });
    }
  }
}

export function register(generator) {
  generator.registerEffect(new StarfieldEffect());
}

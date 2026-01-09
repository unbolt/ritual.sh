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
    this.shootingStars = [];
    this.initialized = false;
  }

  defineControls() {
    return [
      {
        id: "animate-starfield",
        type: "checkbox",
        label: "Starfield Effect",
        description:
          "This  might look a bit different when exported, work in  progress!",
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

    // Initialize stars on first frame or density change
    if (!this.initialized || this.stars.length !== density) {
      this.stars = [];
      for (let i = 0; i < density; i++) {
        this.stars.push({
          x: Math.random() * renderData.width,
          y: Math.random() * renderData.height,
          size: 0.5 + Math.random() * 1.5,
          twinkleOffset: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.5 + Math.random() * 1.5,
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

    // Shooting stars
    if (shootingEnabled) {
      // Randomly spawn shooting stars
      if (Math.random() < 0.02 && this.shootingStars.length < 3) {
        this.shootingStars.push({
          x: Math.random() * renderData.width,
          y: -10,
          vx: (Math.random() - 0.5) * 2,
          vy: 3 + Math.random() * 2,
          life: 1.0,
        });
      }

      // Update and draw shooting stars
      this.shootingStars = this.shootingStars.filter((star) => {
        star.x += star.vx;
        star.y += star.vy;
        star.life -= 0.02;

        if (star.life > 0) {
          // Draw shooting star trail
          const gradient = context.createLinearGradient(
            star.x,
            star.y,
            star.x - star.vx * 5,
            star.y - star.vy * 5,
          );
          gradient.addColorStop(0, `rgba(255, 255, 255, ${star.life * 0.8})`);
          gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

          context.strokeStyle = gradient;
          context.lineWidth = 2;
          context.beginPath();
          context.moveTo(star.x, star.y);
          context.lineTo(star.x - star.vx * 5, star.y - star.vy * 5);
          context.stroke();

          return true;
        }
        return false;
      });
    }
  }
}

export function register(generator) {
  generator.registerEffect(new StarfieldEffect());
}

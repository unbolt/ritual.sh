import { ButtonEffect } from '../effect-base.js';

/**
 * Raining background effect
 * Animated raindrops falling down the button
 */
export class RainBackgroundEffect extends ButtonEffect {
  constructor() {
    super({
      id: 'bg-rain',
      name: 'Rain Effect',
      type: 'general',
      category: 'Background Animations',
      renderOrder: 55 // After background, before other effects
    });

    // Initialize raindrop positions (persistent across frames)
    this.raindrops = [];
    this.initialized = false;
  }

  defineControls() {
    return [
      {
        id: 'animate-rain',
        type: 'checkbox',
        label: 'Rain Effect',
        defaultValue: false
      },
      {
        id: 'rain-density',
        type: 'range',
        label: 'Rain Density',
        defaultValue: 15,
        min: 5,
        max: 30,
        step: 1,
        showWhen: 'animate-rain',
        description: 'Number of raindrops'
      },
      {
        id: 'rain-speed',
        type: 'range',
        label: 'Rain Speed',
        defaultValue: 2,
        min: 1,
        max: 3,
        step: 1,
        showWhen: 'animate-rain',
        description: 'Speed of falling rain'
      },
      {
        id: 'rain-color',
        type: 'color',
        label: 'Rain Color',
        defaultValue: '#6ba3ff',
        showWhen: 'animate-rain',
        description: 'Color of raindrops'
      }
    ];
  }

  isEnabled(controlValues) {
    return controlValues['animate-rain'] === true;
  }

  apply(context, controlValues, animState, renderData) {
    if (!animState) return;

    const density = controlValues['rain-density'] || 15;
    const speed = controlValues['rain-speed'] || 1.5;
    const color = controlValues['rain-color'] || '#6ba3ff';

    // Initialize raindrop base properties (seed values for deterministic animation)
    if (!this.initialized || this.raindrops.length !== density) {
      this.raindrops = [];
      for (let i = 0; i < density; i++) {
        // Use multiple large prime seeds for better distribution
        const seed1 = i * 2654435761; // Large prime multiplier
        const seed2 = i * 2246822519 + 3141592653;
        const seed3 = i * 3266489917 + 1618033988;
        const seed4 = i * 374761393 + 2718281828;

        // Hash-like function for better pseudo-random distribution
        const hash = (s) => {
          const x = Math.sin(s * 0.0001) * 10000;
          return x - Math.floor(x);
        };

        this.raindrops.push({
          xOffset: hash(seed1), // 0 to 1
          startY: hash(seed2), // 0 to 1 (initial Y position within loop)
          length: 2 + hash(seed3) * 4,
          speedMultiplier: 0.8 + hash(seed4) * 0.4
        });
      }
      this.initialized = true;
    }

    // Draw raindrops
    context.strokeStyle = color;
    context.lineWidth = 1;
    context.lineCap = 'round';

    this.raindrops.forEach(drop => {
      // Calculate position based on current frame for perfect looping
      const totalDistance = renderData.height + drop.length * 2;

      // Progress through the animation (0 to 1)
      const progress = animState.progress; // 0 at frame 0, ~0.975 at frame 39

      // All drops complete the same number of cycles (based on speed)
      // startY provides the offset for varied starting positions
      // Round speed to nearest 0.5 to ensure clean cycles
      const cycles = Math.round(speed * 2) / 2; // e.g., 1.5 -> 1.5, 1.7 -> 1.5, 2.3 -> 2.5
      const cycleProgress = (progress * cycles + drop.startY) % 1.0;
      const y = cycleProgress * totalDistance - drop.length;

      // X position remains constant throughout the loop
      const x = drop.xOffset * renderData.width;

      // Vary opacity slightly for depth effect (using speedMultiplier for variation)
      const opacity = 0.4 + drop.speedMultiplier * 0.3; // 0.64 to 0.76

      // Draw raindrop
      context.globalAlpha = opacity;
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x, y + drop.length);
      context.stroke();
      context.globalAlpha = 1.0;
    });
  }
}

// Auto-register effect
export function register(generator) {
  generator.registerEffect(new RainBackgroundEffect());
}

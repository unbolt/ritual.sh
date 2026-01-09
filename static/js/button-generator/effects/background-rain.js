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
        defaultValue: 1.5,
        min: 0.5,
        max: 3,
        step: 0.1,
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

    // Initialize raindrops on first frame
    if (!this.initialized || this.raindrops.length !== density) {
      this.raindrops = [];
      for (let i = 0; i < density; i++) {
        this.raindrops.push({
          x: Math.random() * renderData.width,
          y: Math.random() * renderData.height,
          length: 2 + Math.random() * 4,
          speedMultiplier: 0.8 + Math.random() * 0.4
        });
      }
      this.initialized = true;
    }

    // Draw raindrops
    context.strokeStyle = color;
    context.lineWidth = 1;
    context.lineCap = 'round';

    this.raindrops.forEach(drop => {
      // Update position
      drop.y += speed * drop.speedMultiplier;

      // Reset to top when reaching bottom
      if (drop.y > renderData.height + drop.length) {
        drop.y = -drop.length;
        drop.x = Math.random() * renderData.width;
      }

      // Draw raindrop
      context.globalAlpha = 0.6;
      context.beginPath();
      context.moveTo(drop.x, drop.y);
      context.lineTo(drop.x, drop.y + drop.length);
      context.stroke();
      context.globalAlpha = 1.0;
    });
  }
}

// Auto-register effect
export function register(generator) {
  generator.registerEffect(new RainBackgroundEffect());
}

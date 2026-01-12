import { ButtonEffect } from '../effect-base.js';

/**
 * Noise/Static effect
 * Adds random pixel noise for a static/interference look
 */
export class NoiseEffect extends ButtonEffect {
  constructor() {
    super({
      id: 'noise',
      name: 'Noise',
      type: 'general',
      category: 'Visual Effects',
      renderOrder: 90
    });
  }

  defineControls() {
    return [
      {
        id: 'animate-noise',
        type: 'checkbox',
        label: 'Noise Effect',
        defaultValue: false,
        description: 'Random static/interference'
      },
      {
        id: 'noise-intensity',
        type: 'range',
        label: 'Noise Intensity',
        defaultValue: 0.1,
        min: 0.01,
        max: 0.5,
        step: 0.01,
        showWhen: 'animate-noise',
        description: 'Amount of noise'
      }
    ];
  }

  isEnabled(controlValues) {
    return controlValues['animate-noise'] === true;
  }

  apply(context, controlValues, animState, renderData) {
    if (!animState) return;

    const intensity = controlValues['noise-intensity'] || 0.1;
    const imageData = context.getImageData(0, 0, renderData.width, renderData.height);

    for (let i = 0; i < imageData.data.length; i += 4) {
      // Random noise value
      const noise = (Math.random() - 0.5) * 255 * intensity;

      imageData.data[i] = Math.max(0, Math.min(255, imageData.data[i] + noise));
      imageData.data[i + 1] = Math.max(0, Math.min(255, imageData.data[i + 1] + noise));
      imageData.data[i + 2] = Math.max(0, Math.min(255, imageData.data[i + 2] + noise));
      // Alpha unchanged
    }

    context.putImageData(imageData, 0, 0);
  }
}

// Auto-register effect
export function register(generator) {
  generator.registerEffect(new NoiseEffect());
}

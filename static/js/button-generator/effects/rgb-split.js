import { ButtonEffect } from '../effect-base.js';

/**
 * RGB Split / Chromatic Aberration effect
 * Separates color channels for a glitchy chromatic aberration look
 */
export class RgbSplitEffect extends ButtonEffect {
  constructor() {
    super({
      id: 'rgb-split',
      name: 'RGB Split',
      type: 'general',
      category: 'Visual Effects',
      renderOrder: 85
    });
  }

  defineControls() {
    return [
      {
        id: 'animate-rgb-split',
        type: 'checkbox',
        label: 'RGB Split',
        defaultValue: false,
        description: 'Chromatic aberration effect'
      },
      {
        id: 'rgb-split-intensity',
        type: 'range',
        label: 'Split Intensity',
        defaultValue: 2,
        min: 1,
        max: 10,
        step: 0.5,
        showWhen: 'animate-rgb-split',
        description: 'Pixel offset for color channels'
      }
    ];
  }

  isEnabled(controlValues) {
    return controlValues['animate-rgb-split'] === true;
  }

  apply(context, controlValues, animState, renderData) {
    if (!animState) return;

    const intensity = controlValues['rgb-split-intensity'] || 2;
    const imageData = context.getImageData(0, 0, renderData.width, renderData.height);
    const result = context.createImageData(renderData.width, renderData.height);

    // Oscillating offset
    const phase = Math.sin(animState.getPhase(1.0));
    const offsetX = Math.round(phase * intensity);

    for (let y = 0; y < renderData.height; y++) {
      for (let x = 0; x < renderData.width; x++) {
        const idx = (y * renderData.width + x) * 4;

        // Red channel - shift left
        const redX = Math.max(0, Math.min(renderData.width - 1, x - offsetX));
        const redIdx = (y * renderData.width + redX) * 4;
        result.data[idx] = imageData.data[redIdx];

        // Green channel - no shift
        result.data[idx + 1] = imageData.data[idx + 1];

        // Blue channel - shift right
        const blueX = Math.max(0, Math.min(renderData.width - 1, x + offsetX));
        const blueIdx = (y * renderData.width + blueX) * 4;
        result.data[idx + 2] = imageData.data[blueIdx + 2];

        // Alpha channel
        result.data[idx + 3] = imageData.data[idx + 3];
      }
    }

    context.putImageData(result, 0, 0);
  }
}

// Auto-register effect
export function register(generator) {
  generator.registerEffect(new RgbSplitEffect());
}

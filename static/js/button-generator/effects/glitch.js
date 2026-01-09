import { ButtonEffect } from '../effect-base.js';

/**
 * Glitch effect
 * Creates horizontal scanline displacement for a glitchy look
 */
export class GlitchEffect extends ButtonEffect {
  constructor() {
    super({
      id: 'glitch',
      name: 'Glitch',
      type: 'general',
      category: 'Visual Effects',
      renderOrder: 80
    });
  }

  defineControls() {
    return [
      {
        id: 'animate-glitch',
        type: 'checkbox',
        label: 'Glitch Effect',
        defaultValue: false
      },
      {
        id: 'glitch-intensity',
        type: 'range',
        label: 'Glitch Intensity',
        defaultValue: 5,
        min: 1,
        max: 20,
        step: 1,
        showWhen: 'animate-glitch',
        description: 'Maximum pixel offset for glitch'
      }
    ];
  }

  isEnabled(controlValues) {
    return controlValues['animate-glitch'] === true;
  }

  apply(context, controlValues, animState, renderData) {
    if (!animState) return;

    const intensity = controlValues['glitch-intensity'] || 5;
    const imageData = context.getImageData(0, 0, renderData.width, renderData.height);

    // Randomly glitch ~10% of scanlines per frame
    const glitchProbability = 0.1;
    const maxOffset = intensity;

    for (let y = 0; y < renderData.height; y++) {
      if (Math.random() < glitchProbability) {
        const offset = Math.floor((Math.random() - 0.5) * maxOffset * 2);
        this.shiftScanline(imageData, y, offset, renderData.width);
      }
    }

    context.putImageData(imageData, 0, 0);
  }

  /**
   * Shift a horizontal scanline by offset pixels (with wrapping)
   */
  shiftScanline(imageData, y, offset, width) {
    const rowStart = y * width * 4;
    const rowData = new Uint8ClampedArray(width * 4);

    // Copy row
    for (let i = 0; i < width * 4; i++) {
      rowData[i] = imageData.data[rowStart + i];
    }

    // Shift and wrap
    for (let x = 0; x < width; x++) {
      let sourceX = (x - offset + width) % width;
      let destIdx = rowStart + x * 4;
      let srcIdx = sourceX * 4;

      imageData.data[destIdx] = rowData[srcIdx];
      imageData.data[destIdx + 1] = rowData[srcIdx + 1];
      imageData.data[destIdx + 2] = rowData[srcIdx + 2];
      imageData.data[destIdx + 3] = rowData[srcIdx + 3];
    }
  }
}

// Auto-register effect
export function register(generator) {
  generator.registerEffect(new GlitchEffect());
}

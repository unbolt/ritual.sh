import { ButtonEffect } from '../effect-base.js';

/**
 * Scanline effect
 * Creates CRT-style horizontal lines
 */
export class ScanlineEffect extends ButtonEffect {
  constructor() {
    super({
      id: 'scanline',
      name: 'Scanline',
      type: 'general',
      category: 'Visual Effects',
      renderOrder: 75
    });
  }

  defineControls() {
    return [
      {
        id: 'animate-scanline',
        type: 'checkbox',
        label: 'Scanline Effect',
        defaultValue: false
      },
      {
        id: 'scanline-intensity',
        type: 'range',
        label: 'Scanline Intensity',
        defaultValue: 0.3,
        min: 0.1,
        max: 0.8,
        step: 0.05,
        showWhen: 'animate-scanline',
        description: 'Darkness of scanlines'
      },
      {
        id: 'scanline-speed',
        type: 'range',
        label: 'Scanline Speed',
        defaultValue: 1,
        min: 0.1,
        max: 3,
        step: 0.1,
        showWhen: 'animate-scanline',
        description: 'Movement speed of scanlines'
      }
    ];
  }

  isEnabled(controlValues) {
    return controlValues['animate-scanline'] === true;
  }

  apply(context, controlValues, animState, renderData) {
    if (!animState) return;

    const intensity = controlValues['scanline-intensity'] || 0.3;
    const speed = controlValues['scanline-speed'] || 1;

    // Create overlay with scanlines
    context.globalCompositeOperation = 'multiply';
    context.fillStyle = `rgba(0, 0, 0, ${intensity})`;

    // Animate scanline position
    const offset = (animState.progress * speed * renderData.height) % 2;

    for (let y = offset; y < renderData.height; y += 2) {
      context.fillRect(0, Math.floor(y), renderData.width, 1);
    }

    context.globalCompositeOperation = 'source-over';
  }
}

// Auto-register effect
export function register(generator) {
  generator.registerEffect(new ScanlineEffect());
}

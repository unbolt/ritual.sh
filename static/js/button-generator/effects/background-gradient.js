import { ButtonEffect } from '../effect-base.js';

/**
 * Gradient background effect
 */
export class GradientBackgroundEffect extends ButtonEffect {
  constructor() {
    super({
      id: 'bg-gradient',
      name: 'Gradient Background',
      type: 'background',
      category: 'Background',
      renderOrder: 1
    });
  }

  defineControls() {
    return [
      {
        id: 'gradient-color1',
        type: 'color',
        label: 'Gradient Color 1',
        defaultValue: '#ff0000',
        showWhen: 'bg-type',
        description: 'Start color of gradient'
      },
      {
        id: 'gradient-color2',
        type: 'color',
        label: 'Gradient Color 2',
        defaultValue: '#0000ff',
        showWhen: 'bg-type',
        description: 'End color of gradient'
      },
      {
        id: 'gradient-angle',
        type: 'range',
        label: 'Gradient Angle',
        defaultValue: 90,
        min: 0,
        max: 360,
        step: 1,
        showWhen: 'bg-type',
        description: 'Angle of gradient direction'
      }
    ];
  }

  isEnabled(controlValues) {
    return controlValues['bg-type'] === 'gradient';
  }

  apply(context, controlValues, animState, renderData) {
    const color1 = controlValues['gradient-color1'] || '#ff0000';
    const color2 = controlValues['gradient-color2'] || '#0000ff';
    const angle = (controlValues['gradient-angle'] || 90) * (Math.PI / 180);

    // Calculate gradient endpoints
    const x1 = renderData.centerX + Math.cos(angle) * renderData.centerX;
    const y1 = renderData.centerY + Math.sin(angle) * renderData.centerY;
    const x2 = renderData.centerX - Math.cos(angle) * renderData.centerX;
    const y2 = renderData.centerY - Math.sin(angle) * renderData.centerY;

    const gradient = context.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);

    context.fillStyle = gradient;
    context.fillRect(0, 0, renderData.width, renderData.height);
  }
}

// Auto-register effect
export function register(generator) {
  generator.registerEffect(new GradientBackgroundEffect());
}

import { ButtonEffect } from '../effect-base.js';

/**
 * Solid color background effect
 */
export class SolidBackgroundEffect extends ButtonEffect {
  constructor() {
    super({
      id: 'bg-solid',
      name: 'Solid Background',
      type: 'background',
      category: 'Background',
      renderOrder: 1
    });
  }

  defineControls() {
    return [
      {
        id: 'bg-type',
        type: 'select',
        label: 'Background Type',
        defaultValue: 'solid',
        options: [
          { value: 'solid', label: 'Solid Color' },
          { value: 'gradient', label: 'Gradient' },
          { value: 'texture', label: 'Texture' },
          { value: 'emoji-wallpaper', label: 'Emoji Wallpaper' }
        ]
      },
      {
        id: 'bg-color',
        type: 'color',
        label: 'Background Color',
        defaultValue: '#4a90e2',
        showWhen: 'bg-type',
        description: 'Solid background color'
      }
    ];
  }

  isEnabled(controlValues) {
    return controlValues['bg-type'] === 'solid';
  }

  apply(context, controlValues, animState, renderData) {
    const color = controlValues['bg-color'] || '#4a90e2';
    context.fillStyle = color;
    context.fillRect(0, 0, renderData.width, renderData.height);
  }
}

// Auto-register effect
export function register(generator) {
  generator.registerEffect(new SolidBackgroundEffect());
}

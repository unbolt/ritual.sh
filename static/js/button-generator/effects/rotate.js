import { ButtonEffect } from '../effect-base.js';

/**
 * Rotate effect
 * Rotates the button back and forth
 */
export class RotateEffect extends ButtonEffect {
  constructor() {
    super({
      id: 'rotate',
      name: 'Rotate',
      type: 'transform',
      category: 'Visual Effects',
      renderOrder: 2 // Must run before any drawing (after pulse)
    });
  }

  defineControls() {
    return [
      {
        id: 'animate-rotate',
        type: 'checkbox',
        label: 'Rotate Effect',
        defaultValue: false
      },
      {
        id: 'rotate-angle',
        type: 'range',
        label: 'Max Angle',
        defaultValue: 15,
        min: 1,
        max: 45,
        step: 1,
        showWhen: 'animate-rotate',
        description: 'Maximum rotation angle in degrees'
      },
      {
        id: 'rotate-speed',
        type: 'range',
        label: 'Rotation Speed',
        defaultValue: 1,
        min: 0.1,
        max: 3,
        step: 0.1,
        showWhen: 'animate-rotate',
        description: 'Speed of rotation'
      }
    ];
  }

  isEnabled(controlValues) {
    return controlValues['animate-rotate'] === true;
  }

  apply(context, controlValues, animState, renderData) {
    if (!animState) return;

    const maxAngle = controlValues['rotate-angle'] || 15;
    const speed = controlValues['rotate-speed'] || 1;
    const angle = Math.sin(animState.getPhase(speed)) * maxAngle * (Math.PI / 180);

    // Apply transformation (context save/restore handled by caller)
    context.translate(renderData.centerX, renderData.centerY);
    context.rotate(angle);
    context.translate(-renderData.centerX, -renderData.centerY);
  }
}

// Auto-register effect
export function register(generator) {
  generator.registerEffect(new RotateEffect());
}

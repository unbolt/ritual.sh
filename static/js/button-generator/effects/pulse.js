import { ButtonEffect } from '../effect-base.js';

/**
 * Pulse effect
 * Scales the button content up and down
 */
export class PulseEffect extends ButtonEffect {
  constructor() {
    super({
      id: 'pulse',
      name: 'Pulse',
      type: 'transform',
      category: 'Visual Effects',
      renderOrder: 1 // Must run before any drawing
    });
  }

  defineControls() {
    return [
      {
        id: 'animate-pulse',
        type: 'checkbox',
        label: 'Pulse Effect',
        defaultValue: false
      },
      {
        id: 'pulse-scale',
        type: 'range',
        label: 'Pulse Scale',
        defaultValue: 1.2,
        min: 1.0,
        max: 2.0,
        step: 0.05,
        showWhen: 'animate-pulse',
        description: 'Maximum scale size'
      }
    ];
  }

  isEnabled(controlValues) {
    return controlValues['animate-pulse'] === true;
  }

  apply(context, controlValues, animState, renderData) {
    if (!animState) return;

    const maxScale = controlValues['pulse-scale'] || 1.2;
    const minScale = 1.0;
    const scale = minScale + (maxScale - minScale) *
                  (Math.sin(animState.getPhase(1.0)) * 0.5 + 0.5);

    // Apply transformation (context save/restore handled by caller)
    context.translate(renderData.centerX, renderData.centerY);
    context.scale(scale, scale);
    context.translate(-renderData.centerX, -renderData.centerY);
  }
}

// Auto-register effect
export function register(generator) {
  generator.registerEffect(new PulseEffect());
}

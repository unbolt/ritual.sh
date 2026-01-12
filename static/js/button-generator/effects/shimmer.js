import { ButtonEffect } from '../effect-base.js';

/**
 * Shimmer effect
 * Creates a sweeping light/shine effect across the button
 */
export class ShimmerEffect extends ButtonEffect {
  constructor() {
    super({
      id: 'shimmer',
      name: 'Shimmer',
      type: 'general',
      category: 'Visual Effects',
      renderOrder: 70
    });
  }

  defineControls() {
    return [
      {
        id: 'animate-shimmer',
        type: 'checkbox',
        label: 'Shimmer Effect',
        defaultValue: false,
        description: 'Sweeping light effect'
      }
    ];
  }

  isEnabled(controlValues) {
    return controlValues['animate-shimmer'] === true;
  }

  apply(context, controlValues, animState, renderData) {
    if (!animState) return;

    const shimmerX = animState.progress * (renderData.width + 40) - 20;

    const gradient = context.createLinearGradient(
      shimmerX - 15,
      0,
      shimmerX + 15,
      renderData.height
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, renderData.width, renderData.height);
  }
}

// Auto-register effect
export function register(generator) {
  generator.registerEffect(new ShimmerEffect());
}

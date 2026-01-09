import { ButtonEffect } from '../effect-base.js';

/**
 * Rainbow flash background effect
 * Animates background through rainbow colors
 */
export class RainbowBackgroundEffect extends ButtonEffect {
  constructor() {
    super({
      id: 'bg-rainbow',
      name: 'Rainbow Background',
      type: 'background',
      category: 'Background Animations',
      renderOrder: 2 // After base background
    });
  }

  defineControls() {
    return [
      {
        id: 'animate-bg-rainbow',
        type: 'checkbox',
        label: 'Rainbow Flash',
        defaultValue: false
      },
      {
        id: 'rainbow-speed',
        type: 'range',
        label: 'Rainbow Speed',
        defaultValue: 1,
        min: 0.1,
        max: 5,
        step: 0.1,
        showWhen: 'animate-bg-rainbow',
        description: 'Speed of rainbow cycling'
      }
    ];
  }

  isEnabled(controlValues) {
    return controlValues['animate-bg-rainbow'] === true;
  }

  apply(context, controlValues, animState, renderData) {
    if (!animState) return;

    const speed = controlValues['rainbow-speed'] || 1;
    const hue = (animState.progress * speed * 360) % 360;

    const bgType = controlValues['bg-type'];

    if (bgType === 'solid') {
      // Solid rainbow
      context.fillStyle = `hsl(${hue}, 70%, 50%)`;
      context.fillRect(0, 0, renderData.width, renderData.height);
    } else if (bgType === 'gradient') {
      // Rainbow gradient
      const angle = (controlValues['gradient-angle'] || 90) * (Math.PI / 180);
      const x1 = renderData.centerX + Math.cos(angle) * renderData.centerX;
      const y1 = renderData.centerY + Math.sin(angle) * renderData.centerY;
      const x2 = renderData.centerX - Math.cos(angle) * renderData.centerX;
      const y2 = renderData.centerY - Math.sin(angle) * renderData.centerY;

      const gradient = context.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, `hsl(${hue}, 70%, 50%)`);
      gradient.addColorStop(1, `hsl(${(hue + 60) % 360}, 70%, 60%)`);

      context.fillStyle = gradient;
      context.fillRect(0, 0, renderData.width, renderData.height);
    }
  }
}

/**
 * Rainbow gradient sweep effect
 * Creates a moving rainbow gradient that sweeps across the button
 */
export class RainbowGradientSweepEffect extends ButtonEffect {
  constructor() {
    super({
      id: 'bg-rainbow-gradient',
      name: 'Rainbow Gradient Sweep',
      type: 'general',
      category: 'Background Animations',
      renderOrder: 50 // After background and text
    });
  }

  defineControls() {
    return [
      {
        id: 'animate-bg-rainbow-gradient',
        type: 'checkbox',
        label: 'Rainbow Sweep',
        defaultValue: false,
        description: 'Moving rainbow gradient overlay'
      }
    ];
  }

  isEnabled(controlValues) {
    return controlValues['animate-bg-rainbow-gradient'] === true;
  }

  apply(context, controlValues, animState, renderData) {
    if (!animState) return;

    // Map progress to position (-100 to 100)
    const position = animState.progress * 200 - 100;

    // Create a horizontal gradient that sweeps across
    const gradient = context.createLinearGradient(
      position - 50,
      0,
      position + 50,
      0
    );

    // Create rainbow stops that also cycle through colors
    const hueOffset = animState.progress * 360;
    gradient.addColorStop(0, `hsla(${(hueOffset + 0) % 360}, 80%, 50%, 0)`);
    gradient.addColorStop(0.2, `hsla(${(hueOffset + 60) % 360}, 80%, 50%, 0.6)`);
    gradient.addColorStop(0.4, `hsla(${(hueOffset + 120) % 360}, 80%, 50%, 0.8)`);
    gradient.addColorStop(0.6, `hsla(${(hueOffset + 180) % 360}, 80%, 50%, 0.8)`);
    gradient.addColorStop(0.8, `hsla(${(hueOffset + 240) % 360}, 80%, 50%, 0.6)`);
    gradient.addColorStop(1, `hsla(${(hueOffset + 300) % 360}, 80%, 50%, 0)`);

    context.fillStyle = gradient;
    context.fillRect(0, 0, renderData.width, renderData.height);
  }
}

// Auto-register effects
export function register(generator) {
  generator.registerEffect(new RainbowBackgroundEffect());
  generator.registerEffect(new RainbowGradientSweepEffect());
}

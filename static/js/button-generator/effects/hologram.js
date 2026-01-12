import { ButtonEffect } from '../effect-base.js';

/**
 * Hologram effect
 * Creates a futuristic holographic appearance with glitches and scan lines
 */
export class HologramEffect extends ButtonEffect {
  constructor() {
    super({
      id: 'hologram',
      name: 'Hologram',
      type: 'general',
      category: 'Visual Effects',
      renderOrder: 88 // Near the end, after most other effects
    });
  }

  defineControls() {
    return [
      {
        id: 'animate-hologram',
        type: 'checkbox',
        label: 'Hologram Effect',
        defaultValue: false,
        description: 'Futuristic holographic appearance'
      },
      {
        id: 'hologram-intensity',
        type: 'range',
        label: 'Effect Intensity',
        defaultValue: 50,
        min: 10,
        max: 100,
        step: 5,
        showWhen: 'animate-hologram',
        description: 'Strength of hologram effect'
      },
      {
        id: 'hologram-glitch-freq',
        type: 'range',
        label: 'Glitch Frequency',
        defaultValue: 30,
        min: 0,
        max: 100,
        step: 10,
        showWhen: 'animate-hologram',
        description: 'How often glitches occur'
      },
      {
        id: 'hologram-color',
        type: 'color',
        label: 'Hologram Tint',
        defaultValue: '#00ffff',
        showWhen: 'animate-hologram',
        description: 'Color tint for hologram effect'
      }
    ];
  }

  isEnabled(controlValues) {
    return controlValues['animate-hologram'] === true;
  }

  apply(context, controlValues, animState, renderData) {
    if (!animState) return;

    const intensity = (controlValues['hologram-intensity'] || 50) / 100;
    const glitchFreq = (controlValues['hologram-glitch-freq'] || 30) / 100;
    const color = controlValues['hologram-color'] || '#00ffff';

    // Get current canvas content
    const imageData = context.getImageData(0, 0, renderData.width, renderData.height);
    const data = imageData.data;

    // Parse hologram color for tinting
    const hexColor = color.replace('#', '');
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);

    // Apply holographic tint
    for (let i = 0; i < data.length; i += 4) {
      // Mix with hologram color
      data[i] = data[i] * (1 - intensity * 0.3) + r * intensity * 0.3;     // Red
      data[i + 1] = data[i + 1] * (1 - intensity * 0.5) + g * intensity * 0.5; // Green (more cyan)
      data[i + 2] = data[i + 2] * (1 - intensity * 0.5) + b * intensity * 0.5; // Blue (more cyan)
    }

    context.putImageData(imageData, 0, 0);

    // Add horizontal scan lines
    context.globalAlpha = 0.05 * intensity;
    context.fillStyle = '#000000';
    for (let y = 0; y < renderData.height; y += 2) {
      context.fillRect(0, y, renderData.width, 1);
    }
    context.globalAlpha = 1.0;

    // Add moving highlight scan line
    const scanY = (animState.progress * renderData.height) % renderData.height;
    const gradient = context.createLinearGradient(0, scanY - 3, 0, scanY + 3);
    gradient.addColorStop(0, 'rgba(0, 255, 255, 0)');
    gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${0.3 * intensity})`);
    gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, scanY - 3, renderData.width, 6);

    // Random glitches
    if (Math.random() < glitchFreq * 0.1) {
      const glitchY = Math.floor(Math.random() * renderData.height);
      const glitchHeight = Math.floor(2 + Math.random() * 4);
      const offset = (Math.random() - 0.5) * 6 * intensity;

      const sliceData = context.getImageData(0, glitchY, renderData.width, glitchHeight);
      context.putImageData(sliceData, offset, glitchY);
    }

    // Add chromatic aberration on edges
    if (intensity > 0.3) {
      const originalImage = context.getImageData(0, 0, renderData.width, renderData.height);
      const aberration = 2 * intensity;

      // Slight red shift right
      const redShift = context.getImageData(0, 0, renderData.width, renderData.height);
      for (let i = 0; i < redShift.data.length; i += 4) {
        const pixelIndex = i / 4;
        const x = pixelIndex % renderData.width;
        if (x < 3 || x > renderData.width - 3) {
          const sourceIndex = ((pixelIndex + Math.floor(aberration)) * 4);
          if (sourceIndex < originalImage.data.length) {
            redShift.data[i] = originalImage.data[sourceIndex];
          }
        }
      }

      // Slight blue shift left
      const blueShift = context.getImageData(0, 0, renderData.width, renderData.height);
      for (let i = 0; i < blueShift.data.length; i += 4) {
        const pixelIndex = i / 4;
        const x = pixelIndex % renderData.width;
        if (x < 3 || x > renderData.width - 3) {
          const sourceIndex = ((pixelIndex - Math.floor(aberration)) * 4);
          if (sourceIndex >= 0 && sourceIndex < originalImage.data.length) {
            blueShift.data[i + 2] = originalImage.data[sourceIndex + 2];
          }
        }
      }

      context.putImageData(redShift, 0, 0);
      context.globalCompositeOperation = 'screen';
      context.globalAlpha = 0.3;
      context.putImageData(blueShift, 0, 0);
      context.globalCompositeOperation = 'source-over';
      context.globalAlpha = 1.0;
    }

    // Add flickering effect
    if (Math.random() < 0.05) {
      context.globalAlpha = 0.9 + Math.random() * 0.1;
      context.fillStyle = 'rgba(255, 255, 255, 0.05)';
      context.fillRect(0, 0, renderData.width, renderData.height);
      context.globalAlpha = 1.0;
    }
  }
}

// Auto-register effect
export function register(generator) {
  generator.registerEffect(new HologramEffect());
}

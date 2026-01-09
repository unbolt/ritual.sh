import { ButtonEffect } from '../effect-base.js';

/**
 * Wave text animation effect
 * Makes text characters wave up and down in a sine wave pattern
 */
export class WaveTextEffect extends ButtonEffect {
  constructor(textLineNumber = 1) {
    const suffix = textLineNumber === 1 ? '' : '2';
    super({
      id: `text-wave${suffix}`,
      name: `Text Wave ${textLineNumber}`,
      type: textLineNumber === 1 ? 'text' : 'text2',
      category: textLineNumber === 1 ? 'Text Line 1' : 'Text Line 2',
      renderOrder: 10,
      textLineNumber: textLineNumber // Pass through config
    });
    this.textLineNumber = textLineNumber;
  }

  defineControls() {
    const textLineNumber = this.textLineNumber || this.config?.textLineNumber || 1;
    const suffix = textLineNumber === 1 ? '' : '2';
    return [
      {
        id: `animate-text-wave${suffix}`,
        type: 'checkbox',
        label: 'Wave Animation',
        defaultValue: false
      },
      {
        id: `wave-amplitude${suffix}`,
        type: 'range',
        label: 'Wave Amplitude',
        defaultValue: 3,
        min: 1,
        max: 10,
        step: 0.5,
        showWhen: `animate-text-wave${suffix}`,
        description: 'Height of the wave motion'
      },
      {
        id: `wave-speed${suffix}`,
        type: 'range',
        label: 'Wave Speed',
        defaultValue: 1,
        min: 0.1,
        max: 3,
        step: 0.1,
        showWhen: `animate-text-wave${suffix}`,
        description: 'Speed of the wave animation'
      }
    ];
  }

  isEnabled(controlValues) {
    const suffix = this.textLineNumber === 1 ? '' : '2';
    return controlValues[`animate-text-wave${suffix}`] === true;
  }

  apply(context, controlValues, animState, renderData) {
    if (!animState) return; // Wave requires animation

    const suffix = this.textLineNumber === 1 ? '' : '2';

    // Get text configuration
    const text = controlValues[`button-text${suffix}`] || '';
    const enabled = controlValues[`text${suffix}-enabled`];
    if (!text || !enabled) return;

    const fontSize = controlValues[`font-size${suffix}`] || 12;
    const fontWeight = controlValues[`font-bold${suffix}`] ? 'bold' : 'normal';
    const fontStyle = controlValues[`font-italic${suffix}`] ? 'italic' : 'normal';
    const fontFamily = controlValues[`font-family${suffix}`] || 'Arial';

    const baseX = (controlValues[`text${suffix}-x`] / 100) * renderData.width;
    const baseY = (controlValues[`text${suffix}-y`] / 100) * renderData.height;

    const amplitude = controlValues[`wave-amplitude${suffix}`] || 3;
    const speed = controlValues[`wave-speed${suffix}`] || 1;

    // Set font
    context.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}"`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Get colors
    const colors = this.getTextColors(context, controlValues, text, baseX, baseY, fontSize, animState);

    // Split text into grapheme clusters (handles emojis properly)
    // Use Intl.Segmenter if available, otherwise fall back to spread operator
    let chars;
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
      chars = Array.from(segmenter.segment(text), s => s.segment);
    } else {
      // Fallback: spread operator handles basic emoji
      chars = [...text];
    }

    // Measure total width for centering
    const totalWidth = context.measureText(text).width;
    let currentX = baseX - totalWidth / 2;

    // Draw each character with wave offset
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      const charWidth = context.measureText(char).width;

      // Calculate wave offset for this character
      const phase = animState.getPhase(speed);
      const charOffset = i / chars.length;
      const waveY = Math.sin(phase + charOffset * Math.PI * 2) * amplitude;

      const charX = currentX + charWidth / 2;
      const charY = baseY + waveY;

      // Draw outline if enabled
      if (controlValues[`text${suffix}-outline`]) {
        context.strokeStyle = colors.strokeStyle;
        context.lineWidth = 2;
        context.strokeText(char, charX, charY);
      }

      // Draw character
      context.fillStyle = colors.fillStyle;
      context.fillText(char, charX, charY);

      currentX += charWidth;
    }
  }

  /**
   * Get text colors (solid, gradient, or rainbow)
   */
  getTextColors(context, controlValues, text, x, y, fontSize, animState) {
    const suffix = this.textLineNumber === 1 ? '' : '2';

    let fillStyle, strokeStyle;

    // Check if rainbow text is also enabled
    if (animState && controlValues[`animate-text-rainbow${suffix}`]) {
      const speed = controlValues[`text-rainbow-speed${suffix}`] || 1;
      const hue = (animState.progress * speed * 360) % 360;
      fillStyle = `hsl(${hue}, 80%, 60%)`;
      strokeStyle = `hsl(${hue}, 80%, 30%)`;
    } else {
      const colorType = controlValues[`text${suffix}-color-type`] || 'solid';

      if (colorType === 'solid') {
        fillStyle = controlValues[`text${suffix}-color`] || '#ffffff';
        strokeStyle = controlValues[`outline${suffix}-color`] || '#000000';
      } else {
        // Gradient
        const angle = (controlValues[`text${suffix}-gradient-angle`] || 0) * (Math.PI / 180);
        const textWidth = context.measureText(text).width;
        const x1 = x - textWidth / 2 + (Math.cos(angle) * textWidth) / 2;
        const y1 = y - fontSize / 2 + (Math.sin(angle) * fontSize) / 2;
        const x2 = x + textWidth / 2 - (Math.cos(angle) * textWidth) / 2;
        const y2 = y + fontSize / 2 - (Math.sin(angle) * fontSize) / 2;

        const gradient = context.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, controlValues[`text${suffix}-gradient-color1`] || '#ffffff');
        gradient.addColorStop(1, controlValues[`text${suffix}-gradient-color2`] || '#00ffff');
        fillStyle = gradient;
        strokeStyle = controlValues[`outline${suffix}-color`] || '#000000';
      }
    }

    return { fillStyle, strokeStyle };
  }
}

// Auto-register effect
export function register(generator) {
  generator.registerEffect(new WaveTextEffect(1));
  generator.registerEffect(new WaveTextEffect(2));
}

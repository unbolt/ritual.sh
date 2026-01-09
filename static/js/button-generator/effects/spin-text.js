import { ButtonEffect } from '../effect-base.js';

/**
 * Spinning text animation effect
 * Makes each character rotate independently
 */
export class SpinTextEffect extends ButtonEffect {
  constructor(textLineNumber = 1) {
    const suffix = textLineNumber === 1 ? '' : '2';
    super({
      id: `text-spin${suffix}`,
      name: `Spinning Text ${textLineNumber}`,
      type: textLineNumber === 1 ? 'text' : 'text2',
      category: textLineNumber === 1 ? 'Text Line 1' : 'Text Line 2',
      renderOrder: 8, // Before wave, after rainbow
      textLineNumber: textLineNumber
    });
    this.textLineNumber = textLineNumber;
  }

  defineControls() {
    const textLineNumber = this.textLineNumber || this.config?.textLineNumber || 1;
    const suffix = textLineNumber === 1 ? '' : '2';
    return [
      {
        id: `animate-text-spin${suffix}`,
        type: 'checkbox',
        label: 'Spinning Animation',
        defaultValue: false
      },
      {
        id: `spin-speed${suffix}`,
        type: 'range',
        label: 'Spin Speed',
        defaultValue: 1,
        min: 0.1,
        max: 5,
        step: 0.1,
        showWhen: `animate-text-spin${suffix}`,
        description: 'Speed of character rotation'
      },
      {
        id: `spin-stagger${suffix}`,
        type: 'range',
        label: 'Spin Stagger',
        defaultValue: 0.3,
        min: 0,
        max: 1,
        step: 0.1,
        showWhen: `animate-text-spin${suffix}`,
        description: 'Delay between characters'
      }
    ];
  }

  isEnabled(controlValues) {
    const suffix = this.textLineNumber === 1 ? '' : '2';
    return controlValues[`animate-text-spin${suffix}`] === true;
  }

  apply(context, controlValues, animState, renderData) {
    const suffix = this.textLineNumber === 1 ? '' : '2';
    const text = controlValues[`button-text${suffix}`] || '';

    if (!text || !controlValues[`text${suffix}-enabled`]) return;
    if (!animState) return;

    const speed = controlValues[`spin-speed${suffix}`] || 1;
    const stagger = controlValues[`spin-stagger${suffix}`] || 0.3;
    const fontSize = controlValues[`font-size${suffix}`] || 14;
    const fontFamily = controlValues[`font-family${suffix}`] || 'Arial';
    const fontWeight = controlValues[`text${suffix}-bold`] ? 'bold' : 'normal';
    const fontStyle = controlValues[`text${suffix}-italic`] ? 'italic' : 'normal';

    context.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}"`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Get text color
    let fillStyle;
    const colorType = controlValues[`text${suffix}-color-type`] || 'solid';
    if (colorType === 'gradient') {
      const color1 = controlValues[`text${suffix}-gradient-color1`] || '#ffffff';
      const color2 = controlValues[`text${suffix}-gradient-color2`] || '#00ffff';
      const angle = (controlValues[`text${suffix}-gradient-angle`] || 90) * (Math.PI / 180);
      const centerX = renderData.centerX;
      const centerY = renderData.centerY;
      const x1 = centerX + Math.cos(angle) * 20;
      const y1 = centerY + Math.sin(angle) * 20;
      const x2 = centerX - Math.cos(angle) * 20;
      const y2 = centerY - Math.sin(angle) * 20;
      const gradient = context.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, color1);
      gradient.addColorStop(1, color2);
      fillStyle = gradient;
    } else {
      fillStyle = controlValues[`text${suffix}-color`] || '#ffffff';
    }

    // Calculate base position
    const x = controlValues[`text${suffix}-x`] || 50;
    const y = controlValues[`text${suffix}-y`] || 50;
    const baseX = (x / 100) * renderData.width;
    const baseY = (y / 100) * renderData.height;

    // Measure total text width for centering
    const totalWidth = context.measureText(text).width;
    let currentX = baseX - totalWidth / 2;

    // Draw each character with rotation
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const charWidth = context.measureText(char).width;
      const charCenterX = currentX + charWidth / 2;

      // Calculate rotation for this character
      const phase = animState.getPhase(speed) + i * stagger * Math.PI * 2;
      const rotation = phase % (Math.PI * 2);

      context.save();
      context.translate(charCenterX, baseY);
      context.rotate(rotation);

      // Apply outline if enabled
      if (controlValues[`text${suffix}-outline`]) {
        context.strokeStyle = controlValues[`text${suffix}-outline-color`] || '#000000';
        context.lineWidth = 2;
        context.strokeText(char, 0, 0);
      }

      context.fillStyle = fillStyle;
      context.fillText(char, 0, 0);
      context.restore();

      currentX += charWidth;
    }
  }
}

// Auto-register effects for both text lines
export function register(generator) {
  generator.registerEffect(new SpinTextEffect(1));
  generator.registerEffect(new SpinTextEffect(2));
}

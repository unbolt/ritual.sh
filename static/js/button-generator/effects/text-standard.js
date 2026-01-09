import { ButtonEffect } from '../effect-base.js';

/**
 * Standard text rendering effect
 * Renders static text (when no animations are active)
 */
export class StandardTextEffect extends ButtonEffect {
  constructor(textLineNumber = 1) {
    const suffix = textLineNumber === 1 ? '' : '2';
    super({
      id: `text-standard${suffix}`,
      name: `Standard Text ${textLineNumber}`,
      type: textLineNumber === 1 ? 'text' : 'text2',
      category: textLineNumber === 1 ? 'Text Line 1' : 'Text Line 2',
      renderOrder: 20, // After animations
      textLineNumber: textLineNumber // Pass through config so defineControls can access it
    });
    this.textLineNumber = textLineNumber;
  }

  defineControls() {
    // Access from config since this is called before constructor completes
    const textLineNumber = this.textLineNumber || this.config?.textLineNumber || 1;
    const suffix = textLineNumber === 1 ? '' : '2';
    return [
      {
        id: `button-text${suffix}`,
        type: 'text',
        label: `Text Line ${textLineNumber}`,
        defaultValue: textLineNumber === 1 ? 'RITUAL.SH' : ''
      },
      {
        id: `text${suffix}-enabled`,
        type: 'checkbox',
        label: `Enable Text Line ${textLineNumber}`,
        defaultValue: textLineNumber === 1
      },
      {
        id: `font-size${suffix}`,
        type: 'range',
        label: 'Font Size',
        min: 6,
        max: 24,
        defaultValue: textLineNumber === 1 ? 14 : 12
      },
      {
        id: `text${suffix}-x`,
        type: 'range',
        label: 'Horizontal Position',
        min: 0,
        max: 100,
        defaultValue: 50,
        description: 'Percentage from left'
      },
      {
        id: `text${suffix}-y`,
        type: 'range',
        label: 'Vertical Position',
        min: 0,
        max: 100,
        defaultValue: textLineNumber === 1 ? 35 : 65,
        description: 'Percentage from top'
      },
      {
        id: `text${suffix}-color-type`,
        type: 'select',
        label: 'Color Type',
        defaultValue: 'solid',
        options: [
          { value: 'solid', label: 'Solid Color' },
          { value: 'gradient', label: 'Gradient' }
        ]
      },
      {
        id: `text${suffix}-color`,
        type: 'color',
        label: 'Text Color',
        defaultValue: '#ffffff',
        showWhen: `text${suffix}-color-type`
      },
      {
        id: `text${suffix}-gradient-color1`,
        type: 'color',
        label: 'Gradient Color 1',
        defaultValue: '#ffffff',
        showWhen: `text${suffix}-color-type`
      },
      {
        id: `text${suffix}-gradient-color2`,
        type: 'color',
        label: 'Gradient Color 2',
        defaultValue: '#00ffff',
        showWhen: `text${suffix}-color-type`
      },
      {
        id: `text${suffix}-gradient-angle`,
        type: 'range',
        label: 'Gradient Angle',
        min: 0,
        max: 360,
        defaultValue: 0,
        showWhen: `text${suffix}-color-type`
      },
      {
        id: `text${suffix}-outline`,
        type: 'checkbox',
        label: 'Outline',
        defaultValue: false
      },
      {
        id: `outline${suffix}-color`,
        type: 'color',
        label: 'Outline Color',
        defaultValue: '#000000',
        showWhen: `text${suffix}-outline`
      },
      {
        id: `font-family${suffix}`,
        type: 'select',
        label: 'Font',
        defaultValue: 'Lato',
        options: [
          { value: 'Lato', label: 'Lato' },
          { value: 'Roboto', label: 'Roboto' },
          { value: 'Open Sans', label: 'Open Sans' },
          { value: 'Montserrat', label: 'Montserrat' },
          { value: 'Oswald', label: 'Oswald' },
          { value: 'Bebas Neue', label: 'Bebas Neue' },
          { value: 'Roboto Mono', label: 'Roboto Mono' },
          { value: 'VT323', label: 'VT323' },
          { value: 'Press Start 2P', label: 'Press Start 2P' },
          { value: 'DSEG7-Classic', label: 'DSEG7' }
        ]
      },
      {
        id: `font-bold${suffix}`,
        type: 'checkbox',
        label: 'Bold',
        defaultValue: false
      },
      {
        id: `font-italic${suffix}`,
        type: 'checkbox',
        label: 'Italic',
        defaultValue: false
      }
    ];
  }

  isEnabled(controlValues) {
    const suffix = this.textLineNumber === 1 ? '' : '2';
    const text = controlValues[`button-text${suffix}`];
    const enabled = controlValues[`text${suffix}-enabled`];

    // Only render if text exists, is enabled, and no animations are active on this text
    const waveActive = controlValues[`animate-text-wave${suffix}`];
    const rainbowActive = controlValues[`animate-text-rainbow${suffix}`];

    return text && enabled && !waveActive && !rainbowActive;
  }

  apply(context, controlValues, animState, renderData) {
    const suffix = this.textLineNumber === 1 ? '' : '2';

    const text = controlValues[`button-text${suffix}`];
    if (!text) return;

    const fontSize = controlValues[`font-size${suffix}`] || 12;
    const fontWeight = controlValues[`font-bold${suffix}`] ? 'bold' : 'normal';
    const fontStyle = controlValues[`font-italic${suffix}`] ? 'italic' : 'normal';
    const fontFamily = controlValues[`font-family${suffix}`] || 'Arial';

    const x = (controlValues[`text${suffix}-x`] / 100) * renderData.width;
    const y = (controlValues[`text${suffix}-y`] / 100) * renderData.height;

    // Set font
    context.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}"`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Get colors
    const colors = this.getTextColors(context, controlValues, text, x, y, fontSize);

    // Draw outline if enabled
    if (controlValues[`text${suffix}-outline`]) {
      context.strokeStyle = colors.strokeStyle;
      context.lineWidth = 2;
      context.strokeText(text, x, y);
    }

    // Draw text
    context.fillStyle = colors.fillStyle;
    context.fillText(text, x, y);
  }

  /**
   * Get text colors (solid or gradient)
   */
  getTextColors(context, controlValues, text, x, y, fontSize) {
    const suffix = this.textLineNumber === 1 ? '' : '2';
    const colorType = controlValues[`text${suffix}-color-type`] || 'solid';

    let fillStyle, strokeStyle;

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

    return { fillStyle, strokeStyle };
  }
}

// Auto-register effect
export function register(generator) {
  generator.registerEffect(new StandardTextEffect(1));
  generator.registerEffect(new StandardTextEffect(2));
}

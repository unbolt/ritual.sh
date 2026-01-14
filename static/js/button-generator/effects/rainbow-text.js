import { ButtonEffect } from '../effect-base.js';

/**
 * Rainbow text animation effect
 * Cycles text color through rainbow hues
 */
export class RainbowTextEffect extends ButtonEffect {
  constructor(textLineNumber = 1) {
    const suffix = textLineNumber === 1 ? '' : '2';
    super({
      id: `text-rainbow${suffix}`,
      name: `Rainbow Text ${textLineNumber}`,
      type: textLineNumber === 1 ? 'text' : 'text2',
      category: textLineNumber === 1 ? 'Text Line 1' : 'Text Line 2',
      renderOrder: 5, // Apply before wave (lower order)
      textLineNumber: textLineNumber // Pass through config
    });
    this.textLineNumber = textLineNumber;
  }

  defineControls() {
    const textLineNumber = this.textLineNumber || this.config?.textLineNumber || 1;
    const suffix = textLineNumber === 1 ? '' : '2';
    return [
      {
        id: `animate-text-rainbow${suffix}`,
        type: 'checkbox',
        label: 'Rainbow Animation',
        defaultValue: false
      },
      {
        id: `text-rainbow-speed${suffix}`,
        type: 'range',
        label: 'Rainbow Speed',
        defaultValue: 1,
        min: 0.1,
        max: 5,
        step: 0.1,
        showWhen: `animate-text-rainbow${suffix}`,
        description: 'Speed of color cycling'
      }
    ];
  }

  isEnabled(controlValues) {
    const suffix = this.textLineNumber === 1 ? '' : '2';
    return controlValues[`animate-text-rainbow${suffix}`] === true;
  }

  apply(context, controlValues, animState, renderData) {
    if (!animState) return; // Rainbow requires animation

    const suffix = this.textLineNumber === 1 ? '' : '2';

    // Check if ticker is active - if so, ticker handles rendering
    const tickerActive = controlValues[`animate-text-ticker${suffix}`];
    if (tickerActive) {
      return;
    }

    // Check flash visibility - if flash is active and text is invisible, don't render
    const flashActive = controlValues[`animate-text-flash${suffix}`];
    if (flashActive && renderData[`textFlashVisible${suffix}`] === false) {
      return;
    }

    // Get text configuration
    const text = controlValues[`button-text${suffix}`] || '';
    if (!text || text.trim() === '') return;

    // Check if wave is also enabled - if so, skip (wave will handle rainbow)
    if (controlValues[`animate-text-wave${suffix}`]) return;

    const fontSize = controlValues[`font-size${suffix}`] || 12;
    const fontWeight = controlValues[`font-bold${suffix}`] ? 'bold' : 'normal';
    const fontStyle = controlValues[`font-italic${suffix}`] ? 'italic' : 'normal';
    const fontFamily = controlValues[`font-family${suffix}`] || 'Arial';

    const x = (controlValues[`text${suffix}-x`] / 100) * renderData.width;
    const y = (controlValues[`text${suffix}-y`] / 100) * renderData.height;

    const speed = controlValues[`text-rainbow-speed${suffix}`] || 1;

    // Calculate rainbow color
    const hue = (animState.progress * speed * 360) % 360;
    const fillStyle = `hsl(${hue}, 80%, 60%)`;
    const strokeStyle = `hsl(${hue}, 80%, 30%)`;

    // Set font
    context.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}"`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Draw outline if enabled
    if (controlValues[`text${suffix}-outline`]) {
      context.strokeStyle = strokeStyle;
      context.lineWidth = 2;
      context.strokeText(text, x, y);
    }

    // Draw text
    context.fillStyle = fillStyle;
    context.fillText(text, x, y);
  }
}

// Auto-register effect
export function register(generator) {
  generator.registerEffect(new RainbowTextEffect(1));
  generator.registerEffect(new RainbowTextEffect(2));
}

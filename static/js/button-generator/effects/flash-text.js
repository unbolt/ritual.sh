import { ButtonEffect } from '../effect-base.js';

export class FlashTextEffect extends ButtonEffect {
  constructor(textLineNumber = 1) {
    const suffix = textLineNumber === 1 ? '' : '2';
    super({
      id: `text-flash${suffix}`,
      name: `Flash Text ${textLineNumber}`,
      type: textLineNumber === 1 ? 'text' : 'text2',
      category: textLineNumber === 1 ? 'Text Line 1' : 'Text Line 2',
      renderOrder: 1, // Execute very early, before all other text effects
      textLineNumber: textLineNumber
    });
    this.textLineNumber = textLineNumber;
  }

  defineControls() {
    const textLineNumber = this.textLineNumber || this.config?.textLineNumber || 1;
    const suffix = textLineNumber === 1 ? '' : '2';

    return [
      {
        id: `animate-text-flash${suffix}`,
        type: 'checkbox',
        label: 'Flash Visibility',
        defaultValue: false
      },
      {
        id: `flash-range${suffix}`,
        type: 'range-dual',
        label: 'Visible Frame Range',
        defaultValueStart: textLineNumber === 1 ? 0 : 20,
        defaultValueEnd: textLineNumber === 1 ? 19 : 39,
        min: 0,
        max: 39,
        step: 1,
        showWhen: `animate-text-flash${suffix}`,
        description: 'Frame range where text is visible (0-39 frames total)'
      }
    ];
  }

  isEnabled(controlValues) {
    const suffix = this.textLineNumber === 1 ? '' : '2';
    return controlValues[`animate-text-flash${suffix}`] === true;
  }

  apply(context, controlValues, animState, renderData) {
    if (!animState) return; // Flash requires animation

    const suffix = this.textLineNumber === 1 ? '' : '2';
    const startFrame = controlValues[`flash-range${suffix}-start`] || 0;
    const endFrame = controlValues[`flash-range${suffix}-end`] || 39;

    // Check if current frame is within visible range
    const isVisible = this.isFrameVisible(animState.frame, startFrame, endFrame);

    // Store visibility state in renderData so other text effects can check it
    const visibilityKey = `textFlashVisible${suffix}`;
    renderData[visibilityKey] = isVisible;

    // Also set globalAlpha (even though it gets restored, it helps during this effect's lifecycle)
    if (!isVisible) {
      context.globalAlpha = 0;
    }
  }

  /**
   * Check if frame is within visible range
   * @param {number} frame - Current frame number (0-39)
   * @param {number} startFrame - Start of visible range
   * @param {number} endFrame - End of visible range
   * @returns {boolean} - True if frame is in visible range
   */
  isFrameVisible(frame, startFrame, endFrame) {
    // Ensure start is less than or equal to end
    const start = Math.min(startFrame, endFrame);
    const end = Math.max(startFrame, endFrame);

    return frame >= start && frame <= end;
  }
}

// Auto-register effects for both text lines
export function register(generator) {
  generator.registerEffect(new FlashTextEffect(1));
  generator.registerEffect(new FlashTextEffect(2));
}

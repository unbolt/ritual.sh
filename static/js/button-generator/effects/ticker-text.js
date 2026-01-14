import { ButtonEffect } from '../effect-base.js';

/**
 * Ticker text animation effect
 * Makes text scroll across the button in various directions with seamless looping
 */
export class TickerTextEffect extends ButtonEffect {
  constructor(textLineNumber = 1) {
    const suffix = textLineNumber === 1 ? '' : '2';
    super({
      id: `text-ticker${suffix}`,
      name: `Ticker Text ${textLineNumber}`,
      type: textLineNumber === 1 ? 'text' : 'text2',
      category: textLineNumber === 1 ? 'Text Line 1' : 'Text Line 2',
      renderOrder: 12, // After wave(10) and spin(8), before shadow(19) and standard(20)
      textLineNumber: textLineNumber
    });
    this.textLineNumber = textLineNumber;
  }

  defineControls() {
    const textLineNumber = this.textLineNumber || this.config?.textLineNumber || 1;
    const suffix = textLineNumber === 1 ? '' : '2';
    return [
      {
        id: `animate-text-ticker${suffix}`,
        type: 'checkbox',
        label: 'Ticker Scroll',
        defaultValue: false
      },
      {
        id: `ticker-direction${suffix}`,
        type: 'select',
        label: 'Scroll Direction',
        defaultValue: 'left',
        options: [
          { value: 'left', label: 'Right to Left' },
          { value: 'right', label: 'Left to Right' },
          { value: 'up', label: 'Down to Up' },
          { value: 'down', label: 'Up to Down' }
        ],
        showWhen: `animate-text-ticker${suffix}`,
        description: 'Direction of text scrolling'
      }
    ];
  }

  isEnabled(controlValues) {
    const suffix = this.textLineNumber === 1 ? '' : '2';
    return controlValues[`animate-text-ticker${suffix}`] === true;
  }

  apply(context, controlValues, animState, renderData) {
    if (!animState) return; // Ticker requires animation

    const suffix = this.textLineNumber === 1 ? '' : '2';

    // Check flash visibility - if flash is active and text is invisible, don't render
    const flashActive = controlValues[`animate-text-flash${suffix}`];
    if (flashActive && renderData[`textFlashVisible${suffix}`] === false) {
      return;
    }

    // Get text configuration
    const text = controlValues[`button-text${suffix}`] || '';
    if (!text || text.trim() === '') return;

    const fontSize = controlValues[`font-size${suffix}`] || 12;
    const fontWeight = controlValues[`font-bold${suffix}`] ? 'bold' : 'normal';
    const fontStyle = controlValues[`font-italic${suffix}`] ? 'italic' : 'normal';
    const fontFamily = controlValues[`font-family${suffix}`] || 'Arial';

    const baseX = (controlValues[`text${suffix}-x`] / 100) * renderData.width;
    const baseY = (controlValues[`text${suffix}-y`] / 100) * renderData.height;

    const direction = controlValues[`ticker-direction${suffix}`] || 'left';

    // Set font
    context.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}"`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Check if other effects are active
    const waveActive = controlValues[`animate-text-wave${suffix}`];
    const spinActive = controlValues[`animate-text-spin${suffix}`];
    const rainbowActive = controlValues[`animate-text-rainbow${suffix}`];

    // Split text into grapheme clusters (handles emojis properly)
    const chars = this.splitGraphemes(text);

    // Measure total width
    const totalWidth = context.measureText(text).width;

    // Calculate scroll parameters - SIMPLIFIED
    const horizontal = direction === 'left' || direction === 'right';
    const gapSize = 50; // Gap between text repetitions

    // For ticker to work: text must scroll across full screen width PLUS its own width PLUS gap
    // This ensures text fully enters, crosses, and exits with proper spacing
    const copySpacing = horizontal
      ? (renderData.width + totalWidth + gapSize)
      : (renderData.height + fontSize * 2 + gapSize);

    // For a seamless loop, offset scrolls through one full copy spacing in 40 frames
    // At frame 0: offset = 0
    // At frame 39: offset approaches copySpacing (ready to wrap to next copy)
    const offset = animState.progress * copySpacing;

    // Apply direction
    const scrollOffset = {
      x: direction === 'left' ? -offset : (direction === 'right' ? offset : 0),
      y: direction === 'up' ? -offset : (direction === 'down' ? offset : 0)
    };

    // Calculate how many copies we need to fill the screen
    const numCopies = horizontal
      ? Math.ceil(renderData.width / copySpacing) + 3
      : Math.ceil(renderData.height / copySpacing) + 3;

    // Get colors
    const colors = this.getTextColors(context, controlValues, text, baseX, baseY, fontSize, animState, rainbowActive);

    // Set ticker active flag so other effects can skip rendering if needed
    renderData[`tickerActive${suffix}`] = true;

    // Render scrolling text
    this.renderScrollingText(
      context, chars, scrollOffset, numCopies,
      totalWidth, fontSize, copySpacing, horizontal, direction,
      { wave: waveActive, spin: spinActive, rainbow: rainbowActive },
      controlValues, animState, renderData, colors
    );
  }

  /**
   * Split text into grapheme clusters (emoji-safe)
   */
  splitGraphemes(text) {
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
      return Array.from(segmenter.segment(text), s => s.segment);
    } else {
      // Fallback: spread operator handles basic emoji
      return [...text];
    }
  }

  /**
   * Render scrolling text with multiple copies for seamless looping
   */
  renderScrollingText(
    context, chars, scrollOffset, numCopies,
    totalWidth, fontSize, copySpacing, horizontal, direction,
    effects, controlValues, animState, renderData, colors
  ) {
    const suffix = this.textLineNumber === 1 ? '' : '2';

    // Get wave parameters if active
    let waveAmplitude, waveSpeed;
    if (effects.wave) {
      waveAmplitude = controlValues[`wave-amplitude${suffix}`] || 3;
      waveSpeed = controlValues[`wave-speed${suffix}`] || 1;
    }

    // Get spin parameters if active
    let spinSpeed, spinStagger;
    if (effects.spin) {
      spinSpeed = controlValues[`spin-speed${suffix}`] || 1;
      spinStagger = controlValues[`spin-stagger${suffix}`] || 0.3;
    }

    // Get base positioning from controls
    const baseX = (controlValues[`text${suffix}-x`] / 100) * renderData.width;
    const baseY = (controlValues[`text${suffix}-y`] / 100) * renderData.height;

    // Loop through copies - render multiple instances for seamless wrap
    for (let copy = 0; copy < numCopies; copy++) {
      // Each copy is spaced by copySpacing (which includes text width + gap)
      const copyOffsetX = horizontal ? copy * copySpacing : 0;
      const copyOffsetY = !horizontal ? copy * copySpacing : 0;

      // Calculate starting position based on direction
      // The key: text should be fully OFF screen before appearing on the other side
      let startX, startY;

      if (direction === 'left') {
        // Right to left: Position so after scrolling copySpacing left, text fully exits
        // copySpacing = totalWidth + gap
        // Start with left edge at: copySpacing (so right edge is at copySpacing + totalWidth)
        // After scrolling copySpacing left: right edge is at totalWidth (still need to exit more!)
        // Actually: start at renderData.width so left edge begins at right screen edge
        startX = renderData.width;
      } else if (direction === 'right') {
        // Left to right: Start with RIGHT edge of text at left edge of screen
        // Text scrolls right, exits when LEFT edge reaches right edge of screen
        startX = -totalWidth;
      } else if (direction === 'up') {
        // Down to up: Start off-screen below
        startX = baseX - totalWidth / 2; // Center the text horizontally
        startY = renderData.height;
      } else { // down
        // Up to down: Start off-screen above
        startX = baseX - totalWidth / 2; // Center the text horizontally
        startY = -fontSize * 2;
      }

      // Calculate current position with scroll offset and copy offset
      let currentX = startX + scrollOffset.x + copyOffsetX;
      let currentY = horizontal ? baseY : (startY + scrollOffset.y + copyOffsetY);

      // Render each character
      for (let i = 0; i < chars.length; i++) {
        const char = chars[i];
        const charWidth = context.measureText(char).width;
        const charCenterX = currentX + charWidth / 2;
        let charY = currentY;

        // Apply wave effect if active
        let waveY = 0;
        if (effects.wave) {
          const phase = animState.getPhase(waveSpeed);
          const charOffset = i / chars.length;
          waveY = Math.sin(phase + charOffset * Math.PI * 2) * waveAmplitude;
        }

        // Apply spin effect if active
        if (effects.spin) {
          const phase = animState.getPhase(spinSpeed);
          const rotation = (phase + i * spinStagger * Math.PI * 2) % (Math.PI * 2);

          context.save();
          context.translate(charCenterX, charY + waveY);
          context.rotate(rotation);

          // Draw outline if enabled
          if (controlValues[`text${suffix}-outline`]) {
            context.strokeStyle = colors.strokeStyle;
            context.lineWidth = 2;
            context.strokeText(char, 0, 0);
          }

          // Draw character
          context.fillStyle = colors.fillStyle;
          context.fillText(char, 0, 0);
          context.restore();
        } else {
          // No spin - draw normally with wave offset
          const finalY = charY + waveY;

          // Draw outline if enabled
          if (controlValues[`text${suffix}-outline`]) {
            context.strokeStyle = colors.strokeStyle;
            context.lineWidth = 2;
            context.strokeText(char, charCenterX, finalY);
          }

          // Draw character
          context.fillStyle = colors.fillStyle;
          context.fillText(char, charCenterX, finalY);
        }

        currentX += charWidth;
      }
    }
  }

  /**
   * Get text colors (solid, gradient, or rainbow)
   */
  getTextColors(context, controlValues, text, x, y, fontSize, animState, rainbowActive) {
    const suffix = this.textLineNumber === 1 ? '' : '2';

    let fillStyle, strokeStyle;

    // Check if rainbow text is also enabled
    if (animState && rainbowActive) {
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
  generator.registerEffect(new TickerTextEffect(1));
  generator.registerEffect(new TickerTextEffect(2));
}

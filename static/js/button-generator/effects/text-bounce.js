import { ButtonEffect } from "../effect-base.js";

/**
 * Bouncing text animation effect
 * Characters bounce individually with staggered timing
 */
export class BounceTextEffect extends ButtonEffect {
  constructor(textLineNumber = 1) {
    const suffix = textLineNumber === 1 ? "" : "2";
    super({
      id: `text-bounce${suffix}`,
      name: `Bouncing Text ${textLineNumber}`,
      type: textLineNumber === 1 ? "text" : "text2",
      category: textLineNumber === 1 ? "Text Line 1" : "Text Line 2",
      renderOrder: 9, // Between spin (8) and wave (10)
      textLineNumber: textLineNumber,
    });
    this.textLineNumber = textLineNumber;
  }

  defineControls() {
    const textLineNumber =
      this.textLineNumber || this.config?.textLineNumber || 1;
    const suffix = textLineNumber === 1 ? "" : "2";
    return [
      {
        id: `animate-text-bounce${suffix}`,
        type: "checkbox",
        label: "Bounce Animation",
        defaultValue: false,
      },
      {
        id: `bounce-height${suffix}`,
        type: "range",
        label: "Bounce Height",
        defaultValue: 5,
        min: 2,
        max: 15,
        step: 1,
        showWhen: `animate-text-bounce${suffix}`,
        description: "How high characters bounce",
      },
      {
        id: `bounce-speed${suffix}`,
        type: "range",
        label: "Bounce Speed",
        defaultValue: 1.5,
        min: 0.5,
        max: 3,
        step: 0.1,
        showWhen: `animate-text-bounce${suffix}`,
        description: "Speed of bounce animation",
      },
      {
        id: `bounce-stagger${suffix}`,
        type: "range",
        label: "Stagger",
        defaultValue: 0.15,
        min: 0,
        max: 0.5,
        step: 0.05,
        showWhen: `animate-text-bounce${suffix}`,
        description: "Delay between character bounces",
      },
    ];
  }

  isEnabled(controlValues) {
    const suffix = this.textLineNumber === 1 ? "" : "2";
    return controlValues[`animate-text-bounce${suffix}`] === true;
  }

  apply(context, controlValues, animState, renderData) {
    const suffix = this.textLineNumber === 1 ? "" : "2";

    // Check if ticker is active - if so, ticker handles rendering
    const tickerActive = controlValues[`animate-text-ticker${suffix}`];
    if (tickerActive) {
      return;
    }

    // Check flash visibility
    const flashActive = controlValues[`animate-text-flash${suffix}`];
    if (flashActive && renderData[`textFlashVisible${suffix}`] === false) {
      return;
    }

    const text = controlValues[`button-text${suffix}`] || "";
    if (!text || text.trim() === "") return;
    if (!animState) return;

    const bounceHeight = controlValues[`bounce-height${suffix}`] || 5;
    const speed = controlValues[`bounce-speed${suffix}`] || 1.5;
    const stagger = controlValues[`bounce-stagger${suffix}`] || 0.15;
    const fontSize = controlValues[`font-size${suffix}`] || 14;
    const fontFamily = controlValues[`font-family${suffix}`] || "Arial";
    const fontWeight = controlValues[`text${suffix}-bold`] ? "bold" : "normal";
    const fontStyle = controlValues[`text${suffix}-italic`] ? "italic" : "normal";

    context.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}"`;
    context.textAlign = "center";
    context.textBaseline = "middle";

    // Get text color
    let fillStyle;
    const colorType = controlValues[`text${suffix}-color-type`] || "solid";
    if (colorType === "gradient") {
      const color1 = controlValues[`text${suffix}-gradient-color1`] || "#ffffff";
      const color2 = controlValues[`text${suffix}-gradient-color2`] || "#00ffff";
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
      fillStyle = controlValues[`text${suffix}-color`] || "#ffffff";
    }

    // Check for rainbow text effect
    const rainbowActive = controlValues[`animate-text-rainbow${suffix}`];

    // Calculate base position
    const x = controlValues[`text${suffix}-x`] || 50;
    const y = controlValues[`text${suffix}-y`] || 50;
    const baseX = (x / 100) * renderData.width;
    const baseY = (y / 100) * renderData.height;

    // Split text into grapheme clusters (handles emojis properly)
    let chars;
    if (typeof Intl !== "undefined" && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
      chars = Array.from(segmenter.segment(text), (s) => s.segment);
    } else {
      chars = [...text];
    }

    // Measure total text width for centering
    const totalWidth = context.measureText(text).width;
    let currentX = baseX - totalWidth / 2;

    // Draw each character with bounce
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      const charWidth = context.measureText(char).width;
      const charCenterX = currentX + charWidth / 2;

      // Calculate bounce offset for this character
      // Use abs(sin) for bounce motion (always goes up, sharp at bottom)
      const phase = animState.getPhase(speed) + i * stagger * Math.PI * 2;
      const bounceOffset = -Math.abs(Math.sin(phase)) * bounceHeight;

      context.save();

      // Apply outline if enabled
      if (controlValues[`text${suffix}-outline`]) {
        context.strokeStyle = controlValues[`text${suffix}-outline-color`] || "#000000";
        context.lineWidth = 2;
        context.strokeText(char, charCenterX, baseY + bounceOffset);
      }

      // Handle rainbow color per character
      if (rainbowActive) {
        const rainbowSpeed = controlValues[`text-rainbow-speed${suffix}`] || 1;
        const hue = ((animState.progress * rainbowSpeed * 360) + (i * 30)) % 360;
        context.fillStyle = `hsl(${hue}, 80%, 60%)`;
      } else {
        context.fillStyle = fillStyle;
      }

      context.fillText(char, charCenterX, baseY + bounceOffset);
      context.restore();

      currentX += charWidth;
    }
  }
}

export function register(generator) {
  generator.registerEffect(new BounceTextEffect(1));
  generator.registerEffect(new BounceTextEffect(2));
}

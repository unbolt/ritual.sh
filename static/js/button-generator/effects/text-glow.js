import { ButtonEffect } from "../effect-base.js";

/**
 * Neon glow text effect
 * Pulsing outer glow - cyberpunk/cool site aesthetic
 */
export class TextGlowEffect extends ButtonEffect {
  constructor(textLineNumber = 1) {
    const suffix = textLineNumber === 1 ? "" : "2";
    super({
      id: `text-glow${suffix}`,
      name: `Glow Text ${textLineNumber}`,
      type: textLineNumber === 1 ? "text" : "text2",
      category: textLineNumber === 1 ? "Text Line 1" : "Text Line 2",
      renderOrder: 18, // Before standard text at 20
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
        id: `animate-text-glow${suffix}`,
        type: "checkbox",
        label: "Neon Glow",
        defaultValue: false,
      },
      {
        id: `glow-color${suffix}`,
        type: "color",
        label: "Glow Color",
        defaultValue: "#00ffff",
        showWhen: `animate-text-glow${suffix}`,
        description: "Color of the glow effect",
      },
      {
        id: `glow-blur${suffix}`,
        type: "range",
        label: "Glow Size",
        defaultValue: 8,
        min: 2,
        max: 20,
        step: 1,
        showWhen: `animate-text-glow${suffix}`,
        description: "Size of the glow blur",
      },
      {
        id: `glow-intensity${suffix}`,
        type: "range",
        label: "Intensity",
        defaultValue: 1,
        min: 0.5,
        max: 2,
        step: 0.1,
        showWhen: `animate-text-glow${suffix}`,
        description: "Glow brightness",
      },
      {
        id: `glow-pulse${suffix}`,
        type: "checkbox",
        label: "Pulse Animation",
        defaultValue: true,
        showWhen: `animate-text-glow${suffix}`,
        description: "Animate the glow",
      },
      {
        id: `glow-pulse-speed${suffix}`,
        type: "range",
        label: "Pulse Speed",
        defaultValue: 1,
        min: 0.5,
        max: 3,
        step: 0.1,
        showWhen: `animate-text-glow${suffix}`,
        description: "Speed of pulse animation",
      },
    ];
  }

  isEnabled(controlValues) {
    const suffix = this.textLineNumber === 1 ? "" : "2";
    return controlValues[`animate-text-glow${suffix}`] === true;
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

    const glowColor = controlValues[`glow-color${suffix}`] || "#00ffff";
    const baseBlur = controlValues[`glow-blur${suffix}`] || 8;
    const intensity = controlValues[`glow-intensity${suffix}`] || 1;
    const pulse = controlValues[`glow-pulse${suffix}`] !== false;
    const pulseSpeed = controlValues[`glow-pulse-speed${suffix}`] || 1;

    // Calculate pulse multiplier
    let pulseMultiplier = 1;
    if (pulse && animState) {
      const phase = animState.getPhase(pulseSpeed);
      pulseMultiplier = 0.6 + Math.sin(phase) * 0.4;
    }

    const blur = baseBlur * pulseMultiplier;

    // Get font settings
    const fontSize = controlValues[`font-size${suffix}`] || 14;
    const fontFamily = controlValues[`font-family${suffix}`] || "Arial";
    const fontWeight = controlValues[`text${suffix}-bold`] ? "bold" : "normal";
    const fontStyle = controlValues[`text${suffix}-italic`] ? "italic" : "normal";

    context.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}"`;
    context.textAlign = "center";
    context.textBaseline = "middle";

    // Get text color
    let textColor;
    const colorType = controlValues[`text${suffix}-color-type`] || "solid";
    if (colorType === "gradient") {
      textColor = controlValues[`text${suffix}-gradient-color1`] || "#ffffff";
    } else {
      textColor = controlValues[`text${suffix}-color`] || "#ffffff";
    }

    // Calculate position
    const x = controlValues[`text${suffix}-x`] || 50;
    const y = controlValues[`text${suffix}-y`] || 50;
    const posX = (x / 100) * renderData.width;
    const posY = (y / 100) * renderData.height;

    context.save();

    // Draw glow layers (multiple passes for stronger glow)
    const passes = Math.ceil(intensity * 3);
    for (let i = 0; i < passes; i++) {
      context.shadowColor = glowColor;
      context.shadowBlur = blur * (1 + i * 0.3);
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
      context.fillStyle = glowColor;
      context.globalAlpha = 0.3 * intensity * pulseMultiplier;
      context.fillText(text, posX, posY);
    }

    // Draw outline if enabled
    if (controlValues[`text${suffix}-outline`]) {
      context.globalAlpha = 1;
      context.shadowBlur = 0;
      context.strokeStyle = controlValues[`text${suffix}-outline-color`] || "#000000";
      context.lineWidth = 2;
      context.strokeText(text, posX, posY);
    }

    // Draw main text with subtle glow
    context.globalAlpha = 1;
    context.shadowColor = glowColor;
    context.shadowBlur = blur * 0.5;

    // Handle gradient fill
    if (colorType === "gradient") {
      const color1 = controlValues[`text${suffix}-gradient-color1`] || "#ffffff";
      const color2 = controlValues[`text${suffix}-gradient-color2`] || "#00ffff";
      const angle = (controlValues[`text${suffix}-gradient-angle`] || 90) * (Math.PI / 180);
      const textWidth = context.measureText(text).width;
      const x1 = posX + Math.cos(angle) * textWidth * 0.5;
      const y1 = posY + Math.sin(angle) * fontSize * 0.5;
      const x2 = posX - Math.cos(angle) * textWidth * 0.5;
      const y2 = posY - Math.sin(angle) * fontSize * 0.5;
      const gradient = context.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, color1);
      gradient.addColorStop(1, color2);
      context.fillStyle = gradient;
    } else {
      context.fillStyle = textColor;
    }

    context.fillText(text, posX, posY);

    context.restore();
  }
}

export function register(generator) {
  generator.registerEffect(new TextGlowEffect(1));
  generator.registerEffect(new TextGlowEffect(2));
}

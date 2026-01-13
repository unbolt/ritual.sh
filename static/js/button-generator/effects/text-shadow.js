import { ButtonEffect } from "../effect-base.js";

/**
 * Text Drop Shadow Effect
 * Renders text with a drop shadow underneath
 * This draws the shadow first, then standard text rendering draws on top
 */
export class TextShadowEffect extends ButtonEffect {
  constructor(textLineNumber = 1) {
    const suffix = textLineNumber === 1 ? "" : "2";
    super({
      id: `text-shadow${suffix}`,
      name: `Drop Shadow ${textLineNumber}`,
      type: textLineNumber === 1 ? "text" : "text2",
      category: textLineNumber === 1 ? "Text Line 1" : "Text Line 2",
      renderOrder: 19, // Before standard text (20), so shadow draws first
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
        id: `text${suffix}-shadow-enabled`,
        type: "checkbox",
        label: "Drop Shadow",
        defaultValue: false,
        description:
          "Add drop shadow to text - Not compatible with other text effects!!",
      },
      {
        id: `text${suffix}-shadow-color`,
        type: "color",
        label: "Shadow Color",
        defaultValue: "#000000",
        showWhen: `text${suffix}-shadow-enabled`,
        description: "Color of the shadow",
      },
      {
        id: `text${suffix}-shadow-blur`,
        type: "range",
        label: "Shadow Blur",
        defaultValue: 4,
        min: 0,
        max: 10,
        step: 1,
        showWhen: `text${suffix}-shadow-enabled`,
        description: "Blur radius of shadow",
      },
      {
        id: `text${suffix}-shadow-offset-x`,
        type: "range",
        label: "Shadow X Offset",
        defaultValue: 2,
        min: -10,
        max: 10,
        step: 1,
        showWhen: `text${suffix}-shadow-enabled`,
        description: "Horizontal shadow offset",
      },
      {
        id: `text${suffix}-shadow-offset-y`,
        type: "range",
        label: "Shadow Y Offset",
        defaultValue: 2,
        min: -10,
        max: 10,
        step: 1,
        showWhen: `text${suffix}-shadow-enabled`,
        description: "Vertical shadow offset",
      },
      {
        id: `text${suffix}-shadow-opacity`,
        type: "range",
        label: "Shadow Opacity",
        defaultValue: 0.8,
        min: 0,
        max: 1,
        step: 0.1,
        showWhen: `text${suffix}-shadow-enabled`,
        description: "Opacity of the shadow",
      },
    ];
  }

  isEnabled(controlValues) {
    const suffix = this.textLineNumber === 1 ? "" : "2";
    const text = controlValues[`button-text${suffix}`];
    const shadowEnabled = controlValues[`text${suffix}-shadow-enabled`];
    return text && text.trim() !== "" && shadowEnabled;
  }

  apply(context, controlValues, animState, renderData) {
    const suffix = this.textLineNumber === 1 ? "" : "2";

    // Check flash visibility - if flash is active and text is invisible, don't render
    const flashActive = controlValues[`animate-text-flash${suffix}`];
    if (flashActive && renderData[`textFlashVisible${suffix}`] === false) {
      return;
    }

    const text = controlValues[`button-text${suffix}`] || "";
    if (!text) return;

    // Get shadow settings
    const shadowColor =
      controlValues[`text${suffix}-shadow-color`] || "#000000";
    const shadowBlur = controlValues[`text${suffix}-shadow-blur`] || 4;
    const shadowOffsetX = controlValues[`text${suffix}-shadow-offset-x`] || 2;
    const shadowOffsetY = controlValues[`text${suffix}-shadow-offset-y`] || 2;
    const shadowOpacity = controlValues[`text${suffix}-shadow-opacity`] || 0.8;

    // Get text rendering settings
    const fontSize = controlValues[`font-size${suffix}`] || 14;
    const fontFamily = controlValues[`font-family${suffix}`] || "Arial";
    const fontWeight = controlValues[`text${suffix}-bold`] ? "bold" : "normal";
    const fontStyle = controlValues[`text${suffix}-italic`]
      ? "italic"
      : "normal";
    const textX = (controlValues[`text${suffix}-x`] || 50) / 100;
    const textY = (controlValues[`text${suffix}-y`] || 50) / 100;

    // Convert hex to rgba
    const hexToRgba = (hex, alpha) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (result) {
        const r = parseInt(result[1], 16);
        const g = parseInt(result[2], 16);
        const b = parseInt(result[3], 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
      return `rgba(0, 0, 0, ${alpha})`;
    };

    // Set up text rendering
    context.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}"`;
    context.textAlign = "center";
    context.textBaseline = "middle";

    // Calculate text position
    const x = renderData.width * textX;
    const y = renderData.height * textY;

    // Draw the shadow using the shadow API
    // This will create a shadow underneath whatever we draw
    context.shadowColor = hexToRgba(shadowColor, shadowOpacity);
    context.shadowBlur = shadowBlur;
    context.shadowOffsetX = shadowOffsetX;
    context.shadowOffsetY = shadowOffsetY;

    // Draw a solid shadow by filling with the shadow color
    // The shadow API will create the blur effect
    context.fillStyle = hexToRgba(shadowColor, shadowOpacity);
    context.fillText(text, x, y);

    // Reset shadow for subsequent renders
    context.shadowColor = "transparent";
    context.shadowBlur = 0;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
  }
}

// Export two instances for text line 1 and text line 2
export function register(generator) {
  generator.registerEffect(new TextShadowEffect(1));
  generator.registerEffect(new TextShadowEffect(2));
}

import { ButtonEffect } from "../effect-base.js";

/**
 * Emboss/Bevel border effect
 * Classic Windows 95/98 raised button appearance
 */
export class EmbossEffect extends ButtonEffect {
  constructor() {
    super({
      id: "emboss",
      name: "Emboss/Bevel",
      type: "general",
      category: "Visual Effects",
      renderOrder: 95, // After everything, draws on top
    });
  }

  defineControls() {
    return [
      {
        id: "enable-emboss",
        type: "checkbox",
        label: "Emboss/Bevel Effect",
        defaultValue: false,
      },
      {
        id: "emboss-style",
        type: "select",
        label: "Style",
        defaultValue: "raised",
        options: [
          { value: "raised", label: "Raised (Outset)" },
          { value: "sunken", label: "Sunken (Inset)" },
          { value: "ridge", label: "Ridge" },
          { value: "groove", label: "Groove" },
        ],
        showWhen: "enable-emboss",
        description: "Type of bevel effect",
      },
      {
        id: "emboss-depth",
        type: "range",
        label: "Depth",
        defaultValue: 2,
        min: 1,
        max: 4,
        step: 1,
        showWhen: "enable-emboss",
        description: "Thickness of bevel in pixels",
      },
      {
        id: "emboss-light-color",
        type: "color",
        label: "Highlight Color",
        defaultValue: "#ffffff",
        showWhen: "enable-emboss",
        description: "Color for lit edges",
      },
      {
        id: "emboss-shadow-color",
        type: "color",
        label: "Shadow Color",
        defaultValue: "#000000",
        showWhen: "enable-emboss",
        description: "Color for shadowed edges",
      },
    ];
  }

  isEnabled(controlValues) {
    return controlValues["enable-emboss"] === true;
  }

  /**
   * Parse hex color to rgba string with alpha
   */
  colorWithAlpha(hex, alpha) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return `rgba(255, 255, 255, ${alpha})`;
  }

  /**
   * Draw a single bevel layer
   */
  drawBevel(
    context,
    width,
    height,
    offset,
    lightColor,
    shadowColor,
    lightAlpha,
    shadowAlpha,
  ) {
    // Top edge (light)
    context.fillStyle = this.colorWithAlpha(lightColor, lightAlpha);
    context.fillRect(offset, offset, width - offset * 2, 1);

    // Left edge (light)
    context.fillRect(offset, offset, 1, height - offset * 2);

    // Bottom edge (shadow)
    context.fillStyle = this.colorWithAlpha(shadowColor, shadowAlpha);
    context.fillRect(offset, height - 1 - offset, width - offset * 2, 1);

    // Right edge (shadow)
    context.fillRect(width - 1 - offset, offset, 1, height - offset * 2);
  }

  apply(context, controlValues, animState, renderData) {
    const style = controlValues["emboss-style"] || "raised";
    const depth = controlValues["emboss-depth"] || 2;
    const lightColor = controlValues["emboss-light-color"] || "#ffffff";
    const shadowColor = controlValues["emboss-shadow-color"] || "#000000";

    const { width, height } = renderData;

    context.save();

    // Calculate alpha falloff for each layer (outer layers more opaque)
    const getAlpha = (layer, totalLayers) => {
      return 0.3 + (0.5 * (totalLayers - layer)) / totalLayers;
    };

    switch (style) {
      case "raised":
        // Light on top/left, shadow on bottom/right
        for (let i = 0; i < depth; i++) {
          const alpha = getAlpha(i, depth);
          this.drawBevel(
            context,
            width,
            height,
            i,
            lightColor,
            shadowColor,
            alpha,
            alpha,
          );
        }
        break;

      case "sunken":
        // Shadow on top/left, light on bottom/right (swap colors)
        for (let i = 0; i < depth; i++) {
          const alpha = getAlpha(i, depth);
          this.drawBevel(
            context,
            width,
            height,
            i,
            shadowColor,
            lightColor,
            alpha,
            alpha,
          );
        }
        break;

      case "ridge":
        // Raised outer, sunken inner
        const ridgeOuter = Math.ceil(depth / 2);
        const ridgeInner = Math.floor(depth / 2);

        // Outer raised bevel
        for (let i = 0; i < ridgeOuter; i++) {
          const alpha = getAlpha(i, ridgeOuter);
          this.drawBevel(
            context,
            width,
            height,
            i,
            lightColor,
            shadowColor,
            alpha,
            alpha,
          );
        }

        // Inner sunken bevel
        for (let i = 0; i < ridgeInner; i++) {
          const alpha = getAlpha(i, ridgeInner);
          this.drawBevel(
            context,
            width,
            height,
            ridgeOuter + i,
            shadowColor,
            lightColor,
            alpha,
            alpha,
          );
        }
        break;

      case "groove":
        // Sunken outer, raised inner (opposite of ridge)
        const grooveOuter = Math.ceil(depth / 2);
        const grooveInner = Math.floor(depth / 2);

        // Outer sunken bevel
        for (let i = 0; i < grooveOuter; i++) {
          const alpha = getAlpha(i, grooveOuter);
          this.drawBevel(
            context,
            width,
            height,
            i,
            shadowColor,
            lightColor,
            alpha,
            alpha,
          );
        }

        // Inner raised bevel
        for (let i = 0; i < grooveInner; i++) {
          const alpha = getAlpha(i, grooveInner);
          this.drawBevel(
            context,
            width,
            height,
            grooveOuter + i,
            lightColor,
            shadowColor,
            alpha,
            alpha,
          );
        }
        break;
    }

    context.restore();
  }
}

export function register(generator) {
  generator.registerEffect(new EmbossEffect());
}

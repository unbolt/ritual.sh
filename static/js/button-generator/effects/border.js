import { ButtonEffect } from "../effect-base.js";

/**
 * Border effect
 * Draws borders around the button with various styles
 */
export class BorderEffect extends ButtonEffect {
  constructor() {
    super({
      id: "border",
      name: "Border",
      type: "border",
      category: "Border",
      renderOrder: 10,
    });
  }

  defineControls() {
    return [
      {
        id: "border-width",
        type: "range",
        label: "Border Width",
        defaultValue: 2,
        min: 0,
        max: 5,
        step: 1,
        description: "Width of border in pixels",
      },
      {
        id: "border-color",
        type: "color",
        label: "Border Color",
        defaultValue: "#000000",
      },
      {
        id: "border-style",
        type: "select",
        label: "Border Style",
        defaultValue: "solid",
        options: [
          { value: "solid", label: "Solid" },
          { value: "dashed", label: "Dashed" },
          { value: "dotted", label: "Dotted" },
          { value: "double", label: "Double" },
          { value: "inset", label: "Inset (3D)" },
          { value: "outset", label: "Outset (3D)" },
          { value: "ridge", label: "Ridge" },
          { value: "rainbow", label: "Rainbow (Animated)" },
          { value: "marching-ants", label: "Marching Ants" },
          { value: "checkerboard", label: "Checkerboard" },
        ],
      },
      {
        id: "border-rainbow-speed",
        type: "range",
        label: "Rainbow Speed",
        defaultValue: 1,
        min: 1,
        max: 3,
        step: 1,
        showWhen: "border-style",
        description: "Speed of rainbow animation",
      },
      {
        id: "border-march-speed",
        type: "range",
        label: "March Speed",
        defaultValue: 1,
        min: 1,
        max: 3,
        step: 1,
        showWhen: "border-style",
        description: "Speed of marching animation",
      },
    ];
  }

  isEnabled(controlValues) {
    const width = controlValues["border-width"] || 0;
    return width > 0;
  }

  apply(context, controlValues, animState, renderData) {
    const width = controlValues["border-width"] || 0;
    if (width === 0) return;

    const color = controlValues["border-color"] || "#000000";
    const style = controlValues["border-style"] || "solid";

    if (style === "solid") {
      this.drawSolidBorder(context, width, color, renderData);
    } else if (style === "dashed") {
      this.drawDashedBorder(context, width, color, renderData);
    } else if (style === "dotted") {
      this.drawDottedBorder(context, width, color, renderData);
    } else if (style === "double") {
      this.drawDoubleBorder(context, width, color, renderData);
    } else if (style === "inset" || style === "outset") {
      this.draw3DBorder(context, width, color, style === "outset", renderData);
    } else if (style === "ridge") {
      this.drawRidgeBorder(context, width, renderData);
    } else if (style === "rainbow") {
      const speed = controlValues["border-rainbow-speed"] || 1;
      this.drawRainbowBorder(context, width, animState, speed, renderData);
    } else if (style === "marching-ants") {
      const speed = controlValues["border-march-speed"] || 1;
      this.drawMarchingAntsBorder(context, width, animState, speed, renderData);
    } else if (style === "checkerboard") {
      this.drawCheckerboardBorder(context, width, color, renderData);
    }
  }

  /**
   * Draw solid border
   */
  drawSolidBorder(context, width, color, renderData) {
    context.strokeStyle = color;
    context.lineWidth = width;
    context.strokeRect(
      width / 2,
      width / 2,
      renderData.width - width,
      renderData.height - width,
    );
  }

  /**
   * Draw 3D inset/outset border
   */
  draw3DBorder(context, width, color, isOutset, renderData) {
    const w = renderData.width;
    const h = renderData.height;
    const t = width;

    const normalized = color.toLowerCase();
    const isPureBlack = normalized === "#000000";
    const isPureWhite = normalized === "#ffffff";

    let lightColor;
    let darkColor;

    if (isPureBlack || isPureWhite) {
      lightColor = isOutset ? "#ffffff" : "#000000";
      darkColor = isOutset ? "#000000" : "#ffffff";
    } else {
      const lighter = this.adjustColor(color, 0.25);
      const darker = this.adjustColor(color, -0.25);

      lightColor = isOutset ? lighter : darker;
      darkColor = isOutset ? darker : lighter;
    }

    context.fillStyle = lightColor;
    context.fillRect(0, 0, w - t, t);
    context.fillRect(0, t, t, h - t);

    context.fillStyle = darkColor;
    context.fillRect(t, h - t, w - t, t);
    context.fillRect(w - t, 0, t, h - t);

    this.drawBevelCorners(context, t, w, h, lightColor, darkColor, isOutset);
  }

  drawBevelCorners(ctx, t, w, h, light, dark, isOutset) {
    // Top-left corner
    ctx.fillStyle = dark;
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(t, h);
    ctx.lineTo(t, h - t);
    ctx.closePath();
    ctx.fill();

    // Bottom-right corner
    ctx.fillStyle = light;
    ctx.beginPath();
    ctx.moveTo(w - t, 0);
    ctx.lineTo(w - t, t);
    ctx.lineTo(w, 0);
    ctx.closePath();
    ctx.fill();
  }

  /**
   * Draw ridge border (double 3D effect)
   */
  drawRidgeBorder(context, width, renderData) {
    // Outer ridge (light)
    context.strokeStyle = "#ffffff";
    context.lineWidth = width / 2;
    context.strokeRect(
      width / 4,
      width / 4,
      renderData.width - width / 2,
      renderData.height - width / 2,
    );

    // Inner ridge (dark)
    context.strokeStyle = "#000000";
    context.strokeRect(
      (width * 3) / 4,
      (width * 3) / 4,
      renderData.width - width * 1.5,
      renderData.height - width * 1.5,
    );
  }

  adjustColor(hex, amount) {
    // hex: "#rrggbb", amount: -1.0 .. 1.0
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    const adjust = (c) =>
      Math.min(255, Math.max(0, Math.round(c + amount * 255)));

    r = adjust(r);
    g = adjust(g);
    b = adjust(b);

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  /**
   * Draw dashed border
   */
  drawDashedBorder(context, width, color, renderData) {
    context.strokeStyle = color;
    context.lineWidth = width;
    context.setLineDash([6, 3]); // 6px dash, 3px gap
    context.strokeRect(
      width / 2,
      width / 2,
      renderData.width - width,
      renderData.height - width
    );
    context.setLineDash([]); // Reset to solid
  }

  /**
   * Draw dotted border
   */
  drawDottedBorder(context, width, color, renderData) {
    context.strokeStyle = color;
    context.lineWidth = width;
    context.setLineDash([2, 3]); // 2px dot, 3px gap
    context.lineCap = "round";
    context.strokeRect(
      width / 2,
      width / 2,
      renderData.width - width,
      renderData.height - width
    );
    context.setLineDash([]); // Reset to solid
    context.lineCap = "butt";
  }

  /**
   * Draw double border
   */
  drawDoubleBorder(context, width, color, renderData) {
    const gap = Math.max(1, Math.floor(width / 3));
    const lineWidth = Math.max(1, Math.floor((width - gap) / 2));

    context.strokeStyle = color;
    context.lineWidth = lineWidth;

    // Outer border
    context.strokeRect(
      lineWidth / 2,
      lineWidth / 2,
      renderData.width - lineWidth,
      renderData.height - lineWidth
    );

    // Inner border
    const innerOffset = lineWidth + gap;
    context.strokeRect(
      innerOffset + lineWidth / 2,
      innerOffset + lineWidth / 2,
      renderData.width - innerOffset * 2 - lineWidth,
      renderData.height - innerOffset * 2 - lineWidth
    );
  }

  /**
   * Draw rainbow animated border
   */
  drawRainbowBorder(context, width, animState, speed, renderData) {
    if (!animState) {
      // Fallback to solid if no animation
      this.drawSolidBorder(context, width, "#ff0000", renderData);
      return;
    }

    const hue = (animState.progress * speed * 360) % 360;
    const color = `hsl(${hue}, 80%, 50%)`;

    context.strokeStyle = color;
    context.lineWidth = width;
    context.strokeRect(
      width / 2,
      width / 2,
      renderData.width - width,
      renderData.height - width
    );
  }

  /**
   * Draw marching ants animated border
   */
  drawMarchingAntsBorder(context, width, animState, speed, renderData) {
    if (!animState) {
      // Fallback to dashed if no animation
      this.drawDashedBorder(context, width, "#000000", renderData);
      return;
    }

    // Animate the dash offset using phase for smooth looping
    const phase = animState.getPhase(speed);
    const dashLength = 9; // 4px dash + 5px gap = 9px total
    const offset = (phase / (Math.PI * 2)) * dashLength;

    context.strokeStyle = "#000000";
    context.lineWidth = width;
    context.setLineDash([4, 5]);
    context.lineDashOffset = -offset;
    context.strokeRect(
      width / 2,
      width / 2,
      renderData.width - width,
      renderData.height - width
    );
    context.setLineDash([]);
    context.lineDashOffset = 0;
  }

  /**
   * Draw checkerboard border
   */
  drawCheckerboardBorder(context, width, color, renderData) {
    const squareSize = Math.max(2, width);
    const w = renderData.width;
    const h = renderData.height;

    // Parse the color
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    // Create light and dark versions
    const darkColor = color;
    const lightColor = `rgb(${Math.min(255, r + 60)}, ${Math.min(
      255,
      g + 60
    )}, ${Math.min(255, b + 60)})`;

    // Draw checkerboard on all four sides
    // Top
    for (let x = 0; x < w; x += squareSize) {
      for (let y = 0; y < width; y += squareSize) {
        const checker = Math.floor(x / squareSize + y / squareSize) % 2;
        context.fillStyle = checker === 0 ? darkColor : lightColor;
        context.fillRect(x, y, squareSize, squareSize);
      }
    }

    // Bottom
    for (let x = 0; x < w; x += squareSize) {
      for (let y = h - width; y < h; y += squareSize) {
        const checker = Math.floor(x / squareSize + y / squareSize) % 2;
        context.fillStyle = checker === 0 ? darkColor : lightColor;
        context.fillRect(x, y, squareSize, squareSize);
      }
    }

    // Left
    for (let x = 0; x < width; x += squareSize) {
      for (let y = width; y < h - width; y += squareSize) {
        const checker = Math.floor(x / squareSize + y / squareSize) % 2;
        context.fillStyle = checker === 0 ? darkColor : lightColor;
        context.fillRect(x, y, squareSize, squareSize);
      }
    }

    // Right
    for (let x = w - width; x < w; x += squareSize) {
      for (let y = width; y < h - width; y += squareSize) {
        const checker = Math.floor(x / squareSize + y / squareSize) % 2;
        context.fillStyle = checker === 0 ? darkColor : lightColor;
        context.fillRect(x, y, squareSize, squareSize);
      }
    }
  }
}

// Auto-register effect
export function register(generator) {
  generator.registerEffect(new BorderEffect());
}

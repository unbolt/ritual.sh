import { ButtonEffect } from '../effect-base.js';

/**
 * Border effect
 * Draws borders around the button with various styles
 */
export class BorderEffect extends ButtonEffect {
  constructor() {
    super({
      id: 'border',
      name: 'Border',
      type: 'border',
      category: 'Border',
      renderOrder: 10
    });
  }

  defineControls() {
    return [
      {
        id: 'border-width',
        type: 'range',
        label: 'Border Width',
        defaultValue: 2,
        min: 0,
        max: 5,
        step: 1,
        description: 'Width of border in pixels'
      },
      {
        id: 'border-color',
        type: 'color',
        label: 'Border Color',
        defaultValue: '#000000'
      },
      {
        id: 'border-style',
        type: 'select',
        label: 'Border Style',
        defaultValue: 'solid',
        options: [
          { value: 'solid', label: 'Solid' },
          { value: 'inset', label: 'Inset (3D)' },
          { value: 'outset', label: 'Outset (3D)' },
          { value: 'ridge', label: 'Ridge' }
        ]
      }
    ];
  }

  isEnabled(controlValues) {
    const width = controlValues['border-width'] || 0;
    return width > 0;
  }

  apply(context, controlValues, animState, renderData) {
    const width = controlValues['border-width'] || 0;
    if (width === 0) return;

    const color = controlValues['border-color'] || '#000000';
    const style = controlValues['border-style'] || 'solid';

    if (style === 'solid') {
      this.drawSolidBorder(context, width, color, renderData);
    } else if (style === 'inset' || style === 'outset') {
      this.draw3DBorder(context, width, style === 'outset', renderData);
    } else if (style === 'ridge') {
      this.drawRidgeBorder(context, width, renderData);
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
      renderData.height - width
    );
  }

  /**
   * Draw 3D inset/outset border
   */
  draw3DBorder(context, width, isOutset, renderData) {
    const lightColor = isOutset ? '#ffffff' : '#000000';
    const darkColor = isOutset ? '#000000' : '#ffffff';

    // Top and left (light)
    context.strokeStyle = lightColor;
    context.lineWidth = width;
    context.beginPath();
    context.moveTo(0, renderData.height);
    context.lineTo(0, 0);
    context.lineTo(renderData.width, 0);
    context.stroke();

    // Bottom and right (dark)
    context.strokeStyle = darkColor;
    context.beginPath();
    context.moveTo(renderData.width, 0);
    context.lineTo(renderData.width, renderData.height);
    context.lineTo(0, renderData.height);
    context.stroke();
  }

  /**
   * Draw ridge border (double 3D effect)
   */
  drawRidgeBorder(context, width, renderData) {
    // Outer ridge (light)
    context.strokeStyle = '#ffffff';
    context.lineWidth = width / 2;
    context.strokeRect(
      width / 4,
      width / 4,
      renderData.width - width / 2,
      renderData.height - width / 2
    );

    // Inner ridge (dark)
    context.strokeStyle = '#000000';
    context.strokeRect(
      (width * 3) / 4,
      (width * 3) / 4,
      renderData.width - width * 1.5,
      renderData.height - width * 1.5
    );
  }
}

// Auto-register effect
export function register(generator) {
  generator.registerEffect(new BorderEffect());
}

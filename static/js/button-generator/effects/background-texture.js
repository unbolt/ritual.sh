import { ButtonEffect } from '../effect-base.js';

/**
 * Texture background effect
 * Provides various procedural texture patterns
 */
export class TextureBackgroundEffect extends ButtonEffect {
  constructor() {
    super({
      id: 'bg-texture',
      name: 'Texture Background',
      type: 'background',
      category: 'Background',
      renderOrder: 1
    });
  }

  defineControls() {
    return [
      {
        id: 'texture-type',
        type: 'select',
        label: 'Texture Type',
        defaultValue: 'dots',
        showWhen: 'bg-type',
        options: [
          { value: 'dots', label: 'Dots' },
          { value: 'grid', label: 'Grid' },
          { value: 'diagonal', label: 'Diagonal Lines' },
          { value: 'checkerboard', label: 'Checkerboard' },
          { value: 'noise', label: 'Noise' },
          { value: 'stars', label: 'Stars' }
        ]
      },
      {
        id: 'texture-color1',
        type: 'color',
        label: 'Texture Color 1',
        defaultValue: '#000000',
        showWhen: 'bg-type',
        description: 'Base color'
      },
      {
        id: 'texture-color2',
        type: 'color',
        label: 'Texture Color 2',
        defaultValue: '#ffffff',
        showWhen: 'bg-type',
        description: 'Pattern color'
      },
      {
        id: 'texture-scale',
        type: 'range',
        label: 'Texture Scale',
        defaultValue: 50,
        min: 10,
        max: 100,
        step: 5,
        showWhen: 'bg-type',
        description: 'Size/density of pattern'
      }
    ];
  }

  isEnabled(controlValues) {
    return controlValues['bg-type'] === 'texture';
  }

  apply(context, controlValues, animState, renderData) {
    const type = controlValues['texture-type'] || 'dots';
    const color1 = controlValues['texture-color1'] || '#000000';
    const color2 = controlValues['texture-color2'] || '#ffffff';
    const scale = controlValues['texture-scale'] || 50;

    const texture = this.drawTexture(
      type,
      color1,
      color2,
      scale,
      renderData.width,
      renderData.height
    );

    context.drawImage(texture, 0, 0);
  }

  /**
   * Draw texture pattern to a temporary canvas
   */
  drawTexture(type, color1, color2, scale, width, height) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const ctx = tempCanvas.getContext('2d');

    // Fill base color
    ctx.fillStyle = color1;
    ctx.fillRect(0, 0, width, height);

    // Draw pattern
    ctx.fillStyle = color2;
    const size = Math.max(2, Math.floor(scale / 10));

    switch (type) {
      case 'dots':
        this.drawDots(ctx, width, height, size);
        break;
      case 'grid':
        this.drawGrid(ctx, width, height, size);
        break;
      case 'diagonal':
        this.drawDiagonal(ctx, width, height, size);
        break;
      case 'checkerboard':
        this.drawCheckerboard(ctx, width, height, size);
        break;
      case 'noise':
        this.drawNoise(ctx, width, height);
        break;
      case 'stars':
        this.drawStars(ctx, width, height, scale);
        break;
    }

    return tempCanvas;
  }

  /**
   * Draw dots pattern
   */
  drawDots(ctx, width, height, size) {
    for (let y = 0; y < height; y += size * 2) {
      for (let x = 0; x < width; x += size * 2) {
        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  /**
   * Draw grid pattern
   */
  drawGrid(ctx, width, height, size) {
    // Vertical lines
    for (let x = 0; x < width; x += size) {
      ctx.fillRect(x, 0, 1, height);
    }
    // Horizontal lines
    for (let y = 0; y < height; y += size) {
      ctx.fillRect(0, y, width, 1);
    }
  }

  /**
   * Draw diagonal lines pattern
   */
  drawDiagonal(ctx, width, height, size) {
    for (let i = -height; i < width; i += size) {
      ctx.fillRect(i, 0, 2, height);
      ctx.save();
      ctx.translate(i + 1, 0);
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(0, 0, 2, Math.max(width, height));
      ctx.restore();
    }
  }

  /**
   * Draw checkerboard pattern
   */
  drawCheckerboard(ctx, width, height, size) {
    for (let y = 0; y < height; y += size) {
      for (let x = 0; x < width; x += size) {
        if ((x / size + y / size) % 2 === 0) {
          ctx.fillRect(x, y, size, size);
        }
      }
    }
  }

  /**
   * Draw random noise pattern
   */
  drawNoise(ctx, width, height) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (Math.random() > 0.5) {
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
  }

  /**
   * Draw stars pattern
   */
  drawStars(ctx, width, height, scale) {
    const numStars = scale;
    for (let i = 0; i < numStars; i++) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);

      // Draw plus-shape star
      ctx.fillRect(x, y, 1, 1);           // Center
      ctx.fillRect(x - 1, y, 1, 1);       // Left
      ctx.fillRect(x + 1, y, 1, 1);       // Right
      ctx.fillRect(x, y - 1, 1, 1);       // Top
      ctx.fillRect(x, y + 1, 1, 1);       // Bottom
    }
  }
}

// Auto-register effect
export function register(generator) {
  generator.registerEffect(new TextureBackgroundEffect());
}

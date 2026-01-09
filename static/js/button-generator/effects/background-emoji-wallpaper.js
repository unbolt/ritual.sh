import { ButtonEffect } from '../effect-base.js';

/**
 * Emoji wallpaper background effect
 * Tiles a user-specified emoji across the background
 */
export class EmojiWallpaperEffect extends ButtonEffect {
  constructor() {
    super({
      id: 'bg-emoji-wallpaper',
      name: 'Emoji Wallpaper',
      type: 'background',
      category: 'Background',
      renderOrder: 1
    });
  }

  defineControls() {
    return [
      {
        id: 'emoji-text',
        type: 'text',
        label: 'Emoji Character',
        defaultValue: '✨',
        showWhen: 'bg-type',
        description: 'Emoji to tile (can be any text)'
      },
      {
        id: 'emoji-size',
        type: 'range',
        label: 'Emoji Size',
        defaultValue: 12,
        min: 6,
        max: 24,
        step: 1,
        showWhen: 'bg-type',
        description: 'Size of each emoji'
      },
      {
        id: 'emoji-spacing',
        type: 'range',
        label: 'Emoji Spacing',
        defaultValue: 16,
        min: 8,
        max: 32,
        step: 2,
        showWhen: 'bg-type',
        description: 'Space between emojis'
      },
      {
        id: 'emoji-bg-color',
        type: 'color',
        label: 'Background Color',
        defaultValue: '#1a1a2e',
        showWhen: 'bg-type',
        description: 'Background color behind emojis'
      },
      {
        id: 'emoji-opacity',
        type: 'range',
        label: 'Emoji Opacity',
        defaultValue: 30,
        min: 10,
        max: 100,
        step: 5,
        showWhen: 'bg-type',
        description: 'Transparency of emojis (lower = more transparent)'
      }
    ];
  }

  isEnabled(controlValues) {
    return controlValues['bg-type'] === 'emoji-wallpaper';
  }

  apply(context, controlValues, animState, renderData) {
    const emoji = controlValues['emoji-text'] || '✨';
    const size = controlValues['emoji-size'] || 12;
    const spacing = controlValues['emoji-spacing'] || 16;
    const bgColor = controlValues['emoji-bg-color'] || '#1a1a2e';
    const opacity = (controlValues['emoji-opacity'] || 30) / 100;

    // Fill background color
    context.fillStyle = bgColor;
    context.fillRect(0, 0, renderData.width, renderData.height);

    // Setup emoji font
    context.font = `${size}px Arial`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.globalAlpha = opacity;

    // Tile emojis
    for (let y = 0; y < renderData.height + spacing; y += spacing) {
      for (let x = 0; x < renderData.width + spacing; x += spacing) {
        // Offset every other row for a brick pattern
        const offsetX = (Math.floor(y / spacing) % 2) * (spacing / 2);
        context.fillText(emoji, x + offsetX, y);
      }
    }

    context.globalAlpha = 1.0;
  }
}

// Auto-register effect
export function register(generator) {
  generator.registerEffect(new EmojiWallpaperEffect());
}

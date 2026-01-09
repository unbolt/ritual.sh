import { ButtonEffect } from '../effect-base.js';

/**
 * External Image Background Effect
 * Loads an external image from a URL and displays it as the background
 */
export class ExternalImageBackgroundEffect extends ButtonEffect {
  constructor() {
    super({
      id: 'bg-external-image',
      name: 'External Image Background',
      type: 'background',
      category: 'Background',
      renderOrder: 1
    });

    // Cache for loaded images
    this.imageCache = new Map();
    this.loadingImages = new Map();
    this.generator = null;

    // Set up event listener for image loads
    this.boundImageLoadHandler = this.handleImageLoad.bind(this);
    window.addEventListener('imageLoaded', this.boundImageLoadHandler);
  }

  /**
   * Handle image load event
   */
  handleImageLoad() {
    // Trigger a redraw if we have a generator reference
    if (this.generator) {
      this.generator.updatePreview();
    }
  }

  defineControls() {
    return [
      {
        id: 'bg-image-url',
        type: 'text',
        label: 'Image URL',
        defaultValue: '',
        showWhen: 'bg-type',
        description: 'URL of the image to use as background'
      },
      {
        id: 'bg-image-fit',
        type: 'select',
        label: 'Image Fit',
        defaultValue: 'cover',
        options: [
          { value: 'cover', label: 'Cover (fill, crop if needed)' },
          { value: 'contain', label: 'Contain (fit inside)' },
          { value: 'stretch', label: 'Stretch (may distort)' },
          { value: 'center', label: 'Center (actual size)' }
        ],
        showWhen: 'bg-type',
        description: 'How the image should fit in the canvas'
      },
      {
        id: 'bg-image-opacity',
        type: 'range',
        label: 'Image Opacity',
        defaultValue: 1,
        min: 0,
        max: 1,
        step: 0.05,
        showWhen: 'bg-type',
        description: 'Transparency of the background image'
      }
    ];
  }

  isEnabled(controlValues) {
    return controlValues['bg-type'] === 'external-image';
  }

  /**
   * Start loading an image from a URL with caching
   * Triggers async loading but returns immediately
   * @param {string} url - Image URL
   */
  startLoadingImage(url) {
    // Skip if already cached or loading
    if (this.imageCache.has(url) || this.loadingImages.has(url)) {
      return;
    }

    // Mark as loading to prevent duplicate requests
    this.loadingImages.set(url, true);

    const img = new Image();

    img.onload = () => {
      this.imageCache.set(url, img);
      this.loadingImages.delete(url);
      // Trigger a redraw when image loads
      const event = new CustomEvent('imageLoaded');
      window.dispatchEvent(event);
    };

    img.onerror = () => {
      // Cache the error state to prevent retry spam
      this.imageCache.set(url, 'ERROR');
      this.loadingImages.delete(url);
      // Trigger a redraw to show error state
      const event = new CustomEvent('imageLoaded');
      window.dispatchEvent(event);
    };

    img.src = url;
  }

  /**
   * Get cached image if available
   * @param {string} url - Image URL
   * @returns {HTMLImageElement|string|null} Image element, 'ERROR', or null
   */
  getCachedImage(url) {
    return this.imageCache.get(url) || null;
  }

  /**
   * Draw image with the specified fit mode
   */
  drawImage(context, img, fitMode, opacity, width, height) {
    context.globalAlpha = opacity;

    const imgRatio = img.width / img.height;
    const canvasRatio = width / height;

    let drawX = 0;
    let drawY = 0;
    let drawWidth = width;
    let drawHeight = height;

    switch (fitMode) {
      case 'cover':
        // Fill the canvas, cropping if necessary
        if (imgRatio > canvasRatio) {
          // Image is wider, fit height
          drawHeight = height;
          drawWidth = height * imgRatio;
          drawX = (width - drawWidth) / 2;
        } else {
          // Image is taller, fit width
          drawWidth = width;
          drawHeight = width / imgRatio;
          drawY = (height - drawHeight) / 2;
        }
        break;

      case 'contain':
        // Fit inside the canvas, showing all of the image
        if (imgRatio > canvasRatio) {
          // Image is wider, fit width
          drawWidth = width;
          drawHeight = width / imgRatio;
          drawY = (height - drawHeight) / 2;
        } else {
          // Image is taller, fit height
          drawHeight = height;
          drawWidth = height * imgRatio;
          drawX = (width - drawWidth) / 2;
        }
        break;

      case 'center':
        // Center the image at actual size
        drawWidth = img.width;
        drawHeight = img.height;
        drawX = (width - drawWidth) / 2;
        drawY = (height - drawHeight) / 2;
        break;

      case 'stretch':
        // Stretch to fill (default values already set)
        break;
    }

    context.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    context.globalAlpha = 1; // Reset alpha
  }

  apply(context, controlValues, animState, renderData) {
    const url = controlValues['bg-image-url'] || '';
    const fitMode = controlValues['bg-image-fit'] || 'cover';
    const opacity = controlValues['bg-image-opacity'] ?? 1;

    // If no URL provided, fill with a placeholder color
    if (!url.trim()) {
      context.fillStyle = '#cccccc';
      context.fillRect(0, 0, renderData.width, renderData.height);

      // Draw placeholder text
      context.fillStyle = '#666666';
      context.font = '8px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText('Enter image URL', renderData.centerX, renderData.centerY);
      return;
    }

    // Start loading if not already cached or loading
    const cachedImage = this.getCachedImage(url);

    if (!cachedImage) {
      // Not cached yet - start loading
      this.startLoadingImage(url);

      // Draw loading state
      context.fillStyle = '#3498db';
      context.fillRect(0, 0, renderData.width, renderData.height);

      context.fillStyle = '#ffffff';
      context.font = '6px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText('Loading...', renderData.centerX, renderData.centerY);
      return;
    }

    if (cachedImage === 'ERROR') {
      // Failed to load
      context.fillStyle = '#ff6b6b';
      context.fillRect(0, 0, renderData.width, renderData.height);

      context.fillStyle = '#ffffff';
      context.font = '6px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText('Failed to load', renderData.centerX, renderData.centerY - 4);
      context.fillText('image', renderData.centerX, renderData.centerY + 4);
      return;
    }

    // Image is loaded - draw it
    this.drawImage(context, cachedImage, fitMode, opacity, renderData.width, renderData.height);
  }
}

// Auto-register effect
export function register(generator) {
  const effect = new ExternalImageBackgroundEffect();
  effect.generator = generator; // Store reference for redraws
  generator.registerEffect(effect);
}

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
        id: 'bg-image-file',
        type: 'file',
        label: 'Image File',
        defaultValue: '',
        accept: 'image/*',
        showWhen: 'bg-type',
        description: 'Select an image file from your computer'
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
          { value: 'center', label: 'Center (actual size)' },
          { value: 'manual', label: 'Manual (custom zoom & position)' }
        ],
        showWhen: 'bg-type',
        description: 'How the image should fit in the canvas'
      },
      {
        id: 'bg-image-zoom',
        type: 'range',
        label: 'Image Zoom',
        defaultValue: 100,
        min: 10,
        max: 500,
        step: 5,
        showWhen: 'bg-image-fit',
        description: 'Zoom level for manual positioning (percentage)'
      },
      {
        id: 'bg-image-offset-x',
        type: 'range',
        label: 'Horizontal Position',
        defaultValue: 50,
        min: 0,
        max: 100,
        step: 1,
        showWhen: 'bg-image-fit',
        description: 'Horizontal position of the image (percentage)'
      },
      {
        id: 'bg-image-offset-y',
        type: 'range',
        label: 'Vertical Position',
        defaultValue: 50,
        min: 0,
        max: 100,
        step: 1,
        showWhen: 'bg-image-fit',
        description: 'Vertical position of the image (percentage)'
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
   * Start loading an image from a blob URL with caching
   * Triggers async loading but returns immediately
   * @param {string} blobUrl - Blob URL created from uploaded file
   */
  startLoadingImage(blobUrl) {
    // Skip if already cached or loading
    if (this.imageCache.has(blobUrl) || this.loadingImages.has(blobUrl)) {
      return;
    }

    // Mark as loading to prevent duplicate requests
    this.loadingImages.set(blobUrl, true);

    const img = new Image();

    img.onload = () => {
      this.imageCache.set(blobUrl, img);
      this.loadingImages.delete(blobUrl);
      // Trigger a redraw when image loads
      const event = new CustomEvent('imageLoaded');
      window.dispatchEvent(event);
    };

    img.onerror = () => {
      // Cache the error state to prevent retry spam
      this.imageCache.set(blobUrl, 'ERROR');
      this.loadingImages.delete(blobUrl);
      // Trigger a redraw to show error state
      const event = new CustomEvent('imageLoaded');
      window.dispatchEvent(event);
    };

    img.src = blobUrl;
  }

  /**
   * Get cached image if available
   * @param {string} blobUrl - Blob URL
   * @returns {HTMLImageElement|string|null} Image element, 'ERROR', or null
   */
  getCachedImage(blobUrl) {
    return this.imageCache.get(blobUrl) || null;
  }

  /**
   * Draw image with the specified fit mode
   */
  drawImage(context, img, fitMode, opacity, width, height, zoom, offsetX, offsetY) {
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

      case 'manual':
        // Manual positioning with zoom and offset controls
        const zoomFactor = zoom / 100;

        // Start with the larger dimension to ensure coverage
        if (imgRatio > canvasRatio) {
          // Image is wider relative to canvas
          drawHeight = height * zoomFactor;
          drawWidth = drawHeight * imgRatio;
        } else {
          // Image is taller relative to canvas
          drawWidth = width * zoomFactor;
          drawHeight = drawWidth / imgRatio;
        }

        // Calculate the range of movement (how far can we move the image)
        const maxOffsetX = drawWidth - width;
        const maxOffsetY = drawHeight - height;

        // Convert percentage (0-100) to actual position
        // 0% = image fully left/top, 100% = image fully right/bottom
        drawX = -(maxOffsetX * offsetX / 100);
        drawY = -(maxOffsetY * offsetY / 100);
        break;

      case 'stretch':
        // Stretch to fill (default values already set)
        break;
    }

    context.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    context.globalAlpha = 1; // Reset alpha
  }

  apply(context, controlValues, animState, renderData) {
    const file = controlValues['bg-image-file'];
    const bgColor = controlValues['bg-color'] || '#FFFFFF';
    const fitMode = controlValues['bg-image-fit'] || 'cover';
    const opacity = controlValues['bg-image-opacity'] ?? 1;
    const zoom = controlValues['bg-image-zoom'] ?? 100;
    const offsetX = controlValues['bg-image-offset-x'] ?? 50;
    const offsetY = controlValues['bg-image-offset-y'] ?? 50;

    // Draw background color first (always, for all states)
    context.fillStyle = bgColor;
    context.fillRect(0, 0, renderData.width, renderData.height);

    // If no file selected, fill with a placeholder color
    if (!file || !file.blobUrl) {
      context.fillStyle = '#cccccc';
      context.fillRect(0, 0, renderData.width, renderData.height);

      // Draw placeholder text
      context.fillStyle = '#666666';
      context.font = '8px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText('Select an image', renderData.centerX, renderData.centerY);
      return;
    }

    // Start loading if not already cached or loading
    const cachedImage = this.getCachedImage(file.blobUrl);

    if (!cachedImage) {
      // Not cached yet - start loading
      this.startLoadingImage(file.blobUrl);

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
    this.drawImage(context, cachedImage, fitMode, opacity, renderData.width, renderData.height, zoom, offsetX, offsetY);
  }
}

// Auto-register effect
export function register(generator) {
  const effect = new ExternalImageBackgroundEffect();
  effect.generator = generator; // Store reference for redraws
  generator.registerEffect(effect);
}

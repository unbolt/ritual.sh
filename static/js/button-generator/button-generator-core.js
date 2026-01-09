import { ButtonEffect } from './effect-base.js';

/**
 * Animation state class - passed to effects for frame-based rendering
 */
export class AnimationState {
  constructor(frameNumber = 0, totalFrames = 40, fps = 20) {
    this.frame = frameNumber;
    this.totalFrames = totalFrames;
    this.progress = frameNumber / totalFrames; // 0 to 1
    this.fps = fps;
    this.time = (frameNumber / fps) * 1000; // milliseconds
  }

  /**
   * Helper to get phase for periodic animations (0 to 2π)
   * @param {number} speed - Speed multiplier
   * @returns {number} Phase in radians
   */
  getPhase(speed = 1.0) {
    return this.progress * speed * Math.PI * 2;
  }
}

/**
 * Main ButtonGenerator class with effect registry system
 */
export class ButtonGenerator {
  constructor(canvas, config = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Animation configuration
    this.animConfig = {
      fps: config.fps || 20,
      duration: config.duration || 2, // seconds
      get totalFrames() {
        return this.fps * this.duration;
      }
    };

    // Effect registry organized by type
    this.effects = {
      transform: [],
      background: [],
      border: [],
      text: [],
      text2: [],
      general: []
    };

    // Registered effects by ID for quick lookup
    this.effectsById = new Map();

    // Control elements cache
    this.controlElements = {};

    // Animation state
    this.previewAnimationId = null;

    // Font list for preloading
    this.fonts = config.fonts || [
      'Lato', 'Roboto', 'Open Sans', 'Montserrat', 'Oswald',
      'Bebas Neue', 'Roboto Mono', 'VT323', 'Press Start 2P', 'DSEG7-Classic'
    ];
  }

  /**
   * Register an effect with the generator
   * @param {ButtonEffect} effect - Effect instance to register
   */
  registerEffect(effect) {
    if (!(effect instanceof ButtonEffect)) {
      throw new Error('Effect must extend ButtonEffect class');
    }

    if (this.effectsById.has(effect.id)) {
      console.warn(`Effect with ID "${effect.id}" is already registered. Skipping.`);
      return;
    }

    // Add to type-specific array
    const type = effect.type;
    if (!this.effects[type]) {
      this.effects[type] = [];
    }

    this.effects[type].push(effect);
    this.effectsById.set(effect.id, effect);

    // Sort by render order
    this.effects[type].sort((a, b) => a.renderOrder - b.renderOrder);

    console.log(`Registered effect: ${effect.name} (${effect.id}) [${type}]`);
  }

  /**
   * Get all registered effects
   * @returns {Array<ButtonEffect>}
   */
  getAllEffects() {
    return Array.from(this.effectsById.values());
  }

  /**
   * Get effects by type
   * @param {string} type - Effect type
   * @returns {Array<ButtonEffect>}
   */
  getEffectsByType(type) {
    return this.effects[type] || [];
  }

  /**
   * Initialize and preload fonts
   * @returns {Promise}
   */
  async preloadFonts() {
    const fontPromises = this.fonts.flatMap(font => [
      document.fonts.load(`400 12px "${font}"`),
      document.fonts.load(`700 12px "${font}"`),
      document.fonts.load(`italic 400 12px "${font}"`)
    ]);

    await Promise.all(fontPromises);
    console.log('All fonts loaded for canvas');
  }

  /**
   * Get current control values from DOM
   * @returns {Object} Map of control ID to value
   */
  getControlValues() {
    const values = {};

    // Get all registered control IDs from effects
    const allControls = new Set();
    this.getAllEffects().forEach(effect => {
      effect.controls.forEach(control => {
        allControls.add(control.id);
      });
    });

    // Read values from DOM
    allControls.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        if (element.type === 'checkbox') {
          values[id] = element.checked;
        } else if (element.type === 'range' || element.type === 'number') {
          values[id] = parseFloat(element.value);
        } else if (element.type === 'file') {
          // For file inputs, return an object with file metadata and blob URL
          if (element.dataset.blobUrl) {
            values[id] = {
              fileName: element.dataset.fileName,
              blobUrl: element.dataset.blobUrl,
              fileSize: parseInt(element.dataset.fileSize),
              fileType: element.dataset.fileType
            };
          } else {
            values[id] = null;
          }
        } else {
          values[id] = element.value;
        }
      }
    });

    return values;
  }

  /**
   * Draw button with all effects applied
   * @param {AnimationState} animState - Animation state (null for static)
   * @param {Object} baseControls - Base button controls (text, colors, etc.)
   */
  draw(animState = null, baseControls = {}) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const controlValues = { ...baseControls, ...this.getControlValues() };
    const renderData = {
      width: this.canvas.width,
      height: this.canvas.height,
      centerX: this.canvas.width / 2,
      centerY: this.canvas.height / 2
    };

    // Apply effects in order: transform -> background -> border -> text/text2 -> general
    const renderOrder = ['transform', 'background', 'border', 'text', 'text2', 'general'];

    // Save context once before transforms
    this.ctx.save();

    renderOrder.forEach(type => {
      this.effects[type]?.forEach(effect => {
        if (effect.canApply(controlValues)) {
          // Transform effects should NOT be wrapped in save/restore
          // They need to persist for all subsequent drawing operations
          if (type !== 'transform') {
            this.ctx.save();
          }

          try {
            effect.apply(this.ctx, controlValues, animState, renderData);
          } catch (error) {
            console.error(`Error applying effect ${effect.id}:`, error);
          }

          if (type !== 'transform') {
            this.ctx.restore();
          }
        }
      });
    });

    // Restore context once after all drawing
    this.ctx.restore();
  }

  /**
   * Check if any animations are enabled
   * @returns {boolean}
   */
  hasAnimationsEnabled() {
    const controlValues = this.getControlValues();
    return this.getAllEffects().some(effect =>
      effect.type !== 'background' && // Background effects can be static
      effect.isEnabled(controlValues)
    );
  }

  /**
   * Start animated preview loop
   */
  startAnimatedPreview() {
    this.stopAnimatedPreview();

    let frameNum = 0;
    let lastFrameTime = performance.now();
    const frameDelay = 1000 / this.animConfig.fps;

    const animate = (currentTime) => {
      const elapsed = currentTime - lastFrameTime;

      if (elapsed >= frameDelay) {
        const animState = new AnimationState(
          frameNum,
          this.animConfig.totalFrames,
          this.animConfig.fps
        );
        this.draw(animState);

        frameNum = (frameNum + 1) % this.animConfig.totalFrames;
        lastFrameTime = currentTime - (elapsed % frameDelay);
      }

      this.previewAnimationId = requestAnimationFrame(animate);
    };

    this.previewAnimationId = requestAnimationFrame(animate);
  }

  /**
   * Stop animated preview
   */
  stopAnimatedPreview() {
    if (this.previewAnimationId) {
      cancelAnimationFrame(this.previewAnimationId);
      this.previewAnimationId = null;
    }
  }

  /**
   * Update preview (static or animated based on settings)
   */
  updatePreview() {
    if (this.hasAnimationsEnabled()) {
      this.startAnimatedPreview();
    } else {
      this.stopAnimatedPreview();
      this.draw();
    }
  }

  /**
   * Export as animated GIF
   * @param {Function} progressCallback - Called with progress (0-1)
   * @returns {Promise<Blob>}
   */
  async exportAsGif(progressCallback = null) {
    return new Promise((resolve, reject) => {
      try {
        // Create temporary canvas for frame generation
        const frameCanvas = document.createElement('canvas');
        frameCanvas.width = this.canvas.width;
        frameCanvas.height = this.canvas.height;
        const frameCtx = frameCanvas.getContext('2d');

        // Initialize gif.js
        const gif = new GIF({
          workers: 2,
          quality: 10,
          workerScript: '/js/gif.worker.js',
          width: this.canvas.width,
          height: this.canvas.height
        });

        // Generate frames
        const totalFrames = this.animConfig.totalFrames;

        const generateFrames = async () => {
          for (let i = 0; i < totalFrames; i++) {
            const animState = new AnimationState(i, totalFrames, this.animConfig.fps);

            // Draw to temporary canvas
            frameCtx.clearRect(0, 0, frameCanvas.width, frameCanvas.height);
            const tempGenerator = new ButtonGenerator(frameCanvas, {
              fps: this.animConfig.fps,
              duration: this.animConfig.duration,
              fonts: this.fonts
            });

            // Copy effects
            this.getAllEffects().forEach(effect => {
              tempGenerator.registerEffect(effect);
            });

            tempGenerator.draw(animState);

            gif.addFrame(frameCtx, {
              delay: 1000 / this.animConfig.fps,
              copy: true
            });

            if (progressCallback) {
              progressCallback(i / totalFrames, 'generating');
            }

            // Yield to browser every 5 frames
            if (i % 5 === 0) {
              await new Promise(resolve => setTimeout(resolve, 0));
            }
          }
        };

        generateFrames().then(() => {
          gif.on('finished', (blob) => {
            resolve(blob);
          });

          gif.on('progress', (progress) => {
            if (progressCallback) {
              progressCallback(progress, 'encoding');
            }
          });

          gif.render();
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Bind UI controls to redraw on change
   */
  bindControls() {
    const allControls = new Set();
    this.getAllEffects().forEach(effect => {
      effect.controls.forEach(control => {
        allControls.add(control.id);
      });
    });

    allControls.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('input', () => this.updatePreview());
        element.addEventListener('change', () => this.updatePreview());
      }
    });
  }
}

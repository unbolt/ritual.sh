/**
 * Base class for button generator effects
 * All effects should extend this class and implement required methods
 */
export class ButtonEffect {
  /**
   * @param {Object} config - Effect configuration
   * @param {string} config.id - Unique identifier for this effect
   * @param {string} config.name - Display name for the effect
   * @param {string} config.type - Effect type: 'text', 'text2', 'background', 'general', 'border'
   * @param {string} config.category - UI category for grouping effects
   * @param {number} config.renderOrder - Order in rendering pipeline (lower = earlier)
   */
  constructor(config) {
    this.config = config; // Store full config for subclasses to access
    this.id = config.id;
    this.name = config.name;
    this.type = config.type; // 'text', 'text2', 'background', 'general', 'border'
    this.category = config.category;
    this.renderOrder = config.renderOrder || 100;
    this.controls = this.defineControls();
  }

  /**
   * Define UI controls for this effect
   * @returns {Array<Object>} Array of control definitions
   *
   * Control definition format:
   * {
   *   id: string,              // HTML element ID
   *   type: 'checkbox' | 'range' | 'color' | 'select' | 'text',
   *   label: string,           // Display label
   *   defaultValue: any,       // Default value
   *   min: number,             // For range controls
   *   max: number,             // For range controls
   *   step: number,            // For range controls
   *   options: Array<{value, label}>, // For select controls
   *   showWhen: string,        // ID of checkbox that controls visibility
   *   description: string      // Optional tooltip/help text
   * }
   */
  defineControls() {
    return [];
  }

  /**
   * Check if this effect is currently enabled
   * @param {Object} controlValues - Current values of all controls
   * @returns {boolean}
   */
  isEnabled(controlValues) {
    // Default: check for a control with ID pattern 'animate-{effectId}' or '{effectId}-enabled'
    const enableControl = controlValues[`animate-${this.id}`] ||
                         controlValues[`${this.id}-enabled`];
    return enableControl === true || enableControl === 'true';
  }

  /**
   * Apply the effect during rendering
   * @param {CanvasRenderingContext2D} context - Canvas context to draw on
   * @param {Object} controlValues - Current values of all controls
   * @param {AnimationState} animState - Current animation state (null for static)
   * @param {Object} renderData - Additional render data (text metrics, colors, etc.)
   */
  apply(context, controlValues, animState, renderData) {
    throw new Error('Effect.apply() must be implemented by subclass');
  }

  /**
   * Get control values specific to this effect
   * @param {Object} allControlValues - All control values
   * @returns {Object} Only the controls relevant to this effect
   */
  getEffectControls(allControlValues) {
    const effectControls = {};
    this.controls.forEach(control => {
      if (control.id in allControlValues) {
        effectControls[control.id] = allControlValues[control.id];
      }
    });
    return effectControls;
  }

  /**
   * Validate that this effect can be applied
   * @param {Object} controlValues - Current values of all controls
   * @returns {boolean}
   */
  canApply(controlValues) {
    return this.isEnabled(controlValues);
  }
}

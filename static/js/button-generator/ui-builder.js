/**
 * UI Builder - Dynamically generates control UI from effect definitions
 */

export class UIBuilder {
  constructor(containerElement) {
    this.container = containerElement;
    this.controlGroups = new Map(); // category -> { element, controls }
  }

  /**
   * Build the entire UI from registered effects
   * @param {Array<ButtonEffect>} effects - All registered effects
   */
  buildUI(effects) {
    // Clear existing content
    this.container.innerHTML = '';
    this.controlGroups.clear();

    // Group effects by category
    const categorized = this.categorizeEffects(effects);

    // Create control groups for each category
    for (const [category, categoryEffects] of categorized) {
      this.createControlGroup(category, categoryEffects);
    }
  }

  /**
   * Categorize effects by their category property
   * @param {Array<ButtonEffect>} effects
   * @returns {Map<string, Array<ButtonEffect>>}
   */
  categorizeEffects(effects) {
    const categories = new Map();

    effects.forEach(effect => {
      const category = effect.category || 'Other';
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category).push(effect);
    });

    // Sort categories in a logical order
    const orderedCategories = new Map();
    const categoryOrder = [
      'Text Line 1',
      'Text Line 2',
      'Background',
      'Background Animations',
      'Border',
      'Visual Effects',
      'General Effects',
      'Special Effects'
    ];

    categoryOrder.forEach(cat => {
      if (categories.has(cat)) {
        orderedCategories.set(cat, categories.get(cat));
      }
    });

    // Add any remaining categories
    categories.forEach((effects, cat) => {
      if (!orderedCategories.has(cat)) {
        orderedCategories.set(cat, effects);
      }
    });

    return orderedCategories;
  }

  /**
   * Create a collapsible control group
   * @param {string} category - Category name
   * @param {Array<ButtonEffect>} effects - Effects in this category
   */
  createControlGroup(category, effects) {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'control-group';

    // Create header
    const header = document.createElement('h3');
    header.className = 'control-group-header';
    header.innerHTML = `
      <span>${category}</span>
      <span class="toggle-icon">−</span>
    `;

    // Create content container
    const content = document.createElement('div');
    content.className = 'control-group-content';

    // Add controls for each effect in this category
    effects.forEach(effect => {
      this.addEffectControls(content, effect);
    });

    // Add click handler for collapsing
    header.addEventListener('click', () => {
      groupDiv.classList.toggle('collapsed');
    });

    groupDiv.appendChild(header);
    groupDiv.appendChild(content);
    this.container.appendChild(groupDiv);

    this.controlGroups.set(category, { element: groupDiv, effects });
  }

  /**
   * Add controls for a single effect
   * @param {HTMLElement} container - Container to add controls to
   * @param {ButtonEffect} effect - Effect to create controls for
   */
  addEffectControls(container, effect) {
    effect.controls.forEach(control => {
      const controlEl = this.createControl(control);
      if (controlEl) {
        container.appendChild(controlEl);
      }
    });
  }

  /**
   * Create a single control element
   * @param {Object} controlDef - Control definition from effect
   * @returns {HTMLElement}
   */
  createControl(controlDef) {
    const { id, type, label, defaultValue, min, max, step, options, showWhen, description } = controlDef;

    switch (type) {
      case 'checkbox':
        return this.createCheckbox(id, label, defaultValue, showWhen);

      case 'range':
        return this.createRange(id, label, defaultValue, min, max, step, description, showWhen);

      case 'color':
        return this.createColor(id, label, defaultValue, showWhen);

      case 'select':
        return this.createSelect(id, label, defaultValue, options, showWhen);

      case 'text':
        return this.createTextInput(id, label, defaultValue);

      default:
        console.warn(`Unknown control type: ${type}`);
        return null;
    }
  }

  /**
   * Create a checkbox control
   */
  createCheckbox(id, label, defaultValue, showWhen) {
    const wrapper = document.createElement('label');
    wrapper.className = 'checkbox-label';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = id;
    input.checked = defaultValue || false;

    const span = document.createElement('span');
    span.textContent = label;

    wrapper.appendChild(input);
    wrapper.appendChild(span);

    if (showWhen) {
      wrapper.style.display = 'none';
      wrapper.dataset.showWhen = showWhen;
    }

    return wrapper;
  }

  /**
   * Create a range slider control
   */
  createRange(id, label, defaultValue, min, max, step, description, showWhen) {
    const container = document.createElement('div');

    const labelEl = document.createElement('label');
    labelEl.htmlFor = id;
    labelEl.innerHTML = `${label}: <span id="${id}-value">${defaultValue}</span>`;
    if (description) {
      labelEl.title = description;
    }

    const input = document.createElement('input');
    input.type = 'range';
    input.id = id;
    input.min = min !== undefined ? min : 0;
    input.max = max !== undefined ? max : 100;
    input.value = defaultValue !== undefined ? defaultValue : 50;
    if (step !== undefined) {
      input.step = step;
    }

    // Update value display on input
    input.addEventListener('input', () => {
      const valueDisplay = document.getElementById(`${id}-value`);
      if (valueDisplay) {
        valueDisplay.textContent = input.value;
      }
    });

    container.appendChild(labelEl);
    container.appendChild(input);

    if (showWhen) {
      container.style.display = 'none';
      container.dataset.showWhen = showWhen;
    }

    return container;
  }

  /**
   * Create a color picker control
   */
  createColor(id, label, defaultValue, showWhen) {
    const container = document.createElement('div');

    const labelEl = document.createElement('label');
    labelEl.htmlFor = id;
    labelEl.textContent = label;

    const input = document.createElement('input');
    input.type = 'color';
    input.id = id;
    input.value = defaultValue || '#ffffff';

    container.appendChild(labelEl);
    container.appendChild(input);

    if (showWhen) {
      container.style.display = 'none';
      container.dataset.showWhen = showWhen;
    }

    return container;
  }

  /**
   * Create a select dropdown control
   */
  createSelect(id, label, defaultValue, options, showWhen) {
    const container = document.createElement('div');

    const labelEl = document.createElement('label');
    labelEl.htmlFor = id;
    labelEl.textContent = label;

    const select = document.createElement('select');
    select.id = id;

    options.forEach(opt => {
      const option = document.createElement('option');
      option.value = opt.value;
      option.textContent = opt.label;
      if (opt.value === defaultValue) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    container.appendChild(labelEl);
    container.appendChild(select);

    if (showWhen) {
      container.style.display = 'none';
      container.dataset.showWhen = showWhen;
    }

    return container;
  }

  /**
   * Create a text input control
   */
  createTextInput(id, label, defaultValue) {
    const container = document.createElement('div');

    const labelEl = document.createElement('label');
    labelEl.htmlFor = id;
    labelEl.textContent = label;

    const input = document.createElement('input');
    input.type = 'text';
    input.id = id;
    input.value = defaultValue || '';
    input.maxLength = 20;

    container.appendChild(labelEl);
    container.appendChild(input);

    return container;
  }

  /**
   * Setup conditional visibility for controls
   * Should be called after all controls are created
   */
  setupConditionalVisibility() {
    // Find all controls with showWhen attribute
    const conditionalControls = this.container.querySelectorAll('[data-show-when]');

    conditionalControls.forEach(control => {
      const triggerControlId = control.dataset.showWhen;
      const triggerControl = document.getElementById(triggerControlId);

      if (triggerControl) {
        const updateVisibility = () => {
          if (triggerControl.type === 'checkbox') {
            control.style.display = triggerControl.checked ? 'block' : 'none';
          } else if (triggerControl.tagName === 'SELECT') {
            // Get the control ID to determine what value to check for
            const controlId = control.querySelector('input, select')?.id;

            // For background controls
            if (triggerControlId === 'bg-type') {
              if (controlId === 'bg-color') {
                control.style.display = triggerControl.value === 'solid' ? 'block' : 'none';
              } else if (controlId && (controlId.startsWith('gradient-') || controlId === 'gradient-angle')) {
                control.style.display = triggerControl.value === 'gradient' ? 'block' : 'none';
              } else if (controlId && (controlId.startsWith('texture-') || controlId === 'texture-type' || controlId === 'texture-scale')) {
                control.style.display = triggerControl.value === 'texture' ? 'block' : 'none';
              } else if (controlId && (controlId.startsWith('emoji-') || controlId === 'emoji-text')) {
                control.style.display = triggerControl.value === 'emoji-wallpaper' ? 'block' : 'none';
              }
            }
            // For text color controls
            else if (triggerControlId === 'text-color-type') {
              if (controlId === 'text-color') {
                control.style.display = triggerControl.value === 'solid' ? 'block' : 'none';
              } else if (controlId && controlId.startsWith('text-gradient-')) {
                control.style.display = triggerControl.value === 'gradient' ? 'block' : 'none';
              }
            } else if (triggerControlId === 'text2-color-type') {
              if (controlId === 'text2-color') {
                control.style.display = triggerControl.value === 'solid' ? 'block' : 'none';
              } else if (controlId && controlId.startsWith('text2-gradient-')) {
                control.style.display = triggerControl.value === 'gradient' ? 'block' : 'none';
              }
            } else {
              // Default: show when any value is selected
              control.style.display = triggerControl.value ? 'block' : 'none';
            }
          }
        };

        // Initial visibility
        updateVisibility();

        // Update on change
        triggerControl.addEventListener('change', updateVisibility);
        triggerControl.addEventListener('input', updateVisibility);
      }
    });
  }
}

/**
 * UI Builder - Dynamically generates control UI from effect definitions
 */

export class UIBuilder {
  constructor(containerElement) {
    this.container = containerElement;
    this.controlGroups = new Map(); // category -> { element, controls }
    this.tooltip = null;
    this.tooltipTimeout = null;
    this.setupTooltip();
  }

  /**
   * Create and setup the tooltip element
   */
  setupTooltip() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        this.createTooltipElement();
      });
    } else {
      this.createTooltipElement();
    }
  }

  createTooltipElement() {
    this.tooltip = document.createElement("div");
    this.tooltip.className = "control-tooltip";
    this.tooltip.style.cssText = `
      position: fixed;
      background: linear-gradient(135deg, rgba(0, 120, 200, 0.98) 0%, rgba(0, 100, 180, 0.98) 100%);
      color: #fff;
      padding: 0.5rem 0.75rem;
      border-radius: 4px;
      font-size: 0.8rem;
      pointer-events: none;
      z-index: 10000;
      max-width: 250px;
      box-shadow: 0 0 20px rgba(0, 150, 255, 0.5), 0 4px 12px rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(0, 150, 255, 0.6);
      opacity: 0;
      transition: opacity 0.15s ease;
      line-height: 1.4;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    `;
    document.body.appendChild(this.tooltip);
  }

  /**
   * Show tooltip for an element
   */
  showTooltip(element, text) {
    if (!text || !this.tooltip) return;

    clearTimeout(this.tooltipTimeout);

    this.tooltip.textContent = text;
    this.tooltip.style.opacity = "1";

    // Position tooltip above the element
    const rect = element.getBoundingClientRect();

    // Set initial position to measure
    this.tooltip.style.left = "0px";
    this.tooltip.style.top = "0px";
    this.tooltip.style.visibility = "hidden";
    this.tooltip.style.display = "block";

    const tooltipRect = this.tooltip.getBoundingClientRect();

    this.tooltip.style.visibility = "visible";

    let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
    let top = rect.top - tooltipRect.height - 10;

    // Keep tooltip on screen
    const padding = 10;
    if (left < padding) left = padding;
    if (left + tooltipRect.width > window.innerWidth - padding) {
      left = window.innerWidth - tooltipRect.width - padding;
    }
    if (top < padding) {
      top = rect.bottom + 10;
    }

    this.tooltip.style.left = `${left}px`;
    this.tooltip.style.top = `${top}px`;
  }

  /**
   * Hide tooltip
   */
  hideTooltip() {
    if (!this.tooltip) return;
    clearTimeout(this.tooltipTimeout);
    this.tooltipTimeout = setTimeout(() => {
      this.tooltip.style.opacity = "0";
    }, 100);
  }

  /**
   * Add tooltip handlers to an element
   */
  addTooltipHandlers(element, description) {
    if (!description) return;

    element.addEventListener("mouseenter", () => {
      this.showTooltip(element, description);
    });

    element.addEventListener("mouseleave", () => {
      this.hideTooltip();
    });

    element.addEventListener("mousemove", () => {
      // Update position on mouse move for better following
      if (this.tooltip && this.tooltip.style.opacity === "1") {
        this.showTooltip(element, description);
      }
    });
  }

  /**
   * Build the entire UI from registered effects
   * @param {Array<ButtonEffect>} effects - All registered effects
   */
  buildUI(effects) {
    // Clear existing content
    this.container.innerHTML = "";
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

    effects.forEach((effect) => {
      const category = effect.category || "Other";
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category).push(effect);
    });

    // Sort categories in a logical order
    const orderedCategories = new Map();
    const categoryOrder = [
      "Text Line 1",
      "Text Line 2",
      "Background",
      "Background Animations",
      "Border",
      "Visual Effects",
      "General Effects",
      "Special Effects",
    ];

    categoryOrder.forEach((cat) => {
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
    const groupDiv = document.createElement("div");
    groupDiv.className = "control-group";

    // Create header
    const header = document.createElement("h3");
    header.className = "control-group-header";
    header.innerHTML = `
      <span>${category}</span>
      <span class="toggle-icon">−</span>
    `;

    // Create content container
    const content = document.createElement("div");
    content.className = "control-group-content";

    // Add controls for each effect in this category
    effects.forEach((effect) => {
      this.addEffectControls(content, effect);
    });

    // Add click handler for collapsing
    header.addEventListener("click", () => {
      groupDiv.classList.toggle("collapsed");
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
    effect.controls.forEach((control) => {
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
    const {
      id,
      type,
      label,
      defaultValue,
      min,
      max,
      step,
      options,
      showWhen,
      description,
    } = controlDef;

    switch (type) {
      case "checkbox":
        return this.createCheckbox(
          id,
          label,
          defaultValue,
          showWhen,
          description,
        );

      case "range":
        return this.createRange(
          id,
          label,
          defaultValue,
          min,
          max,
          step,
          description,
          showWhen,
        );

      case "range-dual":
        return this.createRangeDual(
          id,
          label,
          controlDef.defaultValueStart,
          controlDef.defaultValueEnd,
          min,
          max,
          step,
          description,
          showWhen,
        );

      case "color":
        return this.createColor(id, label, defaultValue, showWhen, description);

      case "select":
        return this.createSelect(
          id,
          label,
          defaultValue,
          options,
          showWhen,
          description,
        );

      case "text":
        return this.createTextInput(
          id,
          label,
          defaultValue,
          showWhen,
          description,
        );

      case "file":
        return this.createFileInput(
          id,
          label,
          defaultValue,
          showWhen,
          description,
          controlDef.accept,
        );

      default:
        console.warn(`Unknown control type: ${type}`);
        return null;
    }
  }

  /**
   * Create a checkbox control
   */
  createCheckbox(id, label, defaultValue, showWhen, description) {
    const wrapper = document.createElement("label");
    wrapper.className = "checkbox-label";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = id;
    input.checked = defaultValue || false;

    const span = document.createElement("span");
    span.textContent = label;

    wrapper.appendChild(input);
    wrapper.appendChild(span);

    if (showWhen) {
      wrapper.style.display = "none";
      wrapper.dataset.showWhen = showWhen;
    }

    // Add tooltip handlers to the label wrapper
    this.addTooltipHandlers(wrapper, description);

    return wrapper;
  }

  /**
   * Create a range slider control
   */
  createRange(id, label, defaultValue, min, max, step, description, showWhen) {
    const container = document.createElement("div");

    const labelEl = document.createElement("label");
    labelEl.htmlFor = id;
    labelEl.innerHTML = `${label}: <span id="${id}-value">${defaultValue}</span>`;

    const input = document.createElement("input");
    input.type = "range";
    input.id = id;
    input.min = min !== undefined ? min : 0;
    input.max = max !== undefined ? max : 100;
    input.value = defaultValue !== undefined ? defaultValue : 50;
    if (step !== undefined) {
      input.step = step;
    }

    // Update value display on input
    input.addEventListener("input", () => {
      const valueDisplay = document.getElementById(`${id}-value`);
      if (valueDisplay) {
        valueDisplay.textContent = input.value;
      }
    });

    container.appendChild(labelEl);
    container.appendChild(input);

    if (showWhen) {
      container.style.display = "none";
      container.dataset.showWhen = showWhen;
    }

    // Add tooltip handlers to the label
    this.addTooltipHandlers(labelEl, description);

    return container;
  }

  /**
   * Create a dual-range slider control (two handles on one track)
   */
  createRangeDual(
    id,
    label,
    defaultValueStart,
    defaultValueEnd,
    min,
    max,
    step,
    description,
    showWhen,
  ) {
    const container = document.createElement("div");
    container.className = "range-dual-container";

    const labelEl = document.createElement("label");
    labelEl.innerHTML = `${label}: <span id="${id}-value">${defaultValueStart}-${defaultValueEnd}</span>`;

    // Create wrapper for the dual range slider
    const sliderWrapper = document.createElement("div");
    sliderWrapper.className = "range-dual-wrapper";
    sliderWrapper.style.cssText = `
      position: relative;
      height: 30px;
      margin: 10px 0;
    `;

    // Create the track
    const track = document.createElement("div");
    track.className = "range-dual-track";
    track.style.cssText = `
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
      height: 4px;
      background: #444;
      border-radius: 2px;
      z-index: 1;
    `;

    // Create the filled range indicator
    const range = document.createElement("div");
    range.className = "range-dual-range";
    range.id = `${id}-range`;
    range.style.cssText = `
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      height: 4px;
      background: linear-gradient(90deg, #ff9966, #00bcf2); //  Change this to orange
      border-radius: 2px;
      pointer-events: none;
      z-index: 10;
    `;

    // Create start handle input
    const inputStart = document.createElement("input");
    inputStart.type = "range";
    inputStart.id = `${id}-start`;
    inputStart.className = "range-dual-input";
    inputStart.min = min !== undefined ? min : 0;
    inputStart.max = max !== undefined ? max : 100;
    inputStart.value =
      defaultValueStart !== undefined ? defaultValueStart : min || 0;
    if (step !== undefined) {
      inputStart.step = step;
    }
    inputStart.style.cssText = `
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
      -webkit-appearance: none;
      appearance: none;
      background: transparent;
      pointer-events: none;
      margin: 0;
      z-index: 3;
    `;

    // Create end handle input
    const inputEnd = document.createElement("input");
    inputEnd.type = "range";
    inputEnd.id = `${id}-end`;
    inputEnd.className = "range-dual-input";
    inputEnd.min = min !== undefined ? min : 0;
    inputEnd.max = max !== undefined ? max : 100;
    inputEnd.value =
      defaultValueEnd !== undefined ? defaultValueEnd : max || 100;
    if (step !== undefined) {
      inputEnd.step = step;
    }
    inputEnd.style.cssText = `
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
      -webkit-appearance: none;
      appearance: none;
      background: transparent;
      pointer-events: none;
      margin: 0;
      z-index: 4;
    `;

    // Add CSS for the range inputs
    const style = document.createElement("style");
    style.textContent = `
      .range-dual-input::-webkit-slider-runnable-track {
        background: transparent;
        border: none;
        height: 4px;
      }
      .range-dual-input::-moz-range-track {
        background: transparent;
        border: none;
        height: 4px;
      }
      .range-dual-input::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #0078d4;
        cursor: pointer;
        pointer-events: all;
        border: 2px solid #fff;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
        position: relative;
        z-index: 100;
      }
      .range-dual-input::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #0078d4;
        cursor: pointer;
        pointer-events: all;
        border: 2px solid #fff;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
        position: relative;
        z-index: 100;
      }
      .range-dual-input::-webkit-slider-thumb:hover {
        background: #00bcf2;
      }
      .range-dual-input::-moz-range-thumb:hover {
        background: #00bcf2;
      }
    `;
    if (!document.getElementById("range-dual-styles")) {
      style.id = "range-dual-styles";
      document.head.appendChild(style);
    }

    // Update function
    const updateRange = () => {
      let startVal = parseInt(inputStart.value);
      let endVal = parseInt(inputEnd.value);

      // Ensure start is never greater than end
      if (startVal > endVal) {
        const temp = startVal;
        startVal = endVal;
        endVal = temp;
        inputStart.value = startVal;
        inputEnd.value = endVal;
      }

      const minVal = parseInt(inputStart.min);
      const maxVal = parseInt(inputStart.max);
      const startPercent = ((startVal - minVal) / (maxVal - minVal)) * 100;
      const endPercent = ((endVal - minVal) / (maxVal - minVal)) * 100;

      range.style.left = `${startPercent}%`;
      range.style.width = `${endPercent - startPercent}%`;

      const valueDisplay = document.getElementById(`${id}-value`);
      if (valueDisplay) {
        valueDisplay.textContent = `${startVal}-${endVal}`;
      }
    };

    inputStart.addEventListener("input", updateRange);
    inputEnd.addEventListener("input", updateRange);

    // Assemble the dual range slider
    sliderWrapper.appendChild(track);
    sliderWrapper.appendChild(range);
    sliderWrapper.appendChild(inputStart);
    sliderWrapper.appendChild(inputEnd);

    container.appendChild(labelEl);
    container.appendChild(sliderWrapper);

    if (showWhen) {
      container.style.display = "none";
      container.dataset.showWhen = showWhen;
    }

    // Add tooltip handlers to the label
    this.addTooltipHandlers(labelEl, description);

    // Initialize range display
    updateRange();

    return container;
  }

  /**
   * Create a color picker control
   */
  createColor(id, label, defaultValue, showWhen, description) {
    const container = document.createElement("div");

    const labelEl = document.createElement("label");
    labelEl.htmlFor = id;
    labelEl.textContent = label;

    const input = document.createElement("input");
    input.type = "color";
    input.id = id;
    input.value = defaultValue || "#ffffff";

    container.appendChild(labelEl);
    container.appendChild(input);

    if (showWhen) {
      container.style.display = "none";
      container.dataset.showWhen = showWhen;
    }

    // Add tooltip handlers to the label
    this.addTooltipHandlers(labelEl, description);

    return container;
  }

  /**
   * Create a select dropdown control
   */
  createSelect(id, label, defaultValue, options, showWhen, description) {
    const container = document.createElement("div");

    const labelEl = document.createElement("label");
    labelEl.htmlFor = id;
    labelEl.textContent = label;

    const select = document.createElement("select");
    select.id = id;

    options.forEach((opt) => {
      const option = document.createElement("option");
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
      container.style.display = "none";
      container.dataset.showWhen = showWhen;
    }

    // Add tooltip handlers to the label
    this.addTooltipHandlers(labelEl, description);

    return container;
  }

  /**
   * Create a text input control
   */
  createTextInput(id, label, defaultValue, showWhen, description) {
    const container = document.createElement("div");

    const labelEl = document.createElement("label");
    labelEl.htmlFor = id;
    labelEl.textContent = label;

    const input = document.createElement("input");
    input.type = "text";
    input.id = id;
    input.value = defaultValue || "";

    // Only set maxLength for text inputs that aren't URLs
    if (id !== "bg-image-url") {
      input.maxLength = 20;
    }

    container.appendChild(labelEl);
    container.appendChild(input);

    if (showWhen) {
      container.style.display = "none";
      container.dataset.showWhen = showWhen;
    }

    // Add tooltip handlers to the label
    this.addTooltipHandlers(labelEl, description);

    return container;
  }

  /**
   * Create a file input control
   */
  createFileInput(id, label, defaultValue, showWhen, description, accept) {
    const container = document.createElement("div");

    const labelEl = document.createElement("label");
    labelEl.htmlFor = id;
    labelEl.textContent = label;

    const input = document.createElement("input");
    input.type = "file";
    input.id = id;
    if (accept) {
      input.accept = accept;
    }

    // Store the file data on the input element
    input.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        // Create a blob URL for the file
        const blobUrl = URL.createObjectURL(file);
        // Store file metadata on the input element
        input.dataset.fileName = file.name;
        input.dataset.blobUrl = blobUrl;
        input.dataset.fileSize = file.size;
        input.dataset.fileType = file.type;
      } else {
        // Clear the data if no file is selected
        delete input.dataset.fileName;
        delete input.dataset.blobUrl;
        delete input.dataset.fileSize;
        delete input.dataset.fileType;
      }
    });

    container.appendChild(labelEl);
    container.appendChild(input);

    if (showWhen) {
      container.style.display = "none";
      container.dataset.showWhen = showWhen;
    }

    // Add tooltip handlers to the label
    this.addTooltipHandlers(labelEl, description);

    return container;
  }

  /**
   * Setup conditional visibility for controls
   * Should be called after all controls are created
   */
  setupConditionalVisibility() {
    // Find all controls with showWhen attribute
    const conditionalControls =
      this.container.querySelectorAll("[data-show-when]");

    conditionalControls.forEach((control) => {
      const triggerControlId = control.dataset.showWhen;
      const triggerControl = document.getElementById(triggerControlId);

      if (triggerControl) {
        const updateVisibility = () => {
          if (triggerControl.type === "checkbox") {
            control.style.display = triggerControl.checked ? "block" : "none";
          } else if (triggerControl.tagName === "SELECT") {
            // Get the control ID to determine what value to check for
            const controlId = control.querySelector("input, select")?.id;

            // For background controls
            if (triggerControlId === "bg-type") {
              if (controlId === "bg-color") {
                control.style.display =
                  triggerControl.value === "solid" ||
                  triggerControl.value === "external-image"
                    ? "block"
                    : "none";
              } else if (
                controlId &&
                (controlId.startsWith("gradient-") ||
                  controlId === "gradient-angle")
              ) {
                control.style.display =
                  triggerControl.value === "gradient" ? "block" : "none";
              } else if (
                controlId &&
                (controlId.startsWith("texture-") ||
                  controlId === "texture-type" ||
                  controlId === "texture-scale")
              ) {
                control.style.display =
                  triggerControl.value === "texture" ? "block" : "none";
              } else if (
                controlId &&
                (controlId.startsWith("emoji-") || controlId === "emoji-text")
              ) {
                control.style.display =
                  triggerControl.value === "emoji-wallpaper" ? "block" : "none";
              } else if (
                controlId &&
                (controlId.startsWith("bg-image-") ||
                  controlId === "bg-image-file" ||
                  controlId === "bg-image-fit" ||
                  controlId === "bg-image-opacity")
              ) {
                control.style.display =
                  triggerControl.value === "external-image" ? "block" : "none";
              }
            }
            // For image fit controls (zoom and position only show when manual mode)
            else if (triggerControlId === "bg-image-fit") {
              if (
                controlId &&
                (controlId === "bg-image-zoom" ||
                  controlId === "bg-image-offset-x" ||
                  controlId === "bg-image-offset-y")
              ) {
                control.style.display =
                  triggerControl.value === "manual" ? "block" : "none";
              }
            }
            // For text color controls
            else if (triggerControlId === "text-color-type") {
              if (controlId === "text-color") {
                control.style.display =
                  triggerControl.value === "solid" ? "block" : "none";
              } else if (controlId && controlId.startsWith("text-gradient-")) {
                control.style.display =
                  triggerControl.value === "gradient" ? "block" : "none";
              }
            } else if (triggerControlId === "text2-color-type") {
              if (controlId === "text2-color") {
                control.style.display =
                  triggerControl.value === "solid" ? "block" : "none";
              } else if (controlId && controlId.startsWith("text2-gradient-")) {
                control.style.display =
                  triggerControl.value === "gradient" ? "block" : "none";
              }
            }
            // For border style controls
            else if (triggerControlId === "border-style") {
              if (controlId === "border-rainbow-speed") {
                control.style.display =
                  triggerControl.value === "rainbow" ? "block" : "none";
              } else if (controlId === "border-march-speed") {
                control.style.display =
                  triggerControl.value === "marching-ants" ? "block" : "none";
              }
            } else {
              // Default: show when any value is selected
              control.style.display = triggerControl.value ? "block" : "none";
            }
          }
        };

        // Initial visibility
        updateVisibility();

        // Update on change
        triggerControl.addEventListener("change", updateVisibility);
        triggerControl.addEventListener("input", updateVisibility);
      }
    });
  }
}

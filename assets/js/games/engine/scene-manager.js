// Scene Manager - Handles scene definitions, rendering, and transitions
class SceneManager {
  constructor(adapter, stateManager, inputManager) {
    this.adapter = adapter;
    this.state = stateManager;
    this.input = inputManager;
    this.scenes = {};
    this.currentScene = null;
    this.sceneHistory = [];
  }

  // Register scenes from game definition
  registerScenes(sceneDefinitions) {
    for (const [id, scene] of Object.entries(sceneDefinitions)) {
      this.scenes[id] = { id, ...scene };
    }
  }

  // Get scene by ID
  getScene(sceneId) {
    return this.scenes[sceneId];
  }

  // Navigate to a scene
  async goTo(sceneId, options = {}) {
    const scene = this.getScene(sceneId);
    if (!scene) {
      this.adapter.printError(`Scene not found: ${sceneId}`);
      return;
    }

    // Track history for back navigation
    if (this.currentScene && !options.noHistory) {
      this.sceneHistory.push(this.currentScene.id);
    }

    this.currentScene = scene;

    // Execute onEnter actions
    if (scene.onEnter) {
      await this._executeActions(scene.onEnter);
    }

    // Render the scene
    await this._renderScene(scene);
  }

  // Go back to previous scene
  async goBack() {
    if (this.sceneHistory.length === 0) {
      this.adapter.printWarning("No previous scene");
      return;
    }
    const previousId = this.sceneHistory.pop();
    await this.goTo(previousId, { noHistory: true });
  }

  // Render a scene
  async _renderScene(scene) {
    // Clear screen unless disabled
    if (scene.clear !== false) {
      this.adapter.clear();
    }

    // Render title
    if (scene.title) {
      this.adapter.printHTML(
        `<span class="game-scene-title">${scene.title}</span>`,
      );
      this.adapter.print("");
    }

    // Render content blocks
    if (scene.content) {
      await this._renderContent(scene.content);
    }

    // Execute onAfterRender actions (after content, before options)
    if (scene.onAfterRender) {
      await this._executeActions(scene.onAfterRender);
    }

    // Handle navigation
    if (scene.options) {
      await this._handleOptions(scene);
    } else if (scene.input) {
      await this._handleTextInput(scene);
    } else if (scene.next) {
      // Auto-advance with optional delay
      const delay = scene.delay || 0;
      if (delay > 0) {
        await this._sleep(delay);
      }
      await this.goTo(scene.next);
    }
  }

  // Render content blocks (supports conditional content)
  async _renderContent(content) {
    const blocks = Array.isArray(content) ? content : [content];

    for (const block of blocks) {
      // Simple string
      if (typeof block === "string") {
        this._printText(block);
        continue;
      }

      // Conditional block
      if (block.condition !== undefined) {
        if (this.state.evaluate(block.condition)) {
          if (block.content) {
            await this._renderContent(block.content);
          }
        } else if (block.else) {
          await this._renderContent(block.else);
        }
        continue;
      }

      // Typed blocks
      if (block.type === "ascii") {
        this.adapter.print(block.art, block.className || "game-ascii");
        continue;
      }

      if (block.type === "ansi") {
        // Convert ANSI escape codes to HTML
        const html = AnsiConverter.convertToBlock(
          block.art,
          block.className || "game-ansi-art",
        );
        this.adapter.printHTML(html);
        continue;
      }

      if (block.type === "html") {
        this.adapter.printHTML(block.html, block.className || "");
        continue;
      }

      if (block.type === "delay") {
        await this._sleep(block.ms || 1000);
        continue;
      }

      if (block.type === "typewriter") {
        await this._typewriter(block.text, block.speed || 50);
        continue;
      }

      if (block.type === "table") {
        await this._renderTable(block);
        continue;
      }

      // Text with optional className (supports html: true for HTML content)
      if (block.text !== undefined) {
        if (block.html) {
          this._printHTML(block.text, block.className || "");
        } else {
          this._printText(block.text, block.className || "");
        }
        continue;
      }
    }
  }

  // Print text with variable interpolation
  _printText(text, className = "") {
    // Support ${path} interpolation
    const interpolated = text.replace(/\$\{([^}]+)\}/g, (match, path) => {
      const value = this.state.get(path);
      return value !== undefined ? String(value) : match;
    });

    if (className) {
      this.adapter.print(interpolated, className);
    } else {
      this.adapter.print(interpolated);
    }
  }

  // Print HTML with variable interpolation
  _printHTML(html, className = "") {
    // Support ${path} interpolation
    const interpolated = html.replace(/\$\{([^}]+)\}/g, (match, path) => {
      const value = this.state.get(path);
      return value !== undefined ? String(value) : match;
    });

    if (className) {
      this.adapter.printHTML(`<span class="${className}">${interpolated}</span>`);
    } else {
      this.adapter.printHTML(interpolated);
    }
  }

  // Handle options/choices
  async _handleOptions(scene) {
    // Filter options based on conditions
    const availableOptions = scene.options.filter((opt) => {
      if (opt.condition !== undefined) {
        return this.state.evaluate(opt.condition);
      }
      return true;
    });

    if (availableOptions.length === 0) {
      if (scene.fallback) {
        await this.goTo(scene.fallback);
      }
      return;
    }

    const result = await this.input.awaitOption(
      availableOptions.map((o) => ({
        text: this._interpolateText(o.text),
        value: o,
      })),
      scene.prompt || "What do you do?",
    );

    const selected = result.option.value;

    // Execute option actions
    if (selected.actions) {
      await this._executeActions(selected.actions);
    }

    // Navigate to next scene
    if (selected.next) {
      await this.goTo(selected.next);
    }
  }

  // Handle text input
  async _handleTextInput(scene) {
    const inputDef = scene.input;
    const value = await this.input.awaitText(inputDef.prompt);

    // Store value if specified
    if (inputDef.store) {
      this.state.set(inputDef.store, value);
    }

    // Check for pattern matches
    if (inputDef.matches) {
      for (const match of inputDef.matches) {
        const pattern =
          match.pattern instanceof RegExp
            ? match.pattern
            : new RegExp(match.pattern, "i");

        if (pattern.test(value)) {
          if (match.actions) {
            await this._executeActions(match.actions);
          }
          if (match.next) {
            await this.goTo(match.next);
          }
          return;
        }
      }
    }

    // No match - use default
    if (inputDef.default) {
      if (inputDef.default.actions) {
        await this._executeActions(inputDef.default.actions);
      }
      if (inputDef.default.next) {
        await this.goTo(inputDef.default.next);
      }
    } else if (inputDef.next) {
      await this.goTo(inputDef.next);
    }
  }

  // Execute action commands
  async _executeActions(actions) {
    const actionList = Array.isArray(actions) ? actions : [actions];

    for (const action of actionList) {
      if (action.set !== undefined) {
        this.state.set(action.set, action.value);
      }

      if (action.increment !== undefined) {
        this.state.increment(action.increment, action.amount || 1);
      }

      if (action.decrement !== undefined) {
        this.state.decrement(action.decrement, action.amount || 1);
      }

      if (action.addItem !== undefined) {
        this.state.addToArray(action.to || "inventory", action.addItem);
      }

      if (action.removeItem !== undefined) {
        this.state.removeFromArray(
          action.from || "inventory",
          action.removeItem,
        );
      }

      if (action.print !== undefined) {
        this._printText(action.print, action.className || "");
      }

      if (action.printSuccess !== undefined) {
        this.adapter.printSuccess(this._interpolateText(action.printSuccess));
      }

      if (action.printError !== undefined) {
        this.adapter.printError(this._interpolateText(action.printError));
      }

      if (action.printWarning !== undefined) {
        this.adapter.printWarning(this._interpolateText(action.printWarning));
      }

      if (action.printInfo !== undefined) {
        this.adapter.printInfo(this._interpolateText(action.printInfo));
      }

      if (action.delay !== undefined) {
        await this._sleep(action.delay);
      }

      if (action.goTo !== undefined) {
        await this.goTo(action.goTo);
        return; // Stop processing further actions after navigation
      }

      if (action.callback && typeof action.callback === "function") {
        await action.callback(this.state, this.adapter, this);
      }
    }
  }

  // Interpolate variables in text
  _interpolateText(text) {
    if (typeof text !== "string") return text;
    return text.replace(/\$\{([^}]+)\}/g, (match, path) => {
      const value = this.state.get(path);
      return value !== undefined ? String(value) : match;
    });
  }

  // Typewriter effect
  async _typewriter(text, speed) {
    const interpolated = this._interpolateText(text);
    let output = "";

    for (const char of interpolated) {
      output += char;
      // Create a single updating line for typewriter
      const typewriterSpan =
        this.adapter.terminal.output.querySelector(".typewriter-line");

      if (typewriterSpan) {
        typewriterSpan.textContent = output;
      } else {
        this.adapter.printHTML(
          `<span class="typewriter-line">${output}</span>`,
        );
      }

      this.adapter.scrollToBottom();
      await this._sleep(speed);
    }

    // Finalize the line - remove the typewriter-line class so future typewriters create new lines
    const typewriterSpan =
      this.adapter.terminal.output.querySelector(".typewriter-line");
    if (typewriterSpan) {
      typewriterSpan.classList.remove("typewriter-line");
    }
  }

  _sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Render a dynamic table with conditional row support
  async _renderTable(block) {
    // Filter rows based on conditions
    const filteredRows = [];
    for (const row of block.rows || []) {
      // Row can be: array of cells, or object with { cells, condition, className }
      if (Array.isArray(row)) {
        // Simple row - array of cells
        filteredRows.push(row);
      } else if (row.condition !== undefined) {
        // Conditional row
        if (this.state.evaluate(row.condition)) {
          filteredRows.push(this._processTableRow(row));
        }
      } else if (row.cells) {
        // Object row without condition
        filteredRows.push(this._processTableRow(row));
      }
    }

    // Build table using TableHelper
    const tableOutput = TableHelper.table({
      title: block.title ? this._interpolateText(block.title) : undefined,
      headers: block.headers,
      rows: filteredRows,
      widths: block.widths,
      align: block.align,
      style: block.style || "single",
      padding: block.padding,
    });

    // Render each line of the table
    for (const line of tableOutput) {
      if (typeof line === "string") {
        this._printText(line);
      } else if (line.text) {
        this._printText(line.text, line.className || "");
      }
    }
  }

  // Process a table row object into cell array format for TableHelper
  _processTableRow(row) {
    // If row has className, apply it to cells that don't have their own
    const cells = row.cells.map((cell) => {
      if (typeof cell === "string" && row.className) {
        return { text: this._interpolateText(cell), className: row.className };
      } else if (typeof cell === "object" && cell.text) {
        return {
          text: this._interpolateText(cell.text),
          className: cell.className || row.className,
        };
      }
      return typeof cell === "string" ? this._interpolateText(cell) : cell;
    });
    return cells;
  }

  // Get current scene ID
  getCurrentSceneId() {
    return this.currentScene ? this.currentScene.id : null;
  }

  // Reset scene history
  resetHistory() {
    this.sceneHistory = [];
  }
}

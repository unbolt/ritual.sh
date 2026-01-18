// Input Manager - Handles text input and option selection modes
class InputManager {
  constructor(adapter) {
    this.adapter = adapter;
    this.mode = "idle"; // "idle" | "text" | "options"
    this.options = [];
    this.selectedIndex = 0;
    this.inputResolve = null;
    this.optionsContainerId = "game-options-" + Date.now();
    this.keydownHandler = null;

    this._setupKeyboardListener();
  }

  _setupKeyboardListener() {
    this.keydownHandler = (e) => {
      if (this.mode !== "options") return;

      if (e.key === "ArrowUp") {
        e.preventDefault();
        e.stopPropagation();
        this._selectPrevious();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        e.stopPropagation();
        this._selectNext();
      } else if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        this._confirmSelection();
      } else if (/^[1-9]$/.test(e.key)) {
        const index = parseInt(e.key) - 1;
        if (index < this.options.length) {
          e.preventDefault();
          e.stopPropagation();
          this.selectedIndex = index;
          this._confirmSelection();
        }
      }
    };

    document.addEventListener("keydown", this.keydownHandler, true);
  }

  // Text input mode - wait for user to type something
  awaitText(prompt = "") {
    return new Promise((resolve) => {
      if (prompt) {
        this.adapter.printInfo(prompt);
      }

      this.mode = "text";
      this.inputResolve = resolve;

      this.adapter.captureInput((value) => {
        this.adapter.print(`> ${value}`);
        this.mode = "idle";
        this.adapter.releaseInput();
        if (this.inputResolve) {
          const res = this.inputResolve;
          this.inputResolve = null;
          res(value);
        }
      });

      this.adapter.focusInput();
    });
  }

  // Options selection mode - display choices and wait for selection
  awaitOption(options, prompt = "") {
    return new Promise((resolve) => {
      this.mode = "options";
      this.options = options;
      this.selectedIndex = 0;
      this.optionsContainerId = "game-options-" + Date.now();

      if (prompt) {
        this.adapter.print("");
        this.adapter.printInfo(prompt);
      }
      this.adapter.print("");

      this._renderOptions();

      this.inputResolve = (index) => {
        this.mode = "idle";
        resolve({
          index,
          option: this.options[index],
        });
      };
    });
  }

  // Yes/No confirmation
  awaitConfirm(prompt = "Continue?") {
    return this.awaitOption(
      [
        { text: "Yes", value: true },
        { text: "No", value: false },
      ],
      prompt,
    ).then((result) => result.option.value);
  }

  // Handle text input from game engine
  handleTextInput(value) {
    if (this.mode === "text" && this.inputResolve) {
      this.adapter.print(`> ${value}`);
      this.mode = "idle";
      const res = this.inputResolve;
      this.inputResolve = null;
      res(value);
    }
  }

  _renderOptions() {
    const optionsHTML = this.options
      .map((opt, idx) => {
        const selected = idx === this.selectedIndex;
        const prefix = selected ? ">" : " ";
        const className = selected ? "game-option-selected" : "game-option";
        const text = typeof opt === "string" ? opt : opt.text;
        return `<div class="${className}" data-index="${idx}">${prefix} ${idx + 1}. ${text}</div>`;
      })
      .join("");

    this.adapter.printHTML(
      `<div id="${this.optionsContainerId}" class="game-options">${optionsHTML}</div>`,
    );
    this.adapter.scrollToBottom();
  }

  _updateOptionsDisplay() {
    const container = document.getElementById(this.optionsContainerId);
    if (!container) return;

    const optionDivs = container.querySelectorAll("div");
    optionDivs.forEach((div, idx) => {
      const selected = idx === this.selectedIndex;
      div.className = selected ? "game-option-selected" : "game-option";
      const text =
        typeof this.options[idx] === "string"
          ? this.options[idx]
          : this.options[idx].text;
      div.textContent = `${selected ? ">" : " "} ${idx + 1}. ${text}`;
    });
  }

  _selectPrevious() {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
      this._updateOptionsDisplay();
    }
  }

  _selectNext() {
    if (this.selectedIndex < this.options.length - 1) {
      this.selectedIndex++;
      this._updateOptionsDisplay();
    }
  }

  _confirmSelection() {
    if (this.inputResolve) {
      const res = this.inputResolve;
      this.inputResolve = null;

      // Show what was selected
      const selectedOpt = this.options[this.selectedIndex];
      const text =
        typeof selectedOpt === "string" ? selectedOpt : selectedOpt.text;
      this.adapter.print("");
      this.adapter.printSuccess(`> ${text}`);

      res(this.selectedIndex);
    }
  }

  // Check if currently waiting for input
  isWaiting() {
    return this.mode !== "idle";
  }

  // Get current mode
  getMode() {
    return this.mode;
  }

  // Cancel current input (for cleanup)
  cancel() {
    this.mode = "idle";
    this.inputResolve = null;
    this.adapter.releaseInput();
  }

  // Cleanup when game ends
  destroy() {
    if (this.keydownHandler) {
      document.removeEventListener("keydown", this.keydownHandler, true);
    }
    this.cancel();
  }
}

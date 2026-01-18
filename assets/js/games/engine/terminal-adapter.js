// Terminal Adapter - Bridges game engine to existing TerminalShell
class TerminalAdapter {
  constructor(terminal) {
    this.terminal = terminal;
    this.inputCallback = null;
  }

  // Output methods - delegate to terminal
  print(text, className = "") {
    this.terminal.print(text, className);
  }

  printHTML(html, className = "") {
    this.terminal.printHTML(html, className);
  }

  printError(text) {
    this.terminal.printError(text);
  }

  printSuccess(text) {
    this.terminal.printSuccess(text);
  }

  printInfo(text) {
    this.terminal.printInfo(text);
  }

  printWarning(text) {
    this.terminal.printWarning(text);
  }

  clear() {
    this.terminal.clear();
  }

  scrollToBottom() {
    this.terminal.scrollToBottom();
  }

  // Input capture - allows game to intercept terminal input
  captureInput(callback) {
    this.inputCallback = callback;
  }

  releaseInput() {
    this.inputCallback = null;
  }

  // Called by game engine when input is received
  handleInput(value) {
    if (this.inputCallback) {
      this.inputCallback(value);
      return true;
    }
    return false;
  }

  // Get the input element for focus management
  getInputElement() {
    return this.terminal.input;
  }

  // Focus the input
  focusInput() {
    if (this.terminal.input) {
      this.terminal.input.focus();
    }
  }
}

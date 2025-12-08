// Terminal Initialization Script
// This script creates the terminal instance immediately
// so command modules can register commands

// Create global terminal instance immediately
window.terminal = new TerminalShell();

// Boot the terminal when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    terminal.boot();
  });
} else {
  // DOM already loaded
  terminal.boot();
}

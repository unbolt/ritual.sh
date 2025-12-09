// Terminal Initialization Script
// This script creates the terminal instance only if terminal element exists

window.terminal = new TerminalShell();

// Function to initialize terminal
function initTerminal() {
  // Check if terminal element exists
  if (document.getElementById("terminal")) {
    // Boot the terminal
    terminal.boot();
  }
}

// Wait for DOM to be ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTerminal);
} else {
  // DOM already loaded
  initTerminal();
}

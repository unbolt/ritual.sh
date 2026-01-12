// Terminal Initialization Script
// This script creates the terminal instance only if terminal element exists

window.terminal = new TerminalShell();

// Analytics tracking
function sendAnalyticsHit() {
  fetch('https://api.ritual.sh/analytics/hit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }).catch(err => {
    // Silently fail - don't block page load on analytics errors
    console.debug('Analytics tracking failed:', err);
  });
}

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
  document.addEventListener("DOMContentLoaded", () => {
    initTerminal();
    sendAnalyticsHit();
  });
} else {
  // DOM already loaded
  initTerminal();
  sendAnalyticsHit();
}

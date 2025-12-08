// Navigation Commands Module
// Commands for navigating to different pages or URLs

// Navigate to URL command
window.terminal.registerCommand("goto", "Navigate to a URL", (args) => {
  if (args.length === 0) {
    window.terminal.printError("Usage: goto <url>");
    window.terminal.print("Examples:");
    window.terminal.print("  goto google.com");
    window.terminal.print("  goto https://github.com");
    return;
  }

  const url = args[0];
  window.terminal.printInfo(`Navigating to ${url}...`);

  setTimeout(() => {
    window.location.href = url.startsWith("http") ? url : `https://${url}`;
  }, 500);
});

// Open in new tab command
window.terminal.registerCommand("open", "Open URL in new tab", (args) => {
  if (args.length === 0) {
    window.terminal.printError("Usage: open <url>");
    window.terminal.print("Examples:");
    window.terminal.print("  open google.com");
    window.terminal.print("  open https://github.com");
    return;
  }

  const url = args[0];
  window.terminal.printInfo(`Opening ${url} in new tab...`);

  const fullUrl = url.startsWith("http") ? url : `https://${url}`;
  window.open(fullUrl, "_blank");
});

// Reload page command
window.terminal.registerCommand("reload", "Reload the current page", () => {
  window.terminal.printInfo("Reloading page...");
  setTimeout(() => {
    window.location.reload();
  }, 500);
});

// PAGE NAVIGATION

// About command
window.terminal.registerCommand("about", "About this site", () => {
  window.location.href = "/about/";
});

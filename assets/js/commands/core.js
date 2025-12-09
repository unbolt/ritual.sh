// Core Commands Module
if (window.terminal) {
  // Help command
  window.terminal.registerCommand("help", "Display available commands", () => {
    window.terminal.print("Available commands:", "success");
    window.terminal.print("");

    const commands = Object.keys(window.terminal.commands).sort();
    commands.forEach((cmd) => {
      const desc =
        window.terminal.commands[cmd].description || "No description";
      window.terminal.print(`  ${cmd.padEnd(15)} - ${desc}`);
    });
    window.terminal.print("");
  });

  // Clear command
  window.terminal.registerCommand("clear", "Clear the terminal screen", () => {
    window.terminal.clear();
  });

  // Echo command
  window.terminal.registerCommand(
    "echo",
    "Echo text to the terminal",
    (args) => {
      window.terminal.print(args.join(" "));
    },
  );

  // History command
  window.terminal.registerCommand("history", "Show command history", () => {
    if (window.terminal.history.length === 0) {
      window.terminal.print("No commands in history");
      return;
    }

    window.terminal.print("Command history:", "info");
    window.terminal.history
      .slice()
      .reverse()
      .forEach((cmd, idx) => {
        window.terminal.print(`  ${idx + 1}. ${cmd}`);
      });
  });
}

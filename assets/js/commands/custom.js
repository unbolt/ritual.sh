// Custom Commands Module
// Add your custom commands here!
// This file is a template for creating your own commands

// Example: Weather command (placeholder)
// window.terminal.registerCommand(
//   "weather",
//   "Show weather information",
//   (args) => {
//     const city = args.length > 0 ? args.join(" ") : "your location";
//     window.terminal.printInfo(`Fetching weather for ${city}...`);
//     window.terminal.print("☀️  Sunny, 72°F");
//     window.terminal.print("");
//     window.terminal.printWarning(
//       "Note: This is a placeholder. Integrate with a real weather API!",
//     );
//   },
// );

// Example: Random quote
// window.terminal.registerCommand("quote", "Display a random quote", () => {
//   const quotes = [
//     "The only way to do great work is to love what you do. - Steve Jobs",
//     "Innovation distinguishes between a leader and a follower. - Steve Jobs",
//     "Stay hungry, stay foolish. - Steve Jobs",
//     "First, solve the problem. Then, write the code. - John Johnson",
//   ];

//   const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
//   window.terminal.printSuccess(randomQuote);
// });

// Example: List command (demonstrates dynamic content)
// window.terminal.registerCommand(
//   "list",
//   "List items in a collection",
//   (args) => {
//     if (args.length === 0) {
//       window.terminal.printError("Usage: list <category>");
//       window.terminal.print("Available categories: files, users, tasks");
//       return;
//     }

//     const category = args[0].toLowerCase();

//     switch (category) {
//       case "files":
//         window.terminal.print("Files:", "info");
//         window.terminal.print("  📄 document.txt");
//         window.terminal.print("  📄 notes.md");
//         window.terminal.print("  📁 projects/");
//         break;
//       case "users":
//         window.terminal.print("Users:", "info");
//         window.terminal.print("  👤 admin");
//         window.terminal.print("  👤 guest");
//         break;
//       case "tasks":
//         window.terminal.print("Tasks:", "info");
//         window.terminal.print("  ✓ Complete terminal setup");
//         window.terminal.print("  ☐ Add more commands");
//         window.terminal.print("  ☐ Customize appearance");
//         break;
//       default:
//         window.terminal.printError(`Unknown category: ${category}`);
//     }
//   },
// );

// Example: Color command (demonstrates HTML output)
window.terminal.registerCommand("colors", "Display available colors", () => {
  window.terminal.print("Available terminal colors:", "info");
  window.terminal.print("");
  window.terminal.printHTML("<span>● Standard (green)</span>");
  window.terminal.printHTML('<span class="error">● Error (red)</span>');
  window.terminal.printHTML(
    '<span class="success">● Success (bright green)</span>',
  );
  window.terminal.printHTML('<span class="info">● Info (blue)</span>');
  window.terminal.printHTML('<span class="warning">● Warning (orange)</span>');
});

// ADD YOUR OWN COMMANDS BELOW THIS LINE
// ========================================

// Template for new command:
/*
window.terminal.registerCommand('commandname', 'Command description', (args) => {
    // args is an array of arguments
    // Example: if user types "mycommand hello world"
    // args will be ['hello', 'world']
    
    // Print output using:
    window.terminal.print('Regular text');
    window.terminal.printSuccess('Success message');
    window.terminal.printError('Error message');
    window.terminal.printInfo('Info message');
    window.terminal.printWarning('Warning message');
    window.terminal.printHTML('<strong>HTML content</strong>');
});
*/

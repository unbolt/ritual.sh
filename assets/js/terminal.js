// Terminal Shell System
class TerminalShell {
  constructor() {
    this.output = document.getElementById("output");
    this.input = document.getElementById("input");
    this.inputContainer = document.getElementById("input-container");
    this.history = [];
    this.historyIndex = -1;
    this.commands = {};

    this.setupEventListeners();
  }

  // Boot sequence
  async boot() {
    const bootMessages = [
      "  _   _ _____ ______     __",
      " | \\ | | ____|  _ \\ \\   / /",
      " |  \\| |  _| | |_) \\ \\ / / ",
      " | |\\  | |___|  _ < \\ V /  ",
      " |_| \\_|_____|_| \\_\\ \\_/   ",
      "",
      "NERV OS v2.015 - MAGI System Interface",
      "Initializing A.T. Field protocols...",
      "CASPER... ONLINE",
      "BALTHASAR... ONLINE",
      "MELCHIOR... ONLINE",
      "Synchronization ratio: 41.3%... 67.8%... 89.2%... OK",
      "Loading Evangelion Unit-01 core drivers... OK",
      "Mounting LCL interface... OK",
      "Neural connection established... OK",
      "",
      "Running pattern analysis... PATTERN BLUE",
      "",
      "All systems optimal.",
      "",
      "",
    ];
    for (let i = 0; i < bootMessages.length; i++) {
      await this.sleep(100);
      const line = document.createElement("div");
      line.className = "output-line boot-line";
      line.textContent = bootMessages[i];
      line.style.animationDelay = "0s";
      this.output.appendChild(line);
      this.scrollToBottom();
    }

    this.printHTML(
      '<span class="info">Type "help" for available commands.</span>',
    );

    this.printHTML(
      '<span class="warning">This site is under contstruction. There\'s nothing of interest here yet.</span>',
    );

    this.inputContainer.classList.remove("hidden");
    this.input.focus();
  }

  // Utility function for delays
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Setup event listeners
  setupEventListeners() {
    this.input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.executeCommand(this.input.value.trim());
        this.input.value = "";
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        this.navigateHistory("up");
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        this.navigateHistory("down");
      }
    });

    // Keep input focused
    document.addEventListener("click", () => {
      this.input.focus();
    });
  }

  // Command history navigation
  navigateHistory(direction) {
    if (this.history.length === 0) return;

    if (direction === "up") {
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.input.value = this.history[this.historyIndex];
      }
    } else if (direction === "down") {
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.input.value = this.history[this.historyIndex];
      } else {
        this.historyIndex = -1;
        this.input.value = "";
      }
    }
  }

  // Execute command
  executeCommand(commandString) {
    if (!commandString) return;

    // Echo the command
    this.print(`> ${commandString}`);

    // Add to history
    this.history.unshift(commandString);
    this.historyIndex = -1;

    // Parse command and arguments
    const parts = commandString.split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Execute command
    if (this.commands[command]) {
      try {
        this.commands[command](args);
      } catch (error) {
        this.printError(`Error executing command: ${error.message}`);
      }
    } else {
      this.printError(`Command not found: ${command}`);
    }

    this.scrollToBottom();
  }

  // Register a new command
  registerCommand(name, description, callback) {
    this.commands[name.toLowerCase()] = callback;
    this.commands[name.toLowerCase()].description = description;
  }

  // Print methods
  print(text, className = "") {
    const line = document.createElement("div");
    line.className = `output-line ${className}`;

    if (typeof text === "string") {
      line.textContent = text;
    } else {
      line.appendChild(text);
    }

    this.output.appendChild(line);
  }

  printHTML(html, className = "") {
    const line = document.createElement("div");
    line.className = `output-line ${className}`;
    line.innerHTML = html;
    this.output.appendChild(line);
  }

  printError(text) {
    this.print(text, "error");
  }

  printSuccess(text) {
    this.print(text, "success");
  }

  printInfo(text) {
    this.print(text, "info");
  }

  printWarning(text) {
    this.print(text, "warning");
  }

  scrollToBottom() {
    this.output.parentElement.scrollTop =
      this.output.parentElement.scrollHeight;
  }

  // Clear the terminal
  clear() {
    this.output.innerHTML = "";
  }
}

// Game Engine - Main orchestrator for terminal games
class GameEngine {
  constructor(gameDefinition) {
    this.definition = gameDefinition;
    this.terminal = null;
    this.adapter = null;
    this.state = null;
    this.sharedState = null; // For series games
    this.input = null;
    this.sound = null;
    this.scenes = null;

    this.isRunning = false;
    this.originalExecuteCommand = null;

    // Series support
    this.seriesId = gameDefinition.seriesId || null;
    this.chapterNumber = gameDefinition.chapterNumber || null;
  }

  // Register this game as a terminal command
  register() {
    if (!window.terminal) {
      console.warn(
        "Terminal not available, cannot register game:",
        this.definition.id,
      );
      return;
    }

    this.terminal = window.terminal;
    const self = this;
    const def = this.definition;

    // this.terminal.registerCommand(
    //   def.command || def.id,
    //   def.description || `Play ${def.name}`,
    //   async (args) => {
    //     if (args[0] === "reset") {
    //       self._reset();
    //       return;
    //     }
    //     if (args[0] === "reset-series" && self.seriesId) {
    //       self._resetSeries();
    //       return;
    //     }
    //     if (args[0] === "continue" || args[0] === "resume") {
    //       await self.start(true);
    //       return;
    //     }
    //     await self.start();
    //   },
    // );
  }

  // Start the game
  async start(continueGame = false) {
    if (this.isRunning) {
      this.terminal.printWarning("Game is already running!");
      return;
    }

    // Initialize shared state for series games (do this early for chapter check)
    if (this.seriesId && window.SharedStateManager) {
      this.sharedState = new SharedStateManager(this.seriesId);
      this.sharedState.init(this.definition.sharedStateDefaults || {});

      // Check if this chapter can be played (sequential unlock)
      if (this.chapterNumber && this.chapterNumber > 1) {
        if (!this.sharedState.canPlayChapter(this.chapterNumber)) {
          const prevChapter = this.chapterNumber - 1;
          this.terminal.printError(
            `You must complete Chapter ${prevChapter} before playing Chapter ${this.chapterNumber}.`,
          );
          return;
        }
      }
    }

    // Update the global HTML to add the game in progress details
    document.body.classList.add("game-in-progress");
    console.log(document.body.classList);

    this.isRunning = true;

    // Initialize components
    this.adapter = new TerminalAdapter(this.terminal);
    this.state = new StateManager(this.definition.id, this.sharedState);
    this.input = new InputManager(this.adapter);

    // Initialize sound manager if SoundManager is available
    if (window.SoundManager) {
      this.sound = new SoundManager(this.adapter);
    }

    this.scenes = new SceneManager(
      this.adapter,
      this.state,
      this.input,
      this.sound,
    );

    // Initialize state
    this.state.init(this.definition.initialState || {});

    // Load and merge external scenes if defined
    const mergedScenes = this._getMergedScenes();

    // Register scenes
    this.scenes.registerScenes(mergedScenes);

    // Hook into terminal input
    this._hookInput();

    // Check for existing save
    const hasSave = this.state.hasSavedState();

    // Show intro unless continuing
    if (!continueGame && !hasSave) {
      if (this.definition.intro) {
        await this._playIntro();
      }
    } else if (hasSave && !continueGame) {
      // Ask if player wants to continue
      this.adapter.clear();
      this.adapter.printInfo("A saved game was found.");
      const shouldContinue = await this.input.awaitConfirm(
        "Continue from where you left off?",
      );

      if (!shouldContinue) {
        this.state.reset();
        this.state.init(this.definition.initialState || {});
        if (this.definition.intro) {
          await this._playIntro();
        }
      }
    }

    // Go to start scene (or last scene if continuing)
    const startScene =
      this.state.get("_currentScene") || this.definition.startScene || "start";
    await this.scenes.goTo(startScene);
  }

  async _playIntro() {
    this.adapter.clear();

    // Show title
    if (this.definition.name) {
      this.adapter.printHTML(
        `<div class="game-title">${this.definition.name}</div>`,
      );
      this.adapter.print("");
    }

    // Show intro content
    if (typeof this.definition.intro === "string") {
      this.adapter.print(this.definition.intro);
    } else if (Array.isArray(this.definition.intro)) {
      await this.scenes._renderContent(this.definition.intro);
    }

    this.adapter.print("");

    // Wait for input to continue
    await this.input.awaitOption(
      [{ text: "Begin", value: true }],
      "Press Enter or 1 to start...",
    );
  }

  _hookInput() {
    // Store original executeCommand
    this.originalExecuteCommand = this.terminal.executeCommand.bind(
      this.terminal,
    );

    // Override to intercept input
    const self = this;
    this.terminal.executeCommand = function (commandString) {
      if (!self.isRunning) {
        return self.originalExecuteCommand(commandString);
      }

      // Check for exit commands
      const cmd = commandString.toLowerCase().trim();
      if (cmd === "quit" || cmd === "exit" || cmd === "q") {
        self.stop();
        return;
      }

      // Check for save command
      if (cmd === "save") {
        self._saveProgress();
        return;
      }

      // Check for debug scene skip command (goto <sceneName>)
      if (cmd.startsWith("goto ")) {
        const sceneName = commandString.trim().substring(5).trim();
        self._debugGoToScene(sceneName);
        return;
      }

      // Pass to input manager if in text mode
      if (self.input.getMode() === "text") {
        self.input.handleTextInput(commandString);
      }
    };
  }

  _saveProgress() {
    // Save current scene for resuming
    const currentSceneId = this.scenes.getCurrentSceneId();
    if (currentSceneId) {
      this.state.set("_currentScene", currentSceneId);
    }
    this.adapter.printSuccess("Game progress saved.");
  }

  // Stop the game and restore terminal
  stop() {
    // Save progress before stopping
    this._saveProgress();

    // Update the global HTML to remove the game in progress details
    document.body.classList.remove("game-in-progress");

    this.isRunning = false;

    // Cleanup sound manager
    if (this.sound) {
      this.sound.stopAll();
    }

    // Cleanup input manager
    if (this.input) {
      this.input.destroy();
    }

    // Restore original command handler
    if (this.originalExecuteCommand) {
      this.terminal.executeCommand = this.originalExecuteCommand;
    }

    this.adapter.print("");
    this.adapter.printInfo(`Exited ${this.definition.name}. Progress saved.`);
    this.adapter.print('Type "help" for available commands.');
    this.adapter.print(
      `Type "${this.definition.command || this.definition.id}" to continue playing.`,
    );
  }

  _reset() {
    if (this.state) {
      this.state.reset();
    } else {
      // Create temporary state manager just to reset
      const tempState = new StateManager(this.definition.id);
      tempState.reset();
    }
    this.terminal.printSuccess(
      `${this.definition.name} progress has been reset.`,
    );
  }

  // Reset entire series progress (for series games)
  _resetSeries() {
    // Reset chapter state
    this._reset();

    // Reset shared state
    if (this.seriesId) {
      const sharedState = new SharedStateManager(this.seriesId);
      sharedState.reset();
      this.terminal.printSuccess(
        `All ${this.definition.name} series progress has been reset.`,
      );
    }
  }

  // Create context for scene factories
  _createSceneContext() {
    return {
      chapterNumber: this.chapterNumber || 1,
      seriesId: this.seriesId,
      sharedState: this.sharedState,
      art: this.definition.art || {},
      additionalOptions: this.definition.additionalHubOptions || [],
    };
  }

  // Load external scenes and merge with inline scenes
  _getMergedScenes() {
    const inlineScenes = this.definition.scenes || {};

    // If no external scenes defined, just return inline scenes
    if (
      !this.definition.externalScenes ||
      this.definition.externalScenes.length === 0
    ) {
      return inlineScenes;
    }

    // Load external scenes from registered factories
    const externalScenes = {};
    const context = this._createSceneContext();

    for (const sceneRef of this.definition.externalScenes) {
      const factory = window.SceneFactories?.[sceneRef];
      if (factory) {
        try {
          const scenes = factory(context);
          Object.assign(externalScenes, scenes);
        } catch (e) {
          console.error(`Failed to load external scenes from ${sceneRef}:`, e);
        }
      } else {
        console.warn(`Scene factory not found: ${sceneRef}`);
      }
    }

    // Inline scenes override external scenes (allows chapter-specific overrides)
    return { ...externalScenes, ...inlineScenes };
  }

  // Debug command to skip to a specific scene
  async _debugGoToScene(sceneName) {
    const scene = this.scenes.getScene(sceneName);
    if (!scene) {
      this.adapter.printError(`Scene not found: ${sceneName}`);
      this.adapter.print("");
      this.adapter.printInfo("Available scenes:");
      const sceneNames = Object.keys(this.definition.scenes).sort();
      for (const name of sceneNames) {
        this.adapter.print(`  ${name}`);
      }
      return;
    }
    this.adapter.printWarning(`[DEBUG] Skipping to scene: ${sceneName}`);
    await this.scenes.goTo(sceneName);
  }

  // Check if game is currently running
  isActive() {
    return this.isRunning;
  }

  // Get game definition
  getDefinition() {
    return this.definition;
  }
}

// Make available globally
window.GameEngine = GameEngine;

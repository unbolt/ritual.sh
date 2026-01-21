// Test Adventure - A simple game to test the game engine
const testAdventureGame = {
  id: "test-adventure",
  name: "Terminal Quest",
  command: "quest",
  description: "A test adventure game",

  initialState: {
    gold: 0,
    inventory: [],
    visited: {},
  },

  intro: [
    {
      type: "ascii",
      art: `
  ╔════════════════════════════════╗
  ║      TERMINAL QUEST            ║
  ║      A Test Adventure          ║
  ╚════════════════════════════════╝
    `,
      className: "game-ascii",
    },
    "",
    "You wake up in a strange digital world...",
    { type: "delay", ms: 800 },
    "The cursor blinks patiently before you.",
    "",
    { text: 'Type "quit" at any time to exit.', className: "info" },
  ],

  startScene: "start",

  scenes: {
    start: {
      title: "The Terminal",
      content: [
        "You find yourself at a command prompt.",
        "A green cursor blinks steadily in the darkness.",
        "",
        {
          condition: { path: "visited.start" },
          content: { text: "You've been here before...", className: "info" },
        },
        {
          condition: { path: "gold", greaterThan: 0 },
          content: "Your gold pouch jingles with ${gold} coins.",
        },
      ],
      onEnter: [{ set: "visited.start", value: true }],
      options: [
        { text: "Look around", next: "look-around" },
        { text: "Check inventory", next: "inventory" },
        {
          text: "Enter the code cave",
          condition: { path: "inventory", contains: "flashlight" },
          next: "code-cave",
        },
        {
          text: "Talk to the cursor",
          condition: { not: { path: "visited.cursor-talk" } },
          next: "cursor-talk",
        },
        { text: "Test glitch effect", next: "glitch-demo" },
      ],
    },

    "glitch-demo": {
      title: "Glitch Effect Demo",
      content: [
        "The terminal screen begins to distort...",
        { type: "delay", ms: 800 },
        "",
        {
          type: "glitch",
          text: "REALITY CORRUPTING",
          intensity: 0.5,
          spread: 3,
          duration: 2500,
        },
        "",
        { type: "delay", ms: 500 },
        "The corruption spreads across nearby lines...",
        { type: "delay", ms: 600 },
        "",
        {
          type: "glitch",
          text: "ERROR: MEMORY FAULT AT 0x7FFFFFFF",
          intensity: 0.7,
          spread: 4,
          speed: 40,
          duration: 3000,
          className: "error glitch-text",
        },
        "",
        { type: "delay", ms: 500 },
        "A subtle glitch flickers briefly...",
        { type: "delay", ms: 400 },
        "",
        {
          type: "glitch",
          text: "Connection unstable",
          intensity: 0.2,
          spread: 1,
          duration: 1500,
        },
        "",
        { type: "delay", ms: 300 },
        "The screen stabilizes again.",
      ],
      options: [{ text: "Back to start", next: "start" }],
    },

    "look-around": {
      title: "Searching...",
      content: ["You search the area carefully...", { type: "delay", ms: 500 }],
      onEnter: [
        {
          callback: (state, adapter) => {
            // Random chance to find gold
            if (Math.random() > 0.5) {
              const found = Math.floor(Math.random() * 10) + 1;
              state.increment("gold", found);
              adapter.printSuccess(`You found ${found} gold coins!`);
            } else {
              adapter.print("You don't find anything this time.");
            }
          },
        },
      ],
      next: "start",
      delay: 1000,
    },

    inventory: {
      title: "Inventory",
      clear: false,
      content: [
        "",
        "=== Your Inventory ===",
        { text: "Gold: ${gold}", className: "warning" },
        "",
        {
          condition: { path: "inventory", contains: "flashlight" },
          content: "- Flashlight (lights up dark places)",
        },
        {
          condition: { path: "inventory", contains: "key" },
          content: "- Mysterious Key",
        },
        {
          condition: {
            and: [
              { not: { path: "inventory", contains: "flashlight" } },
              { not: { path: "inventory", contains: "key" } },
            ],
          },
          content: { text: "Your inventory is empty.", className: "info" },
        },
        "",
      ],
      options: [{ text: "Back", next: "start" }],
    },

    "cursor-talk": {
      title: "The Blinking Cursor",
      content: [
        "The cursor seems to acknowledge you.",
        "",
        { type: "typewriter", text: "HELLO, USER.", speed: 80 },
        { type: "delay", ms: 500 },
        { type: "typewriter", text: "I HAVE BEEN WAITING FOR YOU.", speed: 60 },
        { type: "delay", ms: 300 },
        "",
        "The cursor offers you something...",
      ],
      onEnter: [
        { set: "visited.cursor-talk", value: true },
        { addItem: "flashlight" },
        { printSuccess: "You received a flashlight!" },
      ],
      options: [
        { text: "Thank the cursor", next: "cursor-thanks" },
        { text: "Ask about the code cave", next: "cursor-cave-info" },
      ],
    },

    "cursor-thanks": {
      content: [
        { type: "typewriter", text: "YOU ARE WELCOME, USER.", speed: 60 },
        "",
        "The cursor resumes its patient blinking.",
      ],
      next: "start",
      delay: 1500,
    },

    "cursor-cave-info": {
      content: [
        { type: "typewriter", text: "THE CAVE HOLDS SECRETS...", speed: 60 },
        { type: "delay", ms: 300 },
        { type: "typewriter", text: "USE THE LIGHT TO FIND THEM.", speed: 60 },
        "",
        "The cursor dims slightly, as if tired from speaking.",
      ],
      next: "start",
      delay: 1500,
    },

    "code-cave": {
      title: "The Code Cave",
      content: [
        "Your flashlight illuminates a cavern of glowing text.",
        "Ancient code scrolls across the walls.",
        "",
        {
          type: "ascii",
          art: `
    function mystery() {
      return ??????;
    }
        `,
          className: "info",
        },
        "",
        {
          condition: { not: { path: "visited.code-cave" } },
          content: "This is your first time in the code cave.",
        },
        {
          condition: { path: "visited.code-cave" },
          content: "The familiar glow of code surrounds you.",
        },
      ],
      onEnter: [{ set: "visited.code-cave", value: true }],
      prompt: "What do you do?",
      options: [
        { text: "Examine the code", next: "examine-code" },
        {
          text: "Search for treasure",
          condition: { not: { path: "inventory", contains: "key" } },
          next: "find-key",
        },
        {
          text: "Use the mysterious key",
          condition: { path: "inventory", contains: "key" },
          next: "use-key",
        },
        { text: "Return to the terminal", next: "start" },
      ],
    },

    "examine-code": {
      content: [
        "You study the ancient code...",
        { type: "delay", ms: 500 },
        "",
        "It seems to be a function that returns...",
        { type: "delay", ms: 800 },
        { text: "...the meaning of everything?", className: "warning" },
        "",
        "How curious.",
      ],
      next: "code-cave",
      delay: 3000,
    },

    "find-key": {
      content: [
        "You search among the glowing symbols...",
        { type: "delay", ms: 800 },
        "",
        "Behind a cascade of semicolons, you find something!",
      ],
      onEnter: [
        { addItem: "key" },
        { printSuccess: "You found a mysterious key!" },
      ],
      next: "code-cave",
      delay: 1000,
    },

    "use-key": {
      title: "The Hidden Chamber",
      content: [
        "The key fits into a slot hidden in the code.",
        { type: "delay", ms: 500 },
        "",
        "A hidden chamber opens before you!",
        { type: "delay", ms: 500 },
        "",
        {
          type: "ascii",
          art: `
    ╔═══════════════════════════════╗
    ║                               ║
    ║    CONGRATULATIONS!           ║
    ║                               ║
    ║    You found the secret       ║
    ║    of the Terminal Quest!     ║
    ║                               ║
    ║    The treasure is:           ║
    ║    KNOWLEDGE                  ║
    ║                               ║
    ╚═══════════════════════════════╝
        `,
          className: "success",
        },
        "",
        { text: "Thanks for playing this test adventure!", className: "info" },
        "",
        'Type "quest" to play again, or "quest reset" to start fresh.',
      ],
      onEnter: [
        { increment: "gold", amount: 100 },
        { printSuccess: "You also found 100 gold!" },
        { set: "completed", value: true },
      ],
    },
  },
};

// Register the game when terminal is available
if (window.terminal && window.GameEngine) {
  const game = new GameEngine(testAdventureGame);
  game.register();
}

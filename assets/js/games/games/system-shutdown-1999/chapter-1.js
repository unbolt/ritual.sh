// System Shutdown: 1999 - Chapter 1: Boxing Day
// December 26, 1999 - Five days until the millennium
// This is the refactored version using shared scenes and series state

const CHAPTER1_GLITCH_ART = `
    ▓▓▓▒▒░░ E̸̢R̷̨R̵̢O̸̧R̷̨ ░░▒▒▓▓▓
    ░▒▓█ D̶̨A̷̧T̸̢Ą̵ C̷̢Ǫ̸Ŗ̵R̷̨U̸̢P̵̧T̷̨ █▓▒░
    ▓░▒█ ???????????????? █▒░▓
`;

const CHAPTER1_END_SCREEN = `
    ╔════════════════════════════════════════╗
    ║                                        ║
    ║         CONNECTION TERMINATED          ║
    ║                                        ║
    ║         Five days remain...            ║
    ║                                        ║
    ╚════════════════════════════════════════╝
`;

const chapter1Game = {
  // Series integration
  id: "system-shutdown-1999-chapter-1",
  seriesId: "system-shutdown-1999",
  chapterNumber: 1,

  // Game metadata
  name: "System Shutdown: 1999 - Boxing Day",
  command: "dial",
  description: "Connect to Dark Tower BBS - December 26, 1999",

  // Art assets (passed to scene factories via context)
  art: {
    CHAPTER1_GLITCH_ART,
    CHAPTER1_END_SCREEN,
  },

  // External shared scenes to load
  externalScenes: [
    "system-shutdown-1999/dark-tower-hub",
    "system-shutdown-1999/lighthouse-hub",
  ],

  // Chapter-specific initial state (resets each playthrough)
  initialState: {
    // Message discovery
    read_new_message: false,
    found_number: false,

    // Scene visit tracking (chapter-local)
    visited: {},
  },

  // Shared state defaults (only set if not already present in series state)
  sharedStateDefaults: {
    // Completion tracking
    chapters_completed: [],

    // Cross-chapter decisions
    downloaded_cascade: false,
    talked_to_sysop: false,
    deleted_corrupted_file: false,
    route_taken: null,

    // World state changes
    archives_deleted: false,
    corrupted_file_deleted: false,

    // Discovery flags (shared so later chapters know)
    dialed_lighthouse: false,
    seen_archive_glitch: false,
  },

  intro: [
    {
      type: "ansi",
      art: BOXING_DAY_TITLE,
      className: "game-ansi-art center",
    },
    "",
    { text: "December 26, 1999 - 10:47 PM", className: "info" },
    "",
    { type: "delay", ms: 600 },
    "Five days until the millennium.",
    { type: "delay", ms: 1500 },
    "Five days until everything might change.",
    "",
    { type: "delay", ms: 1000 },
    "Your 56k modem hums quietly in the dark.",
    "The house is silent. Everyone else is asleep.",
    "",
    { type: "delay", ms: 400 },
    {
      text: "<strong>This game occasionally plays sounds, mute your tab now if that offends you.</strong>",
      html: true,
      className: "warning",
    },
    { text: 'Type "quit" at any time to save and exit.', className: "info" },
  ],

  startScene: "connect_prompt",

  // Chapter-specific scenes (these override or extend shared scenes)
  scenes: {
    // ==========================================
    // OPENING SEQUENCE (Chapter 1 specific)
    // ==========================================

    connect_prompt: {
      content: [
        {
          text: "<em>Your terminal awaits a command.</em>",
          html: true,
          className: "info",
        },
        {
          text: "<em>The familiar glow illuminates your face.</em>",
          html: true,
          className: "info",
        },
      ],
      options: [{ text: "Connect to Dark Tower BBS", next: "modem_connect" }],
    },

    modem_connect: {
      clear: true,
      sounds: [{ id: "modem_connect", url: "/audio/modem-connect.mp3" }],
      content: [
        { type: "typewriter", text: "ATDT 555-0199", speed: 80 },
        "",
        { type: "sound", id: "modem_connect", volume: 0.6 },
        { type: "delay", ms: 400 },
        { text: "DIALING...", className: "info" },
        { type: "delay", ms: 3000 },
        "",
        {
          type: "typewriter",
          text: "~~ eEe ~~ EEE ~~ eee ~~",
          speed: 35,
          italic: true,
        },
        { type: "delay", ms: 3000 },
        "CONNECT 56000",
        "",
        { text: "Carrier detected.", className: "success" },
        { type: "delay", ms: 4500 },
        "Negotiating protocol...",
        { type: "delay", ms: 4500 },
        { text: "Connection established.", className: "success" },
        { type: "delay", ms: 2000 },
      ],
      next: "dark_tower_main",
      delay: 1200,
    },

    // ==========================================
    // MESSAGE DISCOVERY (Chapter 1 specific)
    // ==========================================

    read_messages: {
      content: [
        ...TableHelper.table({
          title: "Private Messages for 0BSERVER0",
          headers: ["#", "FROM", "TO", "DATE", "STATUS"],
          rows: [
            [
              "23",
              "[UNKNOWN]",
              "0BSERVER0",
              "24/12",
              { text: "NEW", className: "warning" },
            ],
            ["22", "NIGHTWATCHER", "0BSERVER0", "12/12", "READ"],
            ["21", "0BSERVER0", "NIGHTWATCHER", "11/12", "SENT"],
            ["22", "NIGHTWATCHER", "0BSERVER0", "10/12", "READ"],
          ],
          widths: [4, 12, 12, 8, 8],
          align: ["right", "left", "left", "left", "left"],
        }),
      ],
      options: [
        { text: "Open unread message", next: "new_message" },
        { text: "Back to main menu", next: "dark_tower_main" },
      ],
    },

    new_message: {
      content: [
        { type: "delay", ms: 300 },
        "─── BEGIN MESSAGE ───",
        "",
        {
          type: "typewriter",
          text: "I know you've been searching.",
          speed: 50,
        },
        { type: "delay", ms: 500 },
        "",
        {
          type: "typewriter",
          text: "The lighthouse keeper left something behind.",
          speed: 50,
        },
        { type: "delay", ms: 500 },
        "",
        {
          type: "typewriter",
          text: "Dial 555-0237 before midnight strikes.",
          speed: 50,
        },
        { type: "delay", ms: 500 },
        "",
        { type: "typewriter", text: "The cascade is coming.", speed: 70 },
        { type: "delay", ms: 800 },
        "",
        "─── END MESSAGE ───",
        "",
        {
          text: "<br /><em>The number burns in your mind: 555-0237</em>",
          html: true,
          className: "warning",
        },
        "",
        { type: "delay", ms: 1000 },
        {
          text: "<em>Your clock reads 11:54 PM.</em>",
          html: true,
          className: "info",
        },
        {
          text: "<em>Six minutes until midnight.</em><br/><br />",
          html: true,
          className: "info",
        },
        { type: "delay", ms: 800 },
        "",
      ],
      onEnter: [
        { set: "read_new_message", value: true },
        { set: "found_number", value: true },
        { setShared: "found_number", value: true },
      ],
      prompt: "What do you do?",
      options: [
        {
          text: "Dial the number NOW",
          next: "choice_immediate",
          actions: [{ setShared: "route_taken", value: "immediate" }],
        },
        {
          text: "Explore Dark Tower first",
          next: "dark_tower_main",
          actions: [{ setShared: "route_taken", value: "cautious" }],
        },
        {
          text: "Delete the message and forget it",
          next: "choice_ignored",
          actions: [{ setShared: "route_taken", value: "ignored" }],
        },
      ],
    },

    message_archive: {
      content: [
        {
          type: "table",
          title: "Private Messages for 0BSERVER0",
          headers: ["#", "FROM", "TO", "DATE", "STATUS"],
          rows: [
            {
              condition: { not: "read_new_message" },
              cells: ["23", "[UNKNOWN]", "0BSERVER0", "24/12", "NEW"],
              className: "warning",
            },
            {
              condition: "read_new_message",
              cells: ["23", "[UNKNOWN]", "0BSERVER0", "24/12", "READ"],
            },
            ["22", "NIGHTWATCHER", "0BSERVER0", "12/12", "READ"],
            ["21", "0BSERVER0", "NIGHTWATCHER", "11/12", "SENT"],
            ["22", "NIGHTWATCHER", "0BSERVER0", "10/12", "READ"],
            {
              condition: { and: ["has_secret", { not: "revealed_secret" }] },
              cells: ["99", "???", "???", "??/??", "HIDDEN"],
              className: "error",
            },
          ],
          widths: [4, 12, 12, 8, 8],
          align: ["right", "left", "left", "left", "left"],
          style: "single",
        },
        { text: "<em>No new messages.</em>", html: true, className: "info" },
        {
          condition: "read_new_message",
          content: [
            {
              text: "<em>Just the number... 555-0237...</em>",
              html: true,
              className: "warning",
            },
          ],
        },
        "",
      ],
      options: [{ text: "Back", next: "dark_tower_main" }],
    },

    // ==========================================
    // CHOICE ROUTES (Chapter 1 specific)
    // ==========================================

    choice_immediate: {
      clear: true,
      content: [
        {
          type: "text",
          text: "<em>Your fingers move before doubt can settle.</em>",
          html: true,
          className: "info",
        },
        "",
        { type: "typewriter", text: "ATH0", speed: 100 },
        { type: "delay", ms: 400 },
        { text: "NO CARRIER", className: "warning" },
        { type: "delay", ms: 600 },
        "",
        {
          text: "<em>You disconnect from Dark Tower.</em>",
          html: true,
          className: "info",
        },
        {
          text: "<em>The silence of your room feels heavier now.</em>",
          html: true,
          className: "info",
        },
        "",
        "",
        "",
        { type: "delay", ms: 500 },
        {
          type: "typewriter",
          text: "Something compels you forward...",
          italic: true,
          speed: 100,
          className: "info",
        },
        { type: "delay", ms: 1500 },
        {
          type: "typewriter",
          text: "...555-0237",
          italic: true,
          speed: 100,
          className: "info",
        },
        { type: "delay", ms: 2000 },
      ],
      next: "dial_lighthouse",
      delay: 1000,
    },

    choice_ignored: {
      clear: true,
      content: [
        "You highlight the message.",
        "",
        { type: "typewriter", text: "DELETE MESSAGE? [Y/N]", speed: 50 },
        { type: "delay", ms: 600 },
        { type: "typewriter", text: "Y", speed: 100 },
        { type: "delay", ms: 400 },
        "",
        { text: "MESSAGE DELETED", className: "success" },
        "",
        { type: "delay", ms: 1000 },
        "The number fades from memory.",
        "Just another piece of BBS spam, you tell yourself.",
        "",
        { type: "delay", ms: 2000 },
        "You browse Dark Tower for another hour.",
        "Download some wallpapers.",
        "",
        { type: "delay", ms: 2000 },
        "At 11:57 PM, you disconnect.",
        "",
        { type: "delay", ms: 2000 },
        "Five days later, the millennium arrives.",
        "Fireworks. Champagne. Relief.",
        "",
        { type: "delay", ms: 600 },
        "Nothing happens.",
        "",
        { type: "delay", ms: 2000 },
        { text: "Or does it?", className: "warning" },
        "",
        { type: "delay", ms: 2000 },
        "You never find out what cascade.exe would have done.",
        "The lighthouse keeper's message was never meant for you.",
        "",
        { type: "delay", ms: 1000 },
        { text: "Perhaps that's for the best.", className: "info" },
        "",
        { type: "delay", ms: 1000 },
        { text: "[END - Route C: The Road Not Taken]", className: "warning" },
      ],
      options: [{ text: "Return to terminal", next: "game_end_ignored" }],
    },

    game_end_ignored: {
      clear: true,
      content: [
        { type: "ascii", art: CHAPTER1_END_SCREEN, className: "game-ascii" },
        "",
        { text: "BOXING DAY", className: "game-title" },
        { text: "Day 1 Complete - Route C", className: "info" },
        "",
        "You chose not to follow the signal.",
        "Some doors are better left closed.",
        "",
        {
          text: 'Type "dial" to play again, or "dial reset" to start fresh.',
          className: "info",
        },
      ],
      onEnter: [{ markChapterComplete: 1 }],
    },

    // ==========================================
    // CHAPTER 1 SPECIFIC ENDINGS
    // ==========================================

    sleep_ending: {
      clear: true,
      content: [
        "You power down the modem.",
        "The room falls silent.",
        "",
        { type: "delay", ms: 600 },
        "As you drift off to sleep, you think about the message.",
        "The cascade. The keeper. The lighthouse.",
        "",
        { type: "delay", ms: 800 },
        "Tomorrow, you tell yourself.",
        "You'll investigate tomorrow.",
        "",
        { type: "delay", ms: 1000 },
        "But tomorrow, you'll forget.",
        "The way everyone forgets.",
        "",
        { type: "delay", ms: 800 },
        {
          condition: { not: "found_number" },
          content: {
            text: "[END - Route C: Peaceful Sleep]",
            className: "info",
          },
          else: { text: "[END - Route B: Postponed]", className: "warning" },
        },
      ],
      options: [{ text: "Return to terminal", next: "game_end_sleep" }],
    },

    game_end_sleep: {
      clear: true,
      content: [
        { type: "ascii", art: CHAPTER1_END_SCREEN, className: "game-ascii" },
        "",
        { text: "BOXING DAY", className: "game-title" },
        { text: "Day 1 Complete", className: "info" },
        "",
        "You chose rest over curiosity.",
        "The lighthouse keeper will have to wait.",
        "",
        {
          text: 'Type "dial" to play again, or "dial reset" to start fresh.',
          className: "info",
        },
      ],
      onEnter: [{ markChapterComplete: 1 }],
    },

    // Final ending scene (overrides shared scene for chapter-specific summary)
    carrier_lost: {
      clear: true,
      content: [
        { type: "delay", ms: 300 },
        { type: "typewriter", text: "ATH0", speed: 100 },
        { type: "delay", ms: 500 },
        "",
        { text: "NO CARRIER", className: "error" },
        "",
        { type: "delay", ms: 1200 },
        "",
        { type: "ascii", art: CHAPTER1_END_SCREEN, className: "game-ascii" },
        "",
        { text: "BOXING DAY", className: "game-title" },
        { text: "Day 1 Complete", className: "info" },
        "",
        { text: "─── SESSION SUMMARY ───", className: "info" },
        "",
        {
          condition: "downloaded_cascade",
          content: { text: "[X] Downloaded CASCADE.EXE", className: "success" },
          else: { text: "[ ] Downloaded CASCADE.EXE", className: "info" },
        },
        {
          condition: "talked_to_sysop",
          content: { text: "[X] Spoke with Keeper", className: "success" },
          else: { text: "[ ] Spoke with Keeper", className: "info" },
        },
        {
          condition: "deleted_corrupted_file",
          content: { text: "[X] Accessed SHADOW.DAT", className: "warning" },
          else: { text: "[ ] Accessed SHADOW.DAT", className: "info" },
        },
        "",
        {
          condition: "archives_deleted",
          content: {
            text: "[!] The Archives have been deleted",
            className: "error",
          },
        },
        {
          condition: "corrupted_file_deleted",
          content: {
            text: "[!] SHADOW.DAT has been removed",
            className: "error",
          },
        },
        "",
        { text: "Route: ${route_taken}", className: "info" },
        "",
        { text: "To be continued...", className: "warning" },
        "",
        {
          text: 'Type "dial" to replay, or "dial reset" to clear progress.',
          className: "info",
        },
      ],
      onEnter: [
        { set: "day_1_complete", value: true },
        { markChapterComplete: 1 },
      ],
    },
  },
};

// Register the game when DOM is ready (ensures all scripts including scene factories are loaded)
function registerChapter1() {
  if (window.terminal && window.GameEngine) {
    const game = new GameEngine(chapter1Game);
    game.register();
  }
}

// If DOM is already loaded, register immediately, otherwise wait
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", registerChapter1);
} else {
  registerChapter1();
}

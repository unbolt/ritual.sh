// Dark Tower BBS Hub - Shared scenes for System Shutdown: 1999
// These scenes can be used across multiple chapters

window.SceneFactories = window.SceneFactories || {};

window.SceneFactories["system-shutdown-1999/dark-tower-hub"] = function (
  context,
) {
  const { chapterNumber, art, additionalOptions = [] } = context;

  // Get art from bundle scope (loaded by ascii-art.js in same bundle)
  // Falls back to context.art if not found (for standalone loading)
  const DARK_TOWER_HEADER_ART =
    typeof DARK_TOWER_HEADER !== "undefined"
      ? DARK_TOWER_HEADER
      : art.DARK_TOWER_HEADER;

  return {
    // ==========================================
    // DARK TOWER BBS HUB
    // ==========================================

    dark_tower_main: {
      clear: true,
      content: [
        {
          type: "ansi",
          art: DARK_TOWER_HEADER_ART,
          className: "game-ansi-art center",
        },
        "",
        {
          text: "---=[ D A R K   T O W E R   B B S  -  E S T.  1 9 9 5  ]=---",
          className: "info center",
        },
        // User count can change based on chapter/state
        {
          condition: { path: "chapters_completed", contains: 1 },
          content: {
            text: "[ Users Connected - 2 ] - [ SysOp - NightWatchman ]",
            className: "info center",
          },
          else: {
            text: "[ Users Connected - 3 ] - [ SysOp - NightWatchman ]",
            className: "info center",
          },
        },
        { text: "[ Local Time: 10:52 PM ]", className: "info center" },
        "",
        // New message notification if not read
        {
          condition: { not: "read_new_message" },
          content: [
            {
              text: "*** YOU HAVE 1 NEW PRIVATE MESSAGE ***",
              className: "warning center",
            },
            "",
          ],
        },
        // Show warning if archives were deleted (cascade effect)
        {
          condition: "archives_deleted",
          content: [
            {
              text: "[!] Some system data appears to be missing...",
              className: "error center",
            },
            "",
          ],
        },
      ],
      onAfterRender: [{ set: "visited.dark_tower_main", value: true }],
      prompt: "Select:",
      options: [
        {
          text: "Read Private Messages",
          next: "read_messages",
          condition: { not: "read_new_message" },
        },
        {
          text: "Message Archive",
          next: "message_archive",
          condition: "read_new_message",
        },
        { text: "Browse Message Boards", next: "browse_boards" },
        { text: "File Library", next: "dark_tower_files" },
        { text: "Who's Online", next: "whos_online" },
        {
          text: "Dial The Lighthouse (555-0237)",
          next: "confirm_dial_lighthouse",
          condition: "found_number",
        },
        // Additional options can be passed by chapters
        ...additionalOptions,
        { text: "Disconnect", next: "leave_early" },
      ],
    },

    // ==========================================
    // MESSAGE BOARDS
    // ==========================================

    browse_boards: {
      content: [
        {
          type: "table",
          title: "DARK TOWER / MESSAGE BOARDS",
          headers: ["#", "NAME", "NEW MSG", "LAST"],
          rows: [
            ["1", "General Discussion", "8", "24/12"],
            ["2", "Tech Support", "1", "25/12"],
            ["3", "File Updates", "3", "23/12"],
            // Display the archives or have them deleted
            {
              condition: { not: "archives_deleted" },
              cells: ["4", "ARCHIVED", "-", "-"],
            },
            {
              condition: "archives_deleted",
              cells: ["4", "<BOARD REMOVED>", "-", "-"],
              className: "error",
            },
          ],
          widths: [4, 20, 10, 8],
          align: ["right", "left", "left", "left"],
          style: "single",
        },
        {
          condition: "archives_deleted",
          content: {
            type: "typewriter",
            italic: true,
            text: "The archived messages are just... gone...",
            speed: 80,
            className: "info",
          },
        },
      ],
      prompt: "Select board:",
      options: [
        { text: "General Discussion", next: "board_general" },
        { text: "Tech Support", next: "board_tech" },
        { text: "File Updates", next: "board_files" },
        {
          text: "ARCHIVED",
          next: "board_archives",
          condition: { not: "archives_deleted" },
        },
        { text: "Back to main menu", next: "dark_tower_main" },
      ],
    },

    board_general: {
      content: [
        {
          type: "table",
          title: "GENERAL DISCUSSION",
          headers: ["#", "SUBJECT", "MSG", "LAST"],
          rows: [
            ["1", "2K Preparation Thread", "243", "25/12"],
            ["2", "Anyone else getting weird messages?", "3", "25/12"],
            ["3", "Happy Boxing Day everyone!", "5", "25/12"],
            ["4", "Best BBS games?", "43", "23/12"],
            ["5", "New user intro thread", "67", "20/12"],
          ],
          widths: [4, 40, 6, 8],
          align: ["right", "left", "right", "left"],
          style: "single",
        },
        {
          condition: "found_number",
          content: {
            type: "text",
            italic: true,
            text: "Nothing about lighthouses...",
            className: "info",
          },
        },
        {
          text: "The usual chatter, except...",
          italic: true,
          className: "info",
        },
      ],
      options: [
        { text: "Read 'weird messages' thread", next: "thread_weird" },
        { text: "Back to boards", next: "browse_boards" },
      ],
    },

    thread_weird: {
      content: [
        {
          type: "table",
          title: "Anyone else getting weird messages?",
          headers: ["FROM", "TO", "DATE"],
          rows: [["Static_User", "All", "25/12/99"]],
          widths: [20, 20, 10],
          align: ["left", "left", "left"],
          style: "single",
        },
        " Got a strange PM last night. No sender listed.",
        " Just a phone number and something about a 'cascade'.",
        " Probably spam, but creepy timing with Y2K coming up.",
        "",
        "---",
        { text: "Reply from: NightWatchman [SYSOP]", className: "warning" },
        " Looking into it. Please forward any suspicious messages.",
        " And don't dial any numbers you don't recognize.",
        "",
        "---",
        { text: "Reply from: [DELETED USER]", className: "error" },
        " [This post cannot be accessed]",
        "",
        { type: "delay", ms: 1000 },
        {
          condition: "found_number",
          content: {
            text: "<br /><br /><em>You notice your message was similar...</em>",
            html: true,
            className: "info",
          },
        },
      ],
      options: [{ text: "Back", next: "board_general" }],
    },

    board_tech: {
      content: [
        {
          type: "table",
          title: "TECH SUPPORT",
          headers: ["#", "SUBJECT", "MSG", "LAST"],
          rows: [
            ["1", "READ FIRST: Y2K Compliance Guide", "152", "25/12"],
            ["2", "Modem dropping connection at midnight?", "3", "25/12"],
            ["3", "How to increase download speeds", "98", "25/12"],
            ["4", "We are migrating to TELNET/IP on 01/04/00", "429", "11/12"],
            ["5", "Inputs not registering", "2", "29/11"],
          ],
          widths: [4, 45, 6, 8],
          align: ["right", "left", "right", "left"],
          style: "single",
        },
        {
          text: "Standard tech questions. Nothing unusual.",
          italic: true,
          className: "info",
        },
      ],
      options: [{ text: "Back to boards", next: "browse_boards" }],
    },

    board_archives: {
      content: [
        {
          type: "table",
          title: "THE ARCHIVES",
          headers: ["#", "SUBJECT", "OP", "LAST"],
          rows: [
            ["1", "The Lighthouse Project", "NightWatchman", "1998"],
            ["2", "Frequencies and Patterns", "Signal_Lost", "1999"],
            ["3", "RE: Has anyone heard from Keeper?", "[UNKNOWN]", "1999"],
          ],
          widths: [4, 35, 16, 8],
          align: ["right", "left", "right", "left"],
          style: "single",
        },
        {
          text: "Historical posts, read only...",
          italic: true,
          className: "info",
        },
        {
          condition: { not: "visited.archive_warning" },
          content: [
            "",
            { text: "These posts feel... different.", className: "warning" },
            { text: "Like echoes from somewhere else.", className: "info" },
          ],
        },
      ],
      onEnter: [{ set: "visited.archive_warning", value: true }],
      options: [
        { text: "Read 'The Lighthouse Project'", next: "archive_lighthouse" },
        {
          text: "Read 'Frequencies and Patterns'",
          next: "archive_frequencies",
        },
        {
          text: "Read 'Has anyone heard from Keeper?'",
          next: "archive_keeper",
        },
        { text: "Back to boards", next: "browse_boards" },
      ],
    },

    archive_lighthouse: {
      content: [
        {
          type: "table",
          title: "The Lighthouse Project",
          headers: ["FROM", "TO", "DATE"],
          rows: [["NightWatchman [SYSOP]", "All", "15/11/98"]],
          widths: [25, 15, 10],
          align: ["left", "left", "left"],
          style: "single",
        },
        "Some of you have asked about the secondary BBS.",
        "Yes, it exists. No, I can't give you the number.",
        "",
        "The Lighthouse was set up by someone who called himself 'Keeper'.",
        "He said he found something in the noise between stations.",
        "Patterns that shouldn't exist.",
        "",
        "I set up his board as a favor.",
        "Then one day, he stopped logging in.",
        "",
        "The board is still there. Still running.",
        "I check it sometimes. The files he left behind...",
        "",
        "Some doors are better left closed.",
        { text: "- NW", className: "info" },
      ],
      options: [{ text: "Back", next: "board_archives" }],
    },

    archive_frequencies: {
      title: "Frequencies and Patterns",
      content: [
        "═══ Frequencies and Patterns ═══",
        { text: "Posted by: Signal_Lost - March 22, 1999", className: "info" },
        "",
        "I've been analyzing radio static for three months.",
        "There's something there. In the spaces between signals.",
        "",
        "It's not random. It's STRUCTURED.",
        "Like code. Like a message.",
        "",
        "Keeper knew. That's why he built cascade.exe.",
        "To translate. To REVEAL.",
        "",
        "I'm close to understanding.",
        "So close.",
        "",
        {
          text: "[User Signal_Lost has not logged in since March 23, 1999]",
          className: "warning",
        },
      ],
      options: [{ text: "Back", next: "board_archives" }],
    },

    archive_keeper: {
      content: [
        {
          type: "table",
          title: "RE: Has anyone heard from Keeper?",
          headers: ["FROM", "TO", "DATE"],
          rows: [["[UNKNOWN]", "All", "20/12/99"]],
          widths: [25, 15, 10],
          align: ["left", "left", "left"],
          style: "single",
        },
        "",
        "He's still there.",
        "In The Lighthouse.",
        "Waiting.",
        "",
        "The cascade is ready.",
        "It just needs carriers.",
        "",
        {
          type: "glitch",
          text: "ERROR: MEMORY FAULT AT 0x555f0237",
          intensity: 0.7,
          spread: 0,
          speed: 200,
          duration: 2000,
          className: "error glitch-text",
        },
        "",
        "Before midnight on the 31st.",
        "The alignment only happens once.",
        "",
        {
          text: "[This post was flagged for removal but persists]",
          className: "error",
        },
        {
          html: true,
          text: "<br /><br />",
        },
        {
          condition: { not: "seen_archive_glitch" },
          content: [
            {
              text: "What the hell was that...",
              italic: true,
              className: "info",
            },
          ],
          else: [
            {
              text: "The glitch persists...",
              italic: true,
              className: "info",
            },
          ],
        },
        {
          condition: "found_number",
          content: {
            text: "The memory location looks oddly like the phone number... 555-0237",
            italic: true,
            className: "warning",
          },
        },
      ],
      onAfterRender: [{ set: "seen_archive_glitch", value: true }],
      options: [{ text: "Back", next: "board_archives" }],
    },

    board_files: {
      content: [
        {
          type: "table",
          title: "FILE ANNOUNCEMENTS",
          headers: ["#", "SUBJECT", "MSG", "LAST"],
          rows: [
            ["1", "1001FONTS.ZIP - Font Collection", "1", "25/12"],
            ["2", "Y2K_FIX.ZIP - Y2K compliance patches", "4", "23/12"],
            ["3", "DOOM_WAD.ZIP - New Doom Levels", "3", "11/12"],
            ["4", "BRUCE.JPEG - Just my dog :-)", "15", "20/11"],
            ["5", "CATS.GIF - All your base are belong to us", "1", "01/11"],
          ],
          widths: [4, 45, 6, 8],
          align: ["right", "left", "right", "left"],
          style: "single",
        },
        {
          text: "<em>New fonts... At last...</em>",
          html: true,
          className: "info",
        },
        {
          text: "<em>Can't get distracted just yet.</em>",
          html: true,
          className: "info",
        },
      ],
      options: [{ text: "Back to boards", next: "browse_boards" }],
    },

    dark_tower_files: {
      content: [
        {
          type: "table",
          title: "FILE LIBRARY",
          headers: ["#", "DIR", "QTY", "UPDATED"],
          rows: [
            ["1", "/IMAGES", "234", "25/12"],
            ["2", "/GAMES", "67", "12/12"],
            ["3", "/MUSIC", "89", "30/11"],
            ["4", "/UTILS", "156", "23/11"],
            ["5", "/MISC", "13", "09/10"],
          ],
          widths: [4, 25, 6, 8],
          align: ["right", "left", "right", "left"],
          style: "single",
        },
        {
          text: "<em>Standard BBS fare. Nothing unusual.</em>",
          html: true,
          className: "info",
        },
      ],
      options: [{ text: "Back to main menu", next: "dark_tower_main" }],
    },

    whos_online: {
      content: [
        {
          type: "table",
          title: "CONNECTED USERS",
          headers: ["#", "USER", "LOC", "UPDATED"],
          rows: [
            ["1", "0BSERVER0", "Main Menu", "10:54 PM"],
            // Static_User might not be online in later chapters
            {
              condition: { not: { path: "chapters_completed", contains: 1 } },
              cells: ["2", "Static_User", "Message Boards", "10:39 PM"],
            },
            ["3", "NightWatchman", "SysOp Console", "10:12 PM"],
          ],
          widths: [4, 15, 15, 8],
          align: ["right", "left", "right", "left"],
          style: "single",
        },
      ],
      options: [{ text: "Back", next: "dark_tower_main" }],
    },

    leave_early: {
      content: [
        "Are you sure you want to disconnect?",
        "",
        {
          condition: "found_number",
          content: {
            text: "You still have the number: 555-0237",
            className: "warning",
          },
        },
      ],
      options: [
        {
          text: "Dial The Lighthouse first",
          next: "confirm_dial_lighthouse",
          condition: "found_number",
        },
        { text: "Yes, disconnect", next: "disconnect_early" },
        { text: "Stay connected", next: "dark_tower_main" },
      ],
    },

    disconnect_early: {
      clear: true,
      content: [
        { type: "typewriter", text: "ATH0", speed: 100 },
        { type: "delay", ms: 400 },
        { text: "NO CARRIER", className: "warning" },
        "",
        { type: "delay", ms: 600 },
        "You disconnect from Dark Tower.",
        "",
        {
          condition: "found_number",
          content: [
            "The number lingers in your mind.",
            { text: "555-0237", className: "warning" },
            "",
            "You could always dial it directly...",
          ],
          else: ["Another quiet night online.", "Nothing unusual."],
        },
      ],
      options: [
        {
          text: "Dial 555-0237",
          next: "dial_lighthouse",
          condition: "found_number",
        },
        { text: "Go to sleep", next: "sleep_ending" },
      ],
    },

    confirm_dial_lighthouse: {
      content: [
        { text: "555-0237", className: "warning" },
        "",
        "The number from the message.",
        "Something waits on the other end.",
        "",
        { text: "Your clock reads 11:56 PM.", className: "info" },
      ],
      options: [
        { text: "Dial The Lighthouse", next: "dial_lighthouse" },
        { text: "Not yet", next: "dark_tower_main" },
      ],
    },
  };
};

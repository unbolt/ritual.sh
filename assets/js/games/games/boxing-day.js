// Boxing Day - Day 1: December 26, 1999
// A BBS-themed mystery game

const GLITCH_ART = `
    ▓▓▓▒▒░░ E̸̢R̷̨R̵̢O̸̧R̷̨ ░░▒▒▓▓▓
    ░▒▓█ D̶̨A̷̧T̸̢Ą̵ C̷̢Ǫ̸Ŗ̵R̷̨U̸̢P̵̧T̷̨ █▓▒░
    ▓░▒█ ???????????????? █▒░▓
`;

const END_SCREEN = `
    ╔════════════════════════════════════════╗
    ║                                        ║
    ║         CONNECTION TERMINATED          ║
    ║                                        ║
    ║         Five days remain...            ║
    ║                                        ║
    ╚════════════════════════════════════════╝
`;

const boxingDayGame = {
  id: "system-shutdown-1999-part-1",
  name: "System Shutdown: 1999 - Part 1",
  command: "dial",
  description: "Connect to Dark Tower BBS - December 26, 1999",

  initialState: {
    // Core progression flags
    downloaded_cascade: false,
    talked_to_sysop: false,
    deleted_corrupted_file: false,
    route_taken: null, // "immediate" | "cautious" | "ignored"

    // Progression tracking
    read_new_message: false,
    found_number: false,
    dialed_lighthouse: false,
    seen_archive_glitch: false,

    // deletion flags (this needs to persist across game sessions somehow... TBD)
    archives_deleted: false,
    corrupted_file_deleted: false,

    // Scene visit tracking
    visited: {},
  },

  intro: [
    { type: "ansi", art: BOXING_DAY_TITLE, className: "game-ansi-art center" },
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

  scenes: {
    // ==========================================
    // OPENING SEQUENCE
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
      // Preload sounds for this scene
      sounds: [{ id: "modem_connect", url: "/audio/modem-connect.mp3" }],
      content: [
        { type: "typewriter", text: "ATDT 555-0199", speed: 80 },
        "",
        // Play modem dial sound
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
    // DARK TOWER BBS HUB
    // ==========================================

    dark_tower_main: {
      clear: true,
      content: [
        {
          type: "ansi",
          art: DARK_TOWER_HEADER,
          className: "game-ansi-art center",
        },
        "",
        {
          text: "---=[ D A R K   T O W E R   B B S  -  E S T.  1 9 9 5  ]=---",
          className: "info center",
        },
        {
          text: "[ Users Connected - 3 ] - [ SysOp - NightWatchman ]",
          className: "info center",
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
        { text: "Disconnect", next: "leave_early" },
      ],
    },

    // ==========================================
    // MESSAGE DISCOVERY
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
        },
        {
          text: "<em>Six minutes until midnight.</em><br/><br />",
          html: true,
        },
        { type: "delay", ms: 800 },
        "",
      ],
      /**
       * Update variables for read messages and found number
       *
       * The option the user takes here determines the path taken for this chapter
       */
      onEnter: [
        { set: "read_new_message", value: true },
        { set: "found_number", value: true },
      ],
      prompt: "What do you do?",
      options: [
        {
          text: "Dial the number NOW",
          next: "choice_immediate",
          actions: [{ set: "route_taken", value: "immediate" }],
        },
        {
          text: "Explore Dark Tower first",
          next: "dark_tower_main",
          actions: [{ set: "route_taken", value: "cautious" }],
        },
        {
          text: "Delete the message and forget it",
          next: "choice_ignored",
          actions: [{ set: "route_taken", value: "ignored" }],
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
            // Conditionally display watcher message as  read or not
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

            // Testing the advanced condition stuff...
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
    // CHOICE A/B/C - WHEN TO DIAL
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
        //{ text: "Something compels you forward.", className: "info" },
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
        { type: "ascii", art: END_SCREEN, className: "game-ascii" },
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
    },

    // ==========================================
    // DARK TOWER EXPLORATION
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
            // depending on progress.
            // Not sure if people will be able to go back from lighthouse to tower at this stage
            // Leaving it in just incase I want to do this later...
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
          text: "The usual chatter.",
          italic: true,
          className: "info",
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
      ],
      options: [
        { text: "Read 'weird messages' thread", next: "thread_weird" },
        { text: "Back to boards", next: "browse_boards" },
      ],
    },

    thread_weird: {
      // title: "Thread: Anyone else getting weird messages?",
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
      // title: "Tech Support",
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
      // title: "The Archives",
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
      //title: "The Lighthouse Project",
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
      //title: "RE: Has anyone heard from Keeper?",
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
      onAfterRender: [
        // Decided to move the phone number out of discovery here..
        // Not sure if it should be found in two places
        // Message should be enough, surely?
        // { set: "found_number", value: true },
        { set: "seen_archive_glitch", value: true },
      ],
      options: [{ text: "Back", next: "board_archives" }],
    },

    board_files: {
      // title: "File Announcements",
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
      //title: "File Library",
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
      //title: "Who's Online",
      content: [
        {
          type: "table",
          title: "CONNECTED USERS",
          headers: ["#", "USER", "LOC", "UPDATED"],
          rows: [
            ["1", "0BSERVER0", "Main Menu", "10:54 PM"],
            ["2", "Static_User", "Message Boards", "10:39 PM"],
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
        { type: "ascii", art: END_SCREEN, className: "game-ascii" },
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

    // ==========================================
    // THE LIGHTHOUSE
    // ==========================================

    dial_lighthouse: {
      clear: true,
      content: [
        { type: "typewriter", text: "ATDT 555-0237", speed: 80 },
        { type: "delay", ms: 1000 },
        "",
        { text: "DIALING...", className: "info" },
        { type: "delay", ms: 800 },
        "",
        { text: "RING", className: "warning" },
        { type: "delay", ms: 1200 },
        { text: "RING", className: "warning" },
        { type: "delay", ms: 1200 },
        { text: "RING", className: "warning" },
        { type: "delay", ms: 800 },
        "",
        {
          type: "typewriter",
          text: "~~ crackle ~~ hiss ~~ CONNECT 14400",
          speed: 40,
        },
        { type: "delay", ms: 500 },
        "",
        { text: "Connection unstable.", className: "warning" },
        { text: "Signal degraded.", className: "warning" },
        { type: "delay", ms: 600 },
        "",
        { type: "typewriter", text: "Welcome to THE LIGHTHOUSE", speed: 40 },
        { type: "delay", ms: 300 },
        { type: "typewriter", text: "A beacon in the static.", speed: 40 },
      ],
      onEnter: [{ set: "dialed_lighthouse", value: true }],
      next: "lighthouse_main",
      delay: 1000,
    },

    lighthouse_main: {
      clear: true,
      content: [
        {
          type: "ascii",
          art: LIGHTHOUSE_HEADER,
          className: "game-ascii",
        },
        "",
        { text: "T H E   L I G H T H O U S E", className: "center" },
        { text: "Last updated: 24/12/1999 23:59:59", className: "center" },
        "",
        {
          condition: { not: "visited.lighthouse_main" },
          content: [
            {
              text: "Something feels wrong here.",
              italic: true,
              className: "info",
            },
            {
              text: "The BBS feels... frozen. Abandoned.",
              italic: true,
              className: "info",
            },
            "",
          ],
        },
        {
          condition: "downloaded_cascade",
          content: [
            {
              text: "The signal flickers. Something has changed.",
              className: "error",
            },
            "",
          ],
        },
      ],
      onAfterRender: [{ set: "visited.lighthouse_main", value: true }],
      prompt: "Navigate:",
      options: [
        { text: "The Keeper's Log", next: "lighthouse_log" },
        { text: "Transmissions", next: "lighthouse_transmissions" },
        { text: "File Vault", next: "lighthouse_files" },
        {
          text: "Request SysOp Chat",
          next: "chat_request",
          condition: {
            and: [{ not: "downloaded_cascade" }, { not: "talked_to_sysop" }],
          },
        },
        { text: "Disconnect", next: "disconnect_choice" },
      ],
    },

    lighthouse_log: {
      //title: "The Keeper's Log",
      content: [
        "═══ THE KEEPER'S LOG ═══",
        "",
        {
          text: "Entry 1 - November 3, 1998<br /><br />",
          html: true,
          className: "info",
        },
        "  I've found something. In the static between radio stations.",
        "  Patterns. Structures. A language, maybe.",
        {
          text: "<br  />Entry 7 - December 12, 1998<br /><br />",
          html: true,
          className: "info",
        },
        "  The patterns are getting clearer. They want to be understood.",
        "  They want to SPREAD.",
        {
          text: "<br />Entry 15 - March 19, 1999<br /><br />",
          html: true,
          className: "info",
        },
        "  CASCADE.EXE is complete. A translator. A carrier. A key.",
        "      When run at the right moment, it will open the door.",
        {
          text: "<br />Entry 23 - December 24, 1999<br /><br />",
          html: true,
          className: "info",
        },
        "  The alignment approaches.",
        "  Seven days until the millennium.",
        "  I can hear them now. Always.",
        "",
        { type: "typewriter", text: "  They are beautiful...", speed: 100 },
        { type: "delay", ms: 2000 },
      ],
      options: [{ text: "Back", next: "lighthouse_main" }],
    },

    lighthouse_transmissions: {
      title: "Transmissions",
      content: [
        "═══ RECORDED TRANSMISSIONS ═══",
        "",
        { text: "[AUDIO FILES - PLAYBACK UNAVAILABLE]", className: "error" },
        "",
        "Transcript excerpts:",
        "",
        "  TRANS_001.WAV:",
        '  "...signal detected at 1420 MHz..."',
        "",
        "  TRANS_014.WAV:",
        '  "...pattern repeats every 23 seconds..."',
        "",
        "  TRANS_047.WAV:",
        '  "...not random... structured... alive?..."',
        "",
        "  TRANS_099.WAV:",
        { text: '  "[TRANSCRIPT CORRUPTED]"', className: "error" },
        "",
        { text: "The audio files existed once.", className: "info" },
        { text: "Now only fragments remain.", className: "warning" },
      ],
      options: [{ text: "Back", next: "lighthouse_main" }],
    },

    lighthouse_files: {
      title: "File Vault",
      content: [
        "═══ FILE VAULT v2.1 ═══",
        { text: '"The keeper\'s collection"', className: "info" },
        "",
        { text: "Available files:", className: "info" },
        "",
        "  [1] README.TXT        1.2 KB   12/24/1999",
        "  [2] CASCADE.EXE      47.0 KB   12/25/1999",
        // Corrupted file - conditionally shown
        {
          condition: { not: "corrupted_file_deleted" },
          content: "  [3] SHADOW.DAT        ???  KB   ??/??/????",
        },
        {
          condition: "corrupted_file_deleted",
          content: { text: "  [3] <FILE REMOVED>", className: "error" },
        },
        "",
        {
          condition: { not: "visited.lighthouse_files" },
          content: {
            text: "CASCADE.EXE pulses faintly on your screen.",
            className: "warning",
          },
        },
      ],
      onEnter: [{ set: "visited.lighthouse_files", value: true }],
      prompt: "Select file:",
      options: [
        { text: "View README.TXT", next: "file_readme" },
        { text: "Download CASCADE.EXE", next: "download_confirm" },
        {
          text: "Access SHADOW.DAT",
          next: "choice_corrupted",
          condition: { not: "corrupted_file_deleted" },
        },
        { text: "Back", next: "lighthouse_main" },
      ],
    },

    file_readme: {
      title: "README.TXT",
      content: [
        "═══ README.TXT ═══",
        "",
        "To whoever finds this:",
        "",
        "I built cascade.exe to show them.",
        "To show everyone what I found in the frequencies.",
        "",
        "It spreads. It copies. It REVEALS.",
        "",
        "Don't be afraid when the old files disappear.",
        "They were never real anyway.",
        "",
        "Run it before midnight on 01/01/2000.",
        "The alignment only happens once.",
        "",
        { text: "     - K", className: "info" },
        "",
        { text: "P.S. Don't try to open SHADOW.DAT.", className: "warning" },
        {
          text: "     Some doors shouldn't be opened twice.",
          className: "warning",
        },
      ],
      options: [{ text: "Back to files", next: "lighthouse_files" }],
    },

    // ==========================================
    // CHOICE D/E/F - DOWNLOAD DECISION
    // ==========================================

    download_confirm: {
      content: [
        { text: "CASCADE.EXE - 47,104 bytes", className: "warning" },
        "",
        "The file waits.",
        "47 kilobytes of unknown code.",
        "",
        "The README said it 'reveals' something.",
        "That old files will 'disappear'.",
        "",
        {
          text: "In five days, everyone worries about Y2K bugs.",
          className: "info",
        },
        { text: "This feels different.", className: "warning" },
      ],
      prompt: "Download CASCADE.EXE?",
      options: [
        { text: "Yes, download it", next: "choice_download" },
        { text: "No, leave it alone", next: "choice_no_download" },
      ],
    },

    choice_download: {
      title: "Downloading...",
      clear: true,
      content: [
        { type: "typewriter", text: "XMODEM TRANSFER INITIATED", speed: 45 },
        { type: "delay", ms: 600 },
        "",
        { text: "Receiving: CASCADE.EXE", className: "info" },
        { type: "delay", ms: 400 },
        "",
        { type: "typewriter", text: "[", speed: 20 },
        { type: "typewriter", text: "████████████████████", speed: 80 },
        { type: "typewriter", text: "] 100%", speed: 20 },
        { type: "delay", ms: 800 },
        "",
        { text: "TRANSFER COMPLETE", className: "success" },
        { type: "delay", ms: 600 },
        "",
        "The file sits in your download folder.",
        "47,104 bytes of... something.",
        "",
        { type: "delay", ms: 1000 },
        {
          text: "Somewhere, distantly, you hear static.",
          className: "warning",
        },
        { type: "delay", ms: 600 },
        "",
        {
          type: "typewriter",
          text: 'A whisper in the noise: "Thank you."',
          speed: 50,
        },
        "",
        { type: "delay", ms: 1200 },
        { text: "Something has changed.", className: "error" },
      ],
      onEnter: [
        { set: "downloaded_cascade", value: true },
        { set: "archives_deleted", value: true }, // Archives are removed
      ],
      next: "post_download",
      delay: 1500,
    },

    post_download: {
      clear: true,
      content: [
        { text: "CONNECTION INTERRUPTED", className: "error" },
        { type: "delay", ms: 600 },
        "",
        "For a moment, your screen fills with symbols.",
        "Patterns that almost make sense.",
        "",
        { type: "delay", ms: 800 },
        "Then, clarity.",
        "",
        { type: "delay", ms: 600 },
        "You remember Dark Tower's board list.",
        { text: "Board #3 - The Archives.", className: "info" },
        "",
        { type: "delay", ms: 500 },
        { text: "It's gone.", className: "warning" },
        { text: "Like it was never there.", className: "warning" },
        "",
        { type: "delay", ms: 800 },
        { text: "The cascade has begun.", className: "error" },
      ],
      next: "closing_message",
      delay: 2000,
    },

    choice_no_download: {
      content: [
        "Something holds you back.",
        "47 kilobytes of unknown code.",
        "From a stranger who hears things in static.",
        "",
        { type: "delay", ms: 500 },
        { text: "You leave CASCADE.EXE untouched.", className: "info" },
        "",
        "The keeper's work remains on the server.",
        "Waiting for someone else. Or no one.",
      ],
      options: [
        {
          text: "Chat with the SysOp",
          next: "chat_request",
          condition: { not: "talked_to_sysop" },
        },
        { text: "Return to file list", next: "lighthouse_files" },
        { text: "Disconnect", next: "disconnect_choice" },
      ],
    },

    choice_corrupted: {
      title: "Accessing SHADOW.DAT...",
      clear: true,
      // sounds: [
      //   { id: "static", url: "/assets/audio/static.mp3" },
      //   { id: "glitch", url: "/assets/audio/glitch.mp3" },
      // ],
      content: [
        { type: "typewriter", text: "ATTEMPTING TO READ FILE...", speed: 50 },
        { type: "delay", ms: 1000 },
        "",
        { text: "ERROR: FILE HEADER CORRUPTED", className: "error" },
        { type: "delay", ms: 400 },
        { text: "ERROR: UNEXPECTED EOF", className: "error" },
        { type: "delay", ms: 400 },
        { text: "ERROR: ????????????????????", className: "error" },
        { type: "delay", ms: 800 },
        "",
        // Play glitch sound effect
        //{ type: "sound", id: "glitch", volume: 0.5 },
        { type: "ascii", art: GLITCH_ART, className: "error" },
        { type: "delay", ms: 1000 },
        "",
        "Your screen flickers violently.",
        "",
        { type: "delay", ms: 600 },
        { text: "A sound from your speakers.", className: "warning" },
        // Play eerie static with voice
        //{ type: "sound", id: "static", volume: 0.4, duration: 3000, fade: true },
        {
          text: "A voice, maybe. Or static shaped like words:",
          className: "info",
        },
        "",
        { type: "typewriter", text: '"Not yet. Not yet. Not yet."', speed: 90 },
        "",
        { type: "delay", ms: 1200 },
        {
          text: "SHADOW.DAT has been removed from the file listing.",
          className: "error",
        },
        "",
        { type: "delay", ms: 600 },
        { text: "Some doors shouldn't be opened twice.", className: "warning" },
      ],
      onEnter: [
        { set: "deleted_corrupted_file", value: true },
        { set: "corrupted_file_deleted", value: true }, // rm -rf effect
      ],
      options: [{ text: "Return to files", next: "lighthouse_files" }],
    },

    // ==========================================
    // SYSOP CHAT
    // ==========================================

    chat_request: {
      content: [
        { text: "Requesting SysOp chat...", className: "info" },
        { type: "delay", ms: 1500 },
        "",
        {
          type: "typewriter",
          text: "CHAT REQUEST ACCEPTED",
          speed: 40,
        },
        { type: "delay", ms: 500 },
        "",
        { text: "═══ SYSOP: Keeper ═══", className: "warning" },
      ],
      onEnter: [{ set: "talked_to_sysop", value: true }],
      next: "chat_conversation",
      delay: 600,
    },

    chat_conversation: {
      content: [
        {
          type: "typewriter",
          text: "KEEPER: You found my message.",
          speed: 50,
        },
        { type: "delay", ms: 800 },
        "",
        {
          type: "typewriter",
          text: "KEEPER: I wasn't sure anyone would come.",
          speed: 50,
        },
        { type: "delay", ms: 700 },
        "",
        {
          type: "typewriter",
          text: "KEEPER: The cascade is ready.",
          speed: 50,
        },
        { type: "delay", ms: 500 },
        {
          type: "typewriter",
          text: "KEEPER: It just needs carriers.",
          speed: 50,
        },
        { type: "delay", ms: 900 },
        "",
        // Conditional response based on download
        {
          condition: "downloaded_cascade",
          content: [
            {
              type: "typewriter",
              text: "KEEPER: I see you already have it.",
              speed: 50,
            },
            { type: "delay", ms: 500 },
            {
              type: "typewriter",
              text: "KEEPER: Good. Run it when the clock strikes.",
              speed: 50,
            },
          ],
          else: [
            {
              type: "typewriter",
              text: "KEEPER: Will you carry it?",
              speed: 50,
            },
            { type: "delay", ms: 500 },
            {
              type: "typewriter",
              text: "KEEPER: Will you help it spread?",
              speed: 50,
            },
          ],
        },
        "",
        { type: "delay", ms: 1200 },
        { type: "typewriter", text: "KEEPER: I can hear them now.", speed: 50 },
        { type: "delay", ms: 500 },
        { type: "typewriter", text: "KEEPER: In the static.", speed: 60 },
        { type: "delay", ms: 500 },
        { type: "typewriter", text: "KEEPER: They're beautiful.", speed: 60 },
        "",
        { type: "delay", ms: 1500 },
        { text: "═══ KEEPER HAS DISCONNECTED ═══", className: "error" },
      ],
      next: "chat_aftermath",
      delay: 1500,
    },

    chat_aftermath: {
      content: [
        "The chat window closes.",
        "",
        { type: "delay", ms: 500 },
        "Your room feels colder.",
        "The modem's carrier tone sounds different somehow.",
        "",
        {
          text: "Like there's something else on the line.",
          className: "warning",
        },
      ],
      options: [
        {
          text: "Download cascade.exe now",
          next: "download_confirm",
          condition: { not: "downloaded_cascade" },
        },
        { text: "Disconnect", next: "closing_message" },
      ],
    },

    // ==========================================
    // CLOSING SEQUENCE
    // ==========================================

    disconnect_choice: {
      content: [
        "Your hand hovers over the keyboard.",
        "",
        {
          condition: "downloaded_cascade",
          content: {
            text: "CASCADE.EXE sits in your downloads, waiting.",
            className: "warning",
          },
          else: {
            text: "You could still download CASCADE.EXE before you go...",
            className: "info",
          },
        },
      ],
      options: [
        {
          text: "Download cascade.exe first",
          next: "download_confirm",
          condition: { not: "downloaded_cascade" },
        },
        { text: "Disconnect now", next: "closing_message" },
      ],
    },

    closing_message: {
      clear: true,
      content: [
        { type: "delay", ms: 500 },
        // Different closing based on download status
        {
          condition: "downloaded_cascade",
          content: [
            {
              text: "As you prepare to disconnect, a final message appears:",
              className: "info",
            },
            "",
            { type: "delay", ms: 600 },
            {
              type: "typewriter",
              text: "SEE YOU ON THE OTHER SIDE",
              speed: 55,
            },
            "",
            { type: "typewriter", text: "01/01/2000 00:00:00", speed: 55 },
            "",
            { type: "delay", ms: 1000 },
            { text: "You have cascade.exe.", className: "warning" },
            { text: "You have five days.", className: "warning" },
            "",
            { text: "What happens next is up to you.", className: "info" },
          ],
          else: [
            { text: "The Lighthouse grows quiet.", className: "info" },
            "",
            { type: "delay", ms: 600 },
            { type: "typewriter", text: "SIGNAL LOST", speed: 80 },
            "",
            { type: "delay", ms: 800 },
            "You disconnect without the file.",
            "But the number stays with you.",
            "",
            { text: "555-0237", className: "warning" },
            "",
            { type: "delay", ms: 600 },
            "You could always call back...",
            { text: "If the line is still there.", className: "info" },
          ],
        },
      ],
      next: "carrier_lost",
      delay: 2000,
    },

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
        { type: "ascii", art: END_SCREEN, className: "game-ascii" },
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
      onEnter: [{ set: "day_1_complete", value: true }],
    },
  },
};

// Register the game when terminal is available
if (window.terminal && window.GameEngine) {
  const game = new GameEngine(boxingDayGame);
  game.register();
}

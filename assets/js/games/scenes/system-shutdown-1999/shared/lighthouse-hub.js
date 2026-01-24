// The Lighthouse BBS Hub - Shared scenes for System Shutdown: 1999
// These scenes can be used across multiple chapters

window.SceneFactories = window.SceneFactories || {};

window.SceneFactories["system-shutdown-1999/lighthouse-hub"] = function (
  context,
) {
  const { chapterNumber, art, additionalOptions = [] } = context;

  // Get art from bundle scope (loaded by ascii-art.js in same bundle)
  // Falls back to context.art if not found (for standalone loading)
  const LIGHTHOUSE_HEADER_ART =
    typeof LIGHTHOUSE_HEADER !== "undefined"
      ? LIGHTHOUSE_HEADER
      : art.LIGHTHOUSE_HEADER;

  return {
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
      onEnter: [{ setShared: "dialed_lighthouse", value: true }],
      next: "lighthouse_main",
      delay: 1000,
    },

    lighthouse_main: {
      clear: true,
      content: [
        {
          type: "ascii",
          art: LIGHTHOUSE_HEADER_ART,
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
        // Additional options can be passed by chapters
        ...additionalOptions,
        { text: "Disconnect", next: "disconnect_choice" },
      ],
    },

    lighthouse_log: {
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
        { setShared: "downloaded_cascade", value: true },
        { setShared: "archives_deleted", value: true }, // Archives are removed
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
        {
          type: "ascii",
          art: `
    ▓▓▓▒▒░░ E̸̢R̷̨R̵̢O̸̧R̷̨ ░░▒▒▓▓▓
    ░▒▓█ D̶̨A̷̧T̸̢Ą̵ C̷̢Ǫ̸Ŗ̵R̷̨U̸̢P̵̧T̷̨ █▓▒░
    ▓░▒█ ???????????????? █▒░▓
`,
          className: "error",
        },
        { type: "delay", ms: 1000 },
        "",
        "Your screen flickers violently.",
        "",
        { type: "delay", ms: 600 },
        { text: "A sound from your speakers.", className: "warning" },
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
        { setShared: "corrupted_file_deleted", value: true },
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
      onEnter: [{ setShared: "talked_to_sysop", value: true }],
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
  };
};

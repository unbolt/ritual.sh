// Series configuration for System Shutdown: 1999
window.SystemShutdown1999Config = {
  seriesId: "system-shutdown-1999",
  name: "System Shutdown: 1999",

  // Chapter definitions
  chapters: [
    {
      number: 1,
      id: "system-shutdown-1999-chapter-1",
      command: "dial",
      date: "1999-12-26",
      title: "Boxing Day",
      description: "Connect to Dark Tower BBS - December 26, 1999",
    },
    {
      number: 2,
      id: "system-shutdown-1999-chapter-2",
      command: "dial2",
      date: "1999-12-27",
      title: "Day 2",
      description: "The day after - December 27, 1999",
    },
    {
      number: 3,
      id: "system-shutdown-1999-chapter-3",
      command: "dial3",
      date: "1999-12-28",
      title: "Day 3",
      description: "Three days remain - December 28, 1999",
    },
    {
      number: 4,
      id: "system-shutdown-1999-chapter-4",
      command: "dial4",
      date: "1999-12-29",
      title: "Day 4",
      description: "Two days remain - December 29, 1999",
    },
    {
      number: 5,
      id: "system-shutdown-1999-chapter-5",
      command: "dial5",
      date: "1999-12-30",
      title: "Day 5",
      description: "The eve - December 30, 1999",
    },
    {
      number: 6,
      id: "system-shutdown-1999-chapter-6",
      command: "dial6",
      date: "1999-12-31",
      title: "New Year's Eve",
      description: "The final night - December 31, 1999",
    },
  ],

  // Shared state schema with defaults
  // These values persist across all chapters
  sharedStateDefaults: {
    // Completion tracking
    chapters_completed: [],

    // Core cross-chapter decisions
    downloaded_cascade: false,
    talked_to_sysop: false,
    deleted_corrupted_file: false,
    route_taken: null, // "immediate" | "cautious" | "ignored"

    // World state changes (persist across chapters)
    archives_deleted: false,
    corrupted_file_deleted: false,

    // Discovery flags
    found_number: false,
    dialed_lighthouse: false,
    seen_archive_glitch: false,
  },

  // Helper to get chapter by number
  getChapter(number) {
    return this.chapters.find((c) => c.number === number);
  },

  // Helper to get next chapter
  getNextChapter(currentNumber) {
    return this.chapters.find((c) => c.number === currentNumber + 1);
  },
};

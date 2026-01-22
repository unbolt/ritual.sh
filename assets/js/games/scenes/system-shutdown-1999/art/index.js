// Art assets index for System Shutdown: 1999 series
// These reference the ANSI art defined in ascii-art.js

// Art constants are loaded from ascii-art.js and made available globally
// This file provides a namespace for the series' art assets

window.SystemShutdown1999Art = window.SystemShutdown1999Art || {};

// These will be populated by ascii-art.js when it loads
// The art constants are:
// - BOXING_DAY_TITLE: Chapter 1 title screen
// - DARK_TOWER_HEADER: Dark Tower BBS header
// - LIGHTHOUSE_HEADER: The Lighthouse BBS header

// Helper to get art by name
window.SystemShutdown1999Art.get = function (name) {
  switch (name) {
    case "BOXING_DAY_TITLE":
      return window.BOXING_DAY_TITLE;
    case "DARK_TOWER_HEADER":
      return window.DARK_TOWER_HEADER;
    case "LIGHTHOUSE_HEADER":
      return window.LIGHTHOUSE_HEADER;
    default:
      console.warn(`Unknown art asset: ${name}`);
      return null;
  }
};

// List available art assets
window.SystemShutdown1999Art.list = function () {
  return ["BOXING_DAY_TITLE", "DARK_TOWER_HEADER", "LIGHTHOUSE_HEADER"];
};

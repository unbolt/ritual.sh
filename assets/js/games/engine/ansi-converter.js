// ANSI to HTML Converter
// Converts ANSI escape sequences (256-color) to HTML spans with inline styles
// Supports: 38;5;N (foreground), 48;5;N (background), and standard reset codes

const AnsiConverter = {
  // 256-color palette - standard xterm colors
  palette: [
    // Standard colors (0-15)
    "#000000", "#800000", "#008000", "#808000", "#000080", "#800080", "#008080", "#c0c0c0",
    "#808080", "#ff0000", "#00ff00", "#ffff00", "#0000ff", "#ff00ff", "#00ffff", "#ffffff",
    // 216 color cube (16-231)
    ...(() => {
      const colors = [];
      const levels = [0, 95, 135, 175, 215, 255];
      for (let r = 0; r < 6; r++) {
        for (let g = 0; g < 6; g++) {
          for (let b = 0; b < 6; b++) {
            colors.push(`#${levels[r].toString(16).padStart(2, "0")}${levels[g].toString(16).padStart(2, "0")}${levels[b].toString(16).padStart(2, "0")}`);
          }
        }
      }
      return colors;
    })(),
    // Grayscale (232-255)
    ...(() => {
      const grays = [];
      for (let i = 0; i < 24; i++) {
        const level = 8 + i * 10;
        const hex = level.toString(16).padStart(2, "0");
        grays.push(`#${hex}${hex}${hex}`);
      }
      return grays;
    })(),
  ],

  // Get color from palette by index
  getColor(index) {
    if (index >= 0 && index < this.palette.length) {
      return this.palette[index];
    }
    return null;
  },

  // Parse ANSI escape sequence and return style object
  parseEscapeCode(code) {
    const style = {};
    const parts = code.split(";");

    let i = 0;
    while (i < parts.length) {
      const num = parseInt(parts[i], 10);

      // Reset
      if (num === 0 || num === "m" || isNaN(num)) {
        style.reset = true;
        i++;
        continue;
      }

      // 256-color foreground: 38;5;N
      if (num === 38 && parts[i + 1] === "5") {
        const colorIndex = parseInt(parts[i + 2], 10);
        const color = this.getColor(colorIndex);
        if (color) {
          style.fg = color;
        }
        i += 3;
        continue;
      }

      // 256-color background: 48;5;N
      if (num === 48 && parts[i + 1] === "5") {
        const colorIndex = parseInt(parts[i + 2], 10);
        const color = this.getColor(colorIndex);
        if (color) {
          style.bg = color;
        }
        i += 3;
        continue;
      }

      // Standard foreground colors (30-37)
      if (num >= 30 && num <= 37) {
        style.fg = this.palette[num - 30];
        i++;
        continue;
      }

      // Bright foreground colors (90-97)
      if (num >= 90 && num <= 97) {
        style.fg = this.palette[num - 90 + 8];
        i++;
        continue;
      }

      // Standard background colors (40-47)
      if (num >= 40 && num <= 47) {
        style.bg = this.palette[num - 40];
        i++;
        continue;
      }

      // Bright background colors (100-107)
      if (num >= 100 && num <= 107) {
        style.bg = this.palette[num - 100 + 8];
        i++;
        continue;
      }

      // Bold (1) - we'll treat as bright
      if (num === 1) {
        style.bold = true;
        i++;
        continue;
      }

      i++;
    }

    return style;
  },

  // Convert ANSI string to HTML
  convert(ansiString) {
    // Regex to match ANSI escape sequences
    // Matches: \e[...m or \x1b[...m or actual escape character
    const ansiRegex = /(?:\x1b|\u001b|\\e|\\x1b)\[([0-9;]*)m/g;

    let html = "";
    let currentFg = null;
    let currentBg = null;
    let lastIndex = 0;
    let spanOpen = false;

    // Replace escaped representations with actual escape character for easier processing
    let processed = ansiString
      .replace(/\\e/g, "\x1b")
      .replace(/\\x1b/g, "\x1b");

    let match;
    while ((match = ansiRegex.exec(processed)) !== null) {
      // Add text before this escape sequence
      const textBefore = processed.slice(lastIndex, match.index);
      if (textBefore) {
        html += this.escapeHtml(textBefore);
      }

      // Parse the escape code
      const style = this.parseEscapeCode(match[1]);

      // Close previous span if needed
      if (spanOpen) {
        html += "</span>";
        spanOpen = false;
      }

      // Handle reset
      if (style.reset) {
        currentFg = null;
        currentBg = null;
      }

      // Update current colors
      if (style.fg) currentFg = style.fg;
      if (style.bg) currentBg = style.bg;

      // Open new span if we have colors
      if (currentFg || currentBg) {
        const styles = [];
        if (currentFg) styles.push(`color:${currentFg}`);
        if (currentBg) styles.push(`background-color:${currentBg}`);
        html += `<span style="${styles.join(";")}">`;
        spanOpen = true;
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    const remaining = processed.slice(lastIndex);
    if (remaining) {
      html += this.escapeHtml(remaining);
    }

    // Close any open span
    if (spanOpen) {
      html += "</span>";
    }

    return html;
  },

  // Escape HTML special characters (but preserve our spans)
  escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  },

  // Convert and wrap in a pre-formatted container for proper display
  convertToBlock(ansiString, className = "ansi-art") {
    const html = this.convert(ansiString);
    return `<pre class="${className}">${html}</pre>`;
  },
};

// Export for use in other modules
if (typeof window !== "undefined") {
  window.AnsiConverter = AnsiConverter;
}

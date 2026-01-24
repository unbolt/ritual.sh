// ANSI to HTML Converter (256-color + bold, persistent spans)
const AnsiConverter = {
  // Standard + 256-color palette
  palette: [
    "#000000",
    "#800000",
    "#008000",
    "#808000",
    "#000080",
    "#800080",
    "#008080",
    "#c0c0c0",
    "#808080",
    "#ff0000",
    "#00ff00",
    "#ffff00",
    "#0000ff",
    "#ff00ff",
    "#00ffff",
    "#ffffff",
    // 216-color cube (16-231)
    ...(() => {
      const colors = [];
      const levels = [0, 95, 135, 175, 215, 255];
      for (let r = 0; r < 6; r++) {
        for (let g = 0; g < 6; g++) {
          for (let b = 0; b < 6; b++) {
            colors.push(
              `#${levels[r].toString(16).padStart(2, "0")}${levels[g].toString(16).padStart(2, "0")}${levels[b].toString(16).padStart(2, "0")}`,
            );
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

  // Convert 256-color index to hex
  ansi256ToHex(index) {
    index = Number(index);
    if (index < this.palette.length) return this.palette[index];
    return null;
  },

  // Escape HTML special characters
  escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  },

  // Convert style object to CSS string
  styleToCss(style) {
    const css = [];
    if (style.color) css.push(`color:${style.color}`);
    if (style.backgroundColor)
      css.push(`background-color:${style.backgroundColor}`);
    if (style.bold) css.push("font-weight:bold");
    return css.join(";");
  },

  // Convert ANSI string to HTML
  convert(ansiString) {
    // Normalize escapes (\e and \x1b)
    let processed = ansiString
      .replace(/\\e/g, "\x1b")
      .replace(/\\x1b/g, "\x1b");

    // Regex to match ANSI SGR sequences
    const ansiRegex = /\x1b\[([0-9;]*)m/g;

    let html = "";
    let lastIndex = 0;
    let spanOpen = false;
    let currentStyle = {};

    let match;
    while ((match = ansiRegex.exec(processed)) !== null) {
      // Append text before escape sequence
      const textBefore = processed.slice(lastIndex, match.index);
      if (textBefore) html += this.escapeHtml(textBefore);

      // Parse SGR codes
      const codes = match[1].split(";").map((s) => (s === "" ? 0 : Number(s)));
      let styleChanged = false;

      for (let i = 0; i < codes.length; i++) {
        const code = codes[i];

        // Reset
        if (code === 0) {
          currentStyle = {};
          styleChanged = true;
          continue;
        }

        // Bold
        if (code === 1) {
          currentStyle.bold = true;
          styleChanged = true;
          continue;
        }

        // Foreground 30-37
        if (code >= 30 && code <= 37) {
          currentStyle.color = this.palette[code - 30];
          styleChanged = true;
          continue;
        }

        // Bright foreground 90-97
        if (code >= 90 && code <= 97) {
          currentStyle.color = this.palette[code - 90 + 8];
          styleChanged = true;
          continue;
        }

        // Background 40-47
        if (code >= 40 && code <= 47) {
          currentStyle.backgroundColor = this.palette[code - 40];
          styleChanged = true;
          continue;
        }

        // Bright background 100-107
        if (code >= 100 && code <= 107) {
          currentStyle.backgroundColor = this.palette[code - 100 + 8];
          styleChanged = true;
          continue;
        }

        // 256-color foreground: 38;5;N
        if (code === 38 && codes[i + 1] === 5) {
          currentStyle.color = this.ansi256ToHex(codes[i + 2]);
          i += 2;
          styleChanged = true;
          continue;
        }

        // 256-color background: 48;5;N
        if (code === 48 && codes[i + 1] === 5) {
          currentStyle.backgroundColor = this.ansi256ToHex(codes[i + 2]);
          i += 2;
          styleChanged = true;
          continue;
        }
      }

      // Update span if style changed
      if (styleChanged) {
        if (spanOpen) html += "</span>";
        const css = this.styleToCss(currentStyle);
        if (css) {
          html += `<span style="${css}">`;
          spanOpen = true;
        } else {
          spanOpen = false;
        }
      }

      lastIndex = match.index + match[0].length;
    }

    // Append remaining text
    const remaining = processed.slice(lastIndex);
    if (remaining) html += this.escapeHtml(remaining);

    // Close final span
    if (spanOpen) html += "</span>";

    return html;
  },

  // Wrap in <pre> for proper display
  convertToBlock(ansiString, className = "ansi-art") {
    console.log("AnsiConverter.convertToBlock called");
    return `<pre class="${className}">${this.convert(ansiString)}</pre>`;
  },
};

// Export for browser
if (typeof window !== "undefined") window.AnsiConverter = AnsiConverter;

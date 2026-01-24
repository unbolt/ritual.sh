// Table Helper - Generates monospace box-drawn tables for terminal games

const TableHelper = {
  // Box drawing characters
  chars: {
    single: {
      topLeft: "┌",
      topRight: "┐",
      bottomLeft: "└",
      bottomRight: "┘",
      horizontal: "─",
      vertical: "│",
      leftT: "├",
      rightT: "┤",
      topT: "┬",
      bottomT: "┴",
      cross: "┼",
    },
    double: {
      topLeft: "╔",
      topRight: "╗",
      bottomLeft: "╚",
      bottomRight: "╝",
      horizontal: "═",
      vertical: "║",
      leftT: "╠",
      rightT: "╣",
      topT: "╦",
      bottomT: "╩",
      cross: "╬",
    },
    ascii: {
      topLeft: "+",
      topRight: "+",
      bottomLeft: "+",
      bottomRight: "+",
      horizontal: "-",
      vertical: "|",
      leftT: "+",
      rightT: "+",
      topT: "+",
      bottomT: "+",
      cross: "+",
    },
  },

  /**
   * Generate a complete table with headers and rows
   * @param {Object} options - Table configuration
   * @param {string} [options.title] - Optional title for the table
   * @param {string[]} [options.headers] - Column headers
   * @param {Array<Array<string|{text: string, className?: string}>>} options.rows - Table data rows
   * @param {number[]} [options.widths] - Column widths (auto-calculated if not provided)
   * @param {string[]} [options.align] - Column alignments ('left', 'right', 'center')
   * @param {string} [options.style='single'] - Border style ('single', 'double', 'ascii')
   * @param {number} [options.padding=1] - Cell padding
   * @returns {Array<string|{text: string, className?: string}>} Array of content blocks
   */
  table(options) {
    const {
      title,
      headers,
      rows = [],
      widths: customWidths,
      align = [],
      style = "single",
      padding = 1,
    } = options;

    const c = this.chars[style] || this.chars.single;
    const output = [];

    // Calculate column widths
    const widths = customWidths || this._calculateWidths(headers, rows, padding);
    const totalWidth = widths.reduce((a, b) => a + b, 0) + widths.length + 1;

    // Top border
    output.push(c.topLeft + c.horizontal.repeat(totalWidth - 2) + c.topRight);

    // Title (if provided)
    if (title) {
      output.push(this._centerText(title, totalWidth, c.vertical));
      output.push(c.leftT + c.horizontal.repeat(totalWidth - 2) + c.rightT);
    }

    // Headers (if provided)
    if (headers) {
      output.push(this._formatRow(headers, widths, align, c.vertical, padding));
      output.push(c.leftT + c.horizontal.repeat(totalWidth - 2) + c.rightT);
    }

    // Data rows
    for (const row of rows) {
      const formattedRow = this._formatRow(row, widths, align, c.vertical, padding);

      // Check if any cell has a className
      const hasClassName = row.some(cell => cell && typeof cell === "object" && cell.className);

      if (hasClassName) {
        // Find the className from the row (use first one found)
        const className = row.find(cell => cell && typeof cell === "object" && cell.className)?.className;
        output.push({ text: formattedRow, className });
      } else {
        output.push(formattedRow);
      }
    }

    // Bottom border
    output.push(c.bottomLeft + c.horizontal.repeat(totalWidth - 2) + c.bottomRight);

    return output;
  },

  /**
   * Generate a simple bordered box with text
   * @param {string|string[]} content - Content to display
   * @param {Object} [options] - Box options
   * @param {number} [options.width] - Box width (auto if not set)
   * @param {string} [options.style='single'] - Border style
   * @param {string} [options.align='left'] - Text alignment
   * @returns {string[]} Array of strings
   */
  box(content, options = {}) {
    const { width: customWidth, style = "single", align = "left" } = options;
    const c = this.chars[style] || this.chars.single;
    const lines = Array.isArray(content) ? content : [content];

    const maxLineWidth = Math.max(...lines.map(l => this._textLength(l)));
    const width = customWidth || maxLineWidth + 4;
    const innerWidth = width - 2;

    const output = [];
    output.push(c.topLeft + c.horizontal.repeat(innerWidth) + c.topRight);

    for (const line of lines) {
      const text = typeof line === "string" ? line : line.text || "";
      const padded = this._alignText(text, innerWidth - 2, align);
      output.push(c.vertical + " " + padded + " " + c.vertical);
    }

    output.push(c.bottomLeft + c.horizontal.repeat(innerWidth) + c.bottomRight);
    return output;
  },

  /**
   * Generate a separator line
   * @param {number} width - Line width
   * @param {string} [style='single'] - Border style
   * @param {string} [type='middle'] - 'top', 'middle', 'bottom'
   * @returns {string}
   */
  separator(width, style = "single", type = "middle") {
    const c = this.chars[style] || this.chars.single;
    const inner = c.horizontal.repeat(width - 2);

    switch (type) {
      case "top":
        return c.topLeft + inner + c.topRight;
      case "bottom":
        return c.bottomLeft + inner + c.bottomRight;
      default:
        return c.leftT + inner + c.rightT;
    }
  },

  /**
   * Pad or truncate text to exact width
   * @param {string} text - Input text
   * @param {number} width - Target width
   * @param {string} [align='left'] - Alignment
   * @returns {string}
   */
  pad(text, width, align = "left") {
    return this._alignText(text, width, align);
  },

  // Internal helpers

  _calculateWidths(headers, rows, padding) {
    const allRows = headers ? [headers, ...rows] : rows;
    const numCols = Math.max(...allRows.map(r => r.length));
    const widths = new Array(numCols).fill(0);

    for (const row of allRows) {
      for (let i = 0; i < row.length; i++) {
        const cell = row[i];
        const text = typeof cell === "object" ? (cell.text || "") : String(cell || "");
        widths[i] = Math.max(widths[i], text.length + padding * 2);
      }
    }

    return widths;
  },

  _formatRow(row, widths, alignments, verticalChar, padding) {
    const cells = [];
    for (let i = 0; i < widths.length; i++) {
      const cell = row[i];
      const text = typeof cell === "object" ? (cell.text || "") : String(cell || "");
      const align = alignments[i] || "left";
      const cellWidth = widths[i] - padding * 2;
      const padChar = " ".repeat(padding);
      cells.push(padChar + this._alignText(text, cellWidth, align) + padChar);
    }
    return verticalChar + cells.join(verticalChar) + verticalChar;
  },

  _centerText(text, totalWidth, verticalChar) {
    const innerWidth = totalWidth - 2;
    const padded = this._alignText(text, innerWidth, "center");
    return verticalChar + padded + verticalChar;
  },

  _alignText(text, width, align) {
    const len = text.length;
    if (len >= width) {
      return text.substring(0, width);
    }

    const diff = width - len;
    switch (align) {
      case "right":
        return " ".repeat(diff) + text;
      case "center":
        const left = Math.floor(diff / 2);
        const right = diff - left;
        return " ".repeat(left) + text + " ".repeat(right);
      default:
        return text + " ".repeat(diff);
    }
  },

  _textLength(item) {
    if (typeof item === "string") return item.length;
    if (item && item.text) return item.text.length;
    return 0;
  },
};

// Make available globally
window.TableHelper = TableHelper;

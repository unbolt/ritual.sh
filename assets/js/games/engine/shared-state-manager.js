// Shared State Manager - Manages game state across multiple chapters in a series
class SharedStateManager {
  constructor(seriesId) {
    this.seriesId = seriesId;
    this.state = {};
    this.storageKey = `series_${seriesId}_state`;
  }

  // Initialize with default state (only sets values not already in storage)
  init(defaultState = {}) {
    this.state = this._deepClone(defaultState);
    this._loadFromStorage();
  }

  // Get value using dot notation path (e.g., "inventory.sword")
  get(path, defaultValue = undefined) {
    const parts = path.split(".");
    let current = this.state;

    for (const part of parts) {
      if (current === undefined || current === null) {
        return defaultValue;
      }
      current = current[part];
    }

    return current !== undefined ? current : defaultValue;
  }

  // Set value using dot notation path
  set(path, value) {
    const parts = path.split(".");
    let current = this.state;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (current[part] === undefined) {
        current[part] = {};
      }
      current = current[part];
    }

    current[parts[parts.length - 1]] = value;
    this._saveToStorage();
  }

  // Increment a numeric value
  increment(path, amount = 1) {
    const current = this.get(path, 0);
    this.set(path, current + amount);
  }

  // Decrement a numeric value
  decrement(path, amount = 1) {
    this.increment(path, -amount);
  }

  // Add item to an array (if not already present)
  addToArray(path, item) {
    const arr = this.get(path, []);
    if (!arr.includes(item)) {
      arr.push(item);
      this.set(path, arr);
    }
  }

  // Remove item from an array
  removeFromArray(path, item) {
    const arr = this.get(path, []);
    const index = arr.indexOf(item);
    if (index > -1) {
      arr.splice(index, 1);
      this.set(path, arr);
    }
  }

  // Check if array contains item
  hasItem(path, item) {
    const arr = this.get(path, []);
    return arr.includes(item);
  }

  // Check if a specific chapter is complete
  isChapterComplete(chapterNumber) {
    const completed = this.get("chapters_completed", []);
    return completed.includes(chapterNumber);
  }

  // Mark a chapter as complete
  markChapterComplete(chapterNumber) {
    this.addToArray("chapters_completed", chapterNumber);
  }

  // Check if chapter can be played (previous chapters complete)
  canPlayChapter(chapterNumber) {
    if (chapterNumber <= 1) return true;
    return this.isChapterComplete(chapterNumber - 1);
  }

  // Get the highest completed chapter number
  getHighestCompletedChapter() {
    const completed = this.get("chapters_completed", []);
    return completed.length > 0 ? Math.max(...completed) : 0;
  }

  // Get entire state (for debugging)
  getAll() {
    return this._deepClone(this.state);
  }

  // Reset all series state
  reset() {
    this.state = {};
    try {
      localStorage.removeItem(this.storageKey);
    } catch (e) {
      console.warn("Failed to clear series state from storage:", e);
    }
  }

  // Check if there is saved state
  hasSavedState() {
    try {
      return localStorage.getItem(this.storageKey) !== null;
    } catch (e) {
      return false;
    }
  }

  // Export state for debugging or backup
  exportState() {
    return JSON.stringify(this.state, null, 2);
  }

  // Import state from backup
  importState(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      this.state = data;
      this._saveToStorage();
      return true;
    } catch (e) {
      console.error("Failed to import state:", e);
      return false;
    }
  }

  _saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.warn("Failed to save series state:", e);
    }
  }

  _loadFromStorage() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.state = this._mergeDeep(this.state, parsed);
      }
    } catch (e) {
      console.warn("Failed to load series state:", e);
    }
  }

  _deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  _mergeDeep(target, source) {
    const result = { ...target };
    for (const key of Object.keys(source)) {
      if (
        source[key] &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key])
      ) {
        result[key] = this._mergeDeep(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }
}

// Make available globally
window.SharedStateManager = SharedStateManager;

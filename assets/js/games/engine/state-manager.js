// State Manager - Manages game state with persistence and conditions
class StateManager {
  constructor(gameId) {
    this.gameId = gameId;
    this.state = {};
    this.storageKey = `game_${gameId}_state`;
  }

  // Initialize with default state
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

  // Evaluate a condition against current state
  evaluate(condition) {
    if (typeof condition === "boolean") {
      return condition;
    }

    if (typeof condition === "string") {
      // Simple path check - truthy value
      return !!this.get(condition);
    }

    if (typeof condition === "object" && condition !== null) {
      return this._evaluateConditionObject(condition);
    }

    return true;
  }

  _evaluateConditionObject(cond) {
    // Logical operators
    if (cond.and) {
      return cond.and.every((c) => this.evaluate(c));
    }
    if (cond.or) {
      return cond.or.some((c) => this.evaluate(c));
    }
    if (cond.not) {
      return !this.evaluate(cond.not);
    }

    // Value comparisons
    const value = this.get(cond.path);

    if ("equals" in cond) {
      return value === cond.equals;
    }
    if ("notEquals" in cond) {
      return value !== cond.notEquals;
    }
    if ("greaterThan" in cond) {
      return value > cond.greaterThan;
    }
    if ("greaterThanOrEqual" in cond) {
      return value >= cond.greaterThanOrEqual;
    }
    if ("lessThan" in cond) {
      return value < cond.lessThan;
    }
    if ("lessThanOrEqual" in cond) {
      return value <= cond.lessThanOrEqual;
    }
    if ("contains" in cond) {
      return Array.isArray(value) && value.includes(cond.contains);
    }
    if ("notContains" in cond) {
      return !Array.isArray(value) || !value.includes(cond.notContains);
    }

    // Default: check truthiness of path
    return !!value;
  }

  // Get entire state (for debugging)
  getAll() {
    return this._deepClone(this.state);
  }

  // Reset state and clear storage
  reset() {
    this.state = {};
    try {
      localStorage.removeItem(this.storageKey);
    } catch (e) {
      console.warn("Failed to clear game state from storage:", e);
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

  _saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.warn("Failed to save game state:", e);
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
      console.warn("Failed to load game state:", e);
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

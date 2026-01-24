// Scene Registry - Global registry for shared scene factories
// Scene factories are functions that take a context and return scene definitions

// Initialize global scene factories object
window.SceneFactories = window.SceneFactories || {};

// Helper class for working with scene factories
class SceneRegistry {
  // Register a scene factory
  static register(id, factory) {
    if (typeof factory !== "function") {
      console.error(`Scene factory must be a function: ${id}`);
      return false;
    }
    window.SceneFactories[id] = factory;
    return true;
  }

  // Get a scene factory
  static get(id) {
    return window.SceneFactories[id] || null;
  }

  // Check if a factory exists
  static has(id) {
    return id in window.SceneFactories;
  }

  // List all registered factories
  static list() {
    return Object.keys(window.SceneFactories);
  }

  // Unregister a factory
  static unregister(id) {
    delete window.SceneFactories[id];
  }

  // Create scenes from a factory with context
  static createScenes(id, context) {
    const factory = this.get(id);
    if (!factory) {
      console.warn(`Scene factory not found: ${id}`);
      return {};
    }
    try {
      return factory(context);
    } catch (e) {
      console.error(`Error creating scenes from factory ${id}:`, e);
      return {};
    }
  }

  // Merge multiple factories into one scene object
  static mergeFactories(factoryIds, context) {
    const merged = {};
    for (const id of factoryIds) {
      const scenes = this.createScenes(id, context);
      Object.assign(merged, scenes);
    }
    return merged;
  }
}

// Make available globally
window.SceneRegistry = SceneRegistry;

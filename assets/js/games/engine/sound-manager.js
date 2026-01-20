// Sound Manager - Handles audio loading, caching, and playback for games
class SoundManager {
  constructor(adapter) {
    this.adapter = adapter;
    this.sounds = new Map(); // soundId -> { audio, loaded, loading, error }
    this.currentlyPlaying = new Set(); // Track currently playing sounds
    this.globalVolume = 1.0;
  }

  // Preload a sound file
  async preload(soundId, url) {
    // If already loaded or loading, return existing promise
    if (this.sounds.has(soundId)) {
      const sound = this.sounds.get(soundId);
      if (sound.loaded) {
        return sound.audio;
      }
      if (sound.loading) {
        return sound.loadingPromise;
      }
      if (sound.error) {
        throw new Error(`Sound ${soundId} failed to load: ${sound.error}`);
      }
    }

    // Create new audio element
    const audio = new Audio();
    const soundEntry = {
      audio,
      loaded: false,
      loading: true,
      error: null,
      url,
    };

    // Create promise for loading
    const loadingPromise = new Promise((resolve, reject) => {
      const onLoad = () => {
        soundEntry.loaded = true;
        soundEntry.loading = false;
        audio.removeEventListener("canplaythrough", onLoad);
        audio.removeEventListener("error", onError);
        resolve(audio);
      };

      const onError = (e) => {
        soundEntry.loading = false;
        soundEntry.error = e.message || "Failed to load audio";
        audio.removeEventListener("canplaythrough", onLoad);
        audio.removeEventListener("error", onError);
        reject(new Error(`Failed to load sound ${soundId}: ${soundEntry.error}`));
      };

      audio.addEventListener("canplaythrough", onLoad, { once: true });
      audio.addEventListener("error", onError, { once: true });
      audio.preload = "auto";
      audio.src = url;
      audio.load();
    });

    soundEntry.loadingPromise = loadingPromise;
    this.sounds.set(soundId, soundEntry);

    return loadingPromise;
  }

  // Play a sound (will load if not already loaded)
  async play(soundId, options = {}) {
    const {
      loop = false,
      volume = 1.0,
      onEnd = null,
      fade = false,
      fadeDuration = 1000,
    } = options;

    let soundEntry = this.sounds.get(soundId);

    if (!soundEntry) {
      throw new Error(`Sound ${soundId} not preloaded. Use preload() first.`);
    }

    // Wait for loading if still loading
    if (soundEntry.loading) {
      await soundEntry.loadingPromise;
    }

    if (soundEntry.error) {
      throw new Error(`Sound ${soundId} failed to load: ${soundEntry.error}`);
    }

    const audio = soundEntry.audio;

    // Clone the audio element for concurrent playback
    const playInstance = audio.cloneNode();
    playInstance.loop = loop;
    playInstance.volume = fade ? 0 : volume * this.globalVolume;

    // Track this instance
    const trackingId = `${soundId}_${Date.now()}`;
    this.currentlyPlaying.add(trackingId);

    // Handle end event
    const cleanup = () => {
      this.currentlyPlaying.delete(trackingId);
      playInstance.removeEventListener("ended", cleanup);
      if (onEnd) onEnd();
    };

    playInstance.addEventListener("ended", cleanup);

    // Play the sound
    try {
      await playInstance.play();

      // Fade in if requested
      if (fade) {
        this._fadeIn(playInstance, volume * this.globalVolume, fadeDuration);
      }

      return {
        instance: playInstance,
        stop: () => {
          playInstance.pause();
          playInstance.currentTime = 0;
          cleanup();
        },
        fadeOut: (duration = fadeDuration) => {
          return this._fadeOut(playInstance, duration).then(() => {
            playInstance.pause();
            cleanup();
          });
        },
      };
    } catch (error) {
      cleanup();
      throw new Error(`Failed to play sound ${soundId}: ${error.message}`);
    }
  }

  // Fade in audio
  _fadeIn(audio, targetVolume, duration) {
    const steps = 20;
    const stepDuration = duration / steps;
    const volumeStep = targetVolume / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      audio.volume = Math.min(volumeStep * currentStep, targetVolume);

      if (currentStep >= steps) {
        clearInterval(interval);
        audio.volume = targetVolume;
      }
    }, stepDuration);
  }

  // Fade out audio
  _fadeOut(audio, duration) {
    return new Promise((resolve) => {
      const steps = 20;
      const stepDuration = duration / steps;
      const startVolume = audio.volume;
      const volumeStep = startVolume / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        audio.volume = Math.max(startVolume - volumeStep * currentStep, 0);

        if (currentStep >= steps) {
          clearInterval(interval);
          audio.volume = 0;
          resolve();
        }
      }, stepDuration);
    });
  }

  // Stop all currently playing sounds
  stopAll() {
    for (const soundId of Array.from(this.currentlyPlaying)) {
      const [id] = soundId.split("_");
      const soundEntry = this.sounds.get(id);
      if (soundEntry && soundEntry.audio) {
        soundEntry.audio.pause();
        soundEntry.audio.currentTime = 0;
      }
    }
    this.currentlyPlaying.clear();
  }

  // Set global volume (0.0 to 1.0)
  setGlobalVolume(volume) {
    this.globalVolume = Math.max(0, Math.min(1, volume));
  }

  // Check if a sound is loaded
  isLoaded(soundId) {
    const sound = this.sounds.get(soundId);
    return sound && sound.loaded;
  }

  // Check if a sound is currently loading
  isLoading(soundId) {
    const sound = this.sounds.get(soundId);
    return sound && sound.loading;
  }

  // Get loading progress for all sounds
  getLoadingStatus() {
    const status = {
      total: this.sounds.size,
      loaded: 0,
      loading: 0,
      failed: 0,
    };

    for (const [, sound] of this.sounds) {
      if (sound.loaded) status.loaded++;
      else if (sound.loading) status.loading++;
      else if (sound.error) status.failed++;
    }

    return status;
  }

  // Clear all sounds (useful for cleanup)
  clear() {
    this.stopAll();
    this.sounds.clear();
  }

  // Remove a specific sound from cache
  unload(soundId) {
    const sound = this.sounds.get(soundId);
    if (sound && sound.audio) {
      sound.audio.pause();
      sound.audio.src = "";
    }
    this.sounds.delete(soundId);
  }
}

// Make available globally
window.SoundManager = SoundManager;

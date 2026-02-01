/**
 * Arcade Games List - Interactive Controls
 * Handles keyboard navigation, joystick visuals, button presses, and sound effects
 */

class ArcadeGamesController {
  constructor() {
    // DOM elements
    this.gamesGrid = document.getElementById('games-grid');
    this.joystick = document.getElementById('arcade-joystick');
    this.selectButton = document.getElementById('button-select');
    this.backButton = document.getElementById('button-back');
    this.soundToggle = document.getElementById('sound-toggle');
    this.insertCoinMessage = document.querySelector('.insert-coin-message');

    // State
    this.currentGameIndex = 0;
    this.gameCards = [];
    this.soundEnabled = false; // Start muted
    this.sounds = {};

    // Initialize
    if (this.gamesGrid) {
      this.init();
    }
  }

  /**
   * Initialize the arcade controller
   */
  init() {
    this.gameCards = Array.from(this.gamesGrid.querySelectorAll('.game-card'));

    // Select first released game by default
    if (this.gameCards.length > 0) {
      const firstReleasedIndex = this.gameCards.findIndex(card => this.isGameReleased(card));
      if (firstReleasedIndex >= 0) {
        this.selectGame(firstReleasedIndex);
      } else {
        this.selectGame(0);
      }
    } else {
      this.showInsertCoin();
    }

    // Load sound effects
    this.loadSounds();

    // Set up event listeners
    this.setupKeyboardControls();
    this.setupMouseControls();
    this.setupSoundToggle();

    // Hide insert coin message after a moment
    setTimeout(() => this.hideInsertCoin(), 2000);
  }

  /**
   * Load sound effect files
   */
  loadSounds() {
    const soundFiles = {
      move: '/audio/arcade-move.mp3',
      select: '/audio/arcade-select.mp3',
      coin: '/audio/arcade-coin.mp3',
      back: '/audio/arcade-back.mp3'
    };

    Object.keys(soundFiles).forEach(key => {
      this.sounds[key] = new Audio(soundFiles[key]);
      this.sounds[key].volume = 0.3;

      // Preload
      this.sounds[key].load();
    });
  }

  /**
   * Play a sound effect
   */
  playSound(soundName) {
    if (!this.soundEnabled || !this.sounds[soundName]) return;

    // Clone and play to allow overlapping sounds
    const sound = this.sounds[soundName].cloneNode();
    sound.volume = this.sounds[soundName].volume;
    sound.play().catch(err => console.warn('Sound play failed:', err));
  }

  /**
   * Set up keyboard event listeners
   */
  setupKeyboardControls() {
    document.addEventListener('keydown', (e) => {
      // Prevent default for arrow keys and space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Enter'].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
          this.moveUp();
          this.updateJoystickVisual('up');
          break;
        case 'ArrowDown':
          this.moveDown();
          this.updateJoystickVisual('down');
          break;
        case 'ArrowLeft':
          this.moveLeft();
          this.updateJoystickVisual('left');
          break;
        case 'ArrowRight':
          this.moveRight();
          this.updateJoystickVisual('right');
          break;
        case 'Enter':
        case ' ':
          this.pressSelect();
          this.updateButtonVisual('select', true);
          break;
        case 'Escape':
          this.pressBack();
          this.updateButtonVisual('back', true);
          break;
      }
    });

    // Reset joystick and button visuals on key up
    document.addEventListener('keyup', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        this.updateJoystickVisual('neutral');
      }
      if (['Enter', ' '].includes(e.key)) {
        this.updateButtonVisual('select', false);
      }
      if (e.key === 'Escape') {
        this.updateButtonVisual('back', false);
      }
    });
  }

  /**
   * Set up mouse/touch event listeners
   */
  setupMouseControls() {
    // Game cards click
    this.gameCards.forEach((card, index) => {
      card.addEventListener('click', () => {
        if (this.isGameReleased(card)) {
          this.selectGame(index);
          this.pressSelect();
        }
      });

      card.addEventListener('mouseenter', () => {
        this.selectGame(index);
      });
    });

    // Buttons
    this.selectButton.addEventListener('click', () => {
      this.pressSelect();
    });

    this.backButton.addEventListener('click', () => {
      this.pressBack();
    });
  }

  /**
   * Set up sound toggle button
   */
  setupSoundToggle() {
    const soundOn = this.soundToggle.querySelector('.sound-on');
    const soundOff = this.soundToggle.querySelector('.sound-off');

    // Set initial state (muted)
    soundOn.style.display = 'none';
    soundOff.style.display = 'inline-block';

    this.soundToggle.addEventListener('click', () => {
      this.soundEnabled = !this.soundEnabled;

      if (this.soundEnabled) {
        soundOn.style.display = 'inline-block';
        soundOff.style.display = 'none';
        this.playSound('coin');
      } else {
        soundOn.style.display = 'none';
        soundOff.style.display = 'inline-block';
      }
    });
  }

  /**
   * Navigate up in grid
   */
  moveUp() {
    // Calculate columns based on grid layout
    const columns = this.calculateColumns();
    const newIndex = this.currentGameIndex - columns;

    if (newIndex >= 0) {
      this.selectGame(newIndex);
      this.playSound('move');
    }
  }

  /**
   * Navigate down in grid
   */
  moveDown() {
    const columns = this.calculateColumns();
    const newIndex = this.currentGameIndex + columns;

    if (newIndex < this.gameCards.length) {
      this.selectGame(newIndex);
      this.playSound('move');
    }
  }

  /**
   * Navigate left in grid
   */
  moveLeft() {
    const newIndex = this.findPreviousSelectableGame(this.currentGameIndex);
    if (newIndex !== -1) {
      this.selectGame(newIndex);
      this.playSound('move');
    }
  }

  /**
   * Navigate right in grid
   */
  moveRight() {
    const newIndex = this.findNextSelectableGame(this.currentGameIndex);
    if (newIndex !== -1) {
      this.selectGame(newIndex);
      this.playSound('move');
    }
  }

  /**
   * Calculate number of columns in grid
   */
  calculateColumns() {
    if (this.gameCards.length === 0) return 1;

    const firstCard = this.gameCards[0];
    const gridWidth = this.gamesGrid.offsetWidth;
    const cardWidth = firstCard.offsetWidth;
    const gap = 20; // From CSS

    return Math.floor((gridWidth + gap) / (cardWidth + gap)) || 1;
  }

  /**
   * Check if a game is released
   */
  isGameReleased(card) {
    return card.dataset.released === 'true';
  }

  /**
   * Find next selectable game (skip unreleased)
   */
  findNextSelectableGame(currentIndex) {
    for (let i = currentIndex + 1; i < this.gameCards.length; i++) {
      if (this.isGameReleased(this.gameCards[i])) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Find previous selectable game (skip unreleased)
   */
  findPreviousSelectableGame(currentIndex) {
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (this.isGameReleased(this.gameCards[i])) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Select a game card
   */
  selectGame(index) {
    // Remove previous selection
    this.gameCards.forEach(card => card.classList.remove('selected'));

    // Add new selection
    this.currentGameIndex = index;
    this.gameCards[index].classList.add('selected');

    // Scroll into view if needed
    this.gameCards[index].scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  /**
   * Press select button (navigate to game)
   */
  pressSelect() {
    const selectedCard = this.gameCards[this.currentGameIndex];

    // Don't allow selecting unreleased games
    if (!this.isGameReleased(selectedCard)) {
      return;
    }

    this.playSound('select');

    const link = selectedCard.querySelector('a');

    if (link) {
      // Add visual feedback
      selectedCard.style.transform = 'scale(0.95)';
      setTimeout(() => {
        selectedCard.style.transform = '';
        window.location.href = link.href;
      }, 150);
    }
  }

  /**
   * Press back button (go to main page or previous)
   */
  pressBack() {
    this.playSound('back');

    // Navigate back in history or to home
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  }

  /**
   * Update joystick visual state
   */
  updateJoystickVisual(direction) {
    this.joystick.classList.remove('up', 'down', 'left', 'right');

    if (direction !== 'neutral') {
      this.joystick.classList.add(direction);
    }
  }

  /**
   * Update button visual state
   */
  updateButtonVisual(button, pressed) {
    const buttonElement = button === 'select' ? this.selectButton : this.backButton;

    if (pressed) {
      buttonElement.classList.add('pressed');
    } else {
      buttonElement.classList.remove('pressed');

      // Slight delay to show button release
      setTimeout(() => {
        buttonElement.classList.remove('pressed');
      }, 100);
    }
  }

  /**
   * Show insert coin message
   */
  showInsertCoin() {
    this.insertCoinMessage.classList.add('visible');
  }

  /**
   * Hide insert coin message
   */
  hideInsertCoin() {
    this.insertCoinMessage.classList.remove('visible');
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ArcadeGamesController();
  });
} else {
  new ArcadeGamesController();
}

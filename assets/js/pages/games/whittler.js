/**
 * Whittler Game High Scores
 * Fetches and displays high scores from the ritual.sh high score API
 */

class WhittlerHighScores {
  constructor() {
    this.apiUrl = "https://api.ritual.sh/highscore";
    this.gameId = "whittling-clicker";
    this.container = document.getElementById("whittler-highscores");
    this.maxScores = 10;

    if (this.container) {
      this.init();
    }
  }

  async init() {
    await this.loadHighScores();
  }

  /**
   * Fetch high scores from the API
   */
  async loadHighScores() {
    try {
      this.showLoading();

      const response = await fetch(
        `${this.apiUrl}/leaderboard?game_id=${this.gameId}&limit=${this.maxScores}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.scores) {
        this.renderScores(data.scores);
      } else {
        throw new Error(data.error || "Failed to load high scores");
      }
    } catch (error) {
      console.error("Error loading high scores:", error);
      this.showError();
    }
  }

  /**
   * Render high scores to the DOM
   */
  renderScores(scores) {
    if (!scores || scores.length === 0) {
      this.container.innerHTML = `
        <div class="no-scores">
          <p>No high scores yet. Be the first!</p>
        </div>
      `;
      return;
    }

    const scoresHTML = `
      <ol class="highscore-list">
        ${scores
          .map(
            (score, index) => `
          <li class="highscore-entry ${index === 0 ? "top-score" : ""}">
            <span class="rank">#${index + 1}</span>
            <span class="player-name">${this.escapeHtml(this.truncateName(score.playerName || "Anonymous"))}</span>
            <span class="completion-time">${this.formatTime(score.formattedTime)}</span>
          </li>
        `,
          )
          .join("")}
      </ol>
    `;

    this.container.innerHTML = scoresHTML;
  }

  /**
   * Show loading state
   */
  showLoading() {
    this.container.innerHTML = `
      <div class="loading-scores">
        <p>Loading high scores...</p>
      </div>
    `;
  }

  /**
   * Show error state
   */
  showError() {
    this.container.innerHTML = `
      <div class="error-scores">
        <p>Failed to load high scores.</p>
        <button onclick="window.whittlerHighScores.loadHighScores()">Retry</button>
      </div>
    `;
  }

  /**
   * Format completion time (seconds) to readable format
   * Expects completionTime in seconds or HH:MM:SS format
   */
  formatTime(time) {
    if (typeof time === "string" && time.includes(":")) {
      // Already formatted
      return time;
    }

    const seconds = parseInt(time);
    if (isNaN(seconds)) return "Unknown";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }

  /**
   * Truncate player name to max length
   */
  truncateName(name, maxLength = 15) {
    if (name.length <= maxLength) {
      return name;
    }
    return name.substring(0, maxLength) + "...";
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize high scores when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.whittlerHighScores = new WhittlerHighScores();
  });
} else {
  window.whittlerHighScores = new WhittlerHighScores();
}

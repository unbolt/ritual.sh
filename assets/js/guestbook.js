/**
 * Guestbook functionality for ritual.sh
 * Custom implementation that calls the guestbook API directly
 */

class GuestbookManager {
  constructor() {
    // Configuration - Update this URL when the backend is deployed
    this.apiUrl = "https://guestbook.ritual.sh";
    this.perPage = 20;
    this.currentPage = 1;
    this.totalPages = 1;

    // DOM elements
    this.form = document.getElementById("guestbook-form");
    this.entriesList = document.getElementById("entries-list");
    this.entriesLoading = document.getElementById("entries-loading");
    this.entriesError = document.getElementById("entries-error");
    this.pagination = document.getElementById("pagination");
    this.formFeedback = document.getElementById("form-feedback");
    this.submitBtn = document.getElementById("submit-btn");

    this.init();
  }

  init() {
    if (!this.form) return;

    // Attach event listeners
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));

    // Load initial entries
    this.loadEntries();
  }

  /**
   * Load guestbook entries from the API
   */
  async loadEntries(page = 1) {
    this.currentPage = page;

    // Show loading state
    this.showLoading();

    try {
      const response = await fetch(
        `${this.apiUrl}/entries?page=${page}&per_page=${this.perPage}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Handle the actual API response structure
      if (data.entries !== undefined) {
        // API returns entries directly
        this.renderEntries(data.entries || []);
        this.totalPages = data.total_pages || 1;

        // Create pagination object from the flat response
        const pagination = {
          current_page: data.page || 1,
          total_pages: data.total_pages || 1,
          total_entries: data.total || 0,
          per_page: data.per_page || this.perPage
        };
        this.renderPagination(pagination);
      } else if (data.success === false) {
        // API returned an error
        throw new Error(data.error || "Failed to load entries");
      } else {
        throw new Error("Unexpected API response format");
      }
    } catch (error) {
      console.error("Error loading entries:", error);
      this.showError();
    }
  }

  /**
   * Render entries to the DOM
   */
  renderEntries(entries) {
    // Hide loading and error states
    this.entriesLoading.style.display = "none";
    this.entriesError.style.display = "none";
    this.entriesList.style.display = "block";

    if (entries.length === 0) {
      this.entriesList.innerHTML = `
        <div class="no-entries">
          <p>No entries yet. Be the first to sign the guestbook!</p>
          <span class="cursor-blink">_</span>
        </div>
      `;
      return;
    }

    // Build entries HTML
    const entriesHTML = entries
      .map((entry) => this.renderEntry(entry))
      .join("");

    this.entriesList.innerHTML = entriesHTML;
  }

  /**
   * Render a single entry
   */
  renderEntry(entry) {
    const date = this.formatDate(entry.timestamp);
    const nameHTML = entry.website
      ? `<a href="${this.escapeHtml(entry.website)}" target="_blank" rel="noopener noreferrer">${this.escapeHtml(entry.name)}</a>`
      : this.escapeHtml(entry.name);

    // Display website URL without https:// protocol
    const websiteDisplay = entry.website
      ? `<span class="entry-separator">|</span><span class="entry-website">${this.formatWebsiteUrl(entry.website)}</span>`
      : "";

    return `
      <div class="entry">
        <div class="entry-header">
          <span class="entry-name">${nameHTML}</span>
          ${websiteDisplay}
          <span class="entry-date">${date}</span>
        </div>
        <div class="entry-message">${this.escapeHtml(entry.message)}</div>
      </div>
    `;
  }

  /**
   * Render pagination controls
   */
  renderPagination(pagination) {
    if (pagination.total_pages <= 1) {
      this.pagination.style.display = "none";
      return;
    }

    this.pagination.style.display = "flex";

    const prevDisabled = pagination.current_page === 1 ? "disabled" : "";
    const nextDisabled =
      pagination.current_page === pagination.total_pages ? "disabled" : "";

    let pagesHTML = "";

    // Show page numbers (max 5)
    const startPage = Math.max(1, pagination.current_page - 2);
    const endPage = Math.min(pagination.total_pages, startPage + 4);

    for (let i = startPage; i <= endPage; i++) {
      const active = i === pagination.current_page ? "active" : "";
      pagesHTML += `
        <button class="pagination-button ${active}" data-page="${i}" ${active ? "disabled" : ""}>
          ${i}
        </button>
      `;
    }

    this.pagination.innerHTML = `
      <div class="pagination-info">
        Page ${pagination.current_page} of ${pagination.total_pages}
        (${pagination.total_entries} entries)
      </div>
      <div class="pagination-controls">
        <button class="pagination-button" data-page="${pagination.current_page - 1}" ${prevDisabled}>
          &lt; Prev
        </button>
        ${pagesHTML}
        <button class="pagination-button" data-page="${pagination.current_page + 1}" ${nextDisabled}>
          Next &gt;
        </button>
      </div>
    `;

    // Attach click handlers to pagination buttons
    this.pagination.querySelectorAll(".pagination-button").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const page = parseInt(e.target.dataset.page);
        if (page && page !== pagination.current_page) {
          this.loadEntries(page);
          // Scroll to top of entries
          document
            .querySelector(".guestbook-entries-container")
            .scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }

  /**
   * Handle form submission
   */
  async handleSubmit(e) {
    e.preventDefault();

    // Disable submit button
    this.submitBtn.disabled = true;
    this.submitBtn.querySelector(".button-text").textContent = "[ SENDING... ]";

    // Clear previous feedback
    this.formFeedback.className = "form-feedback";
    this.formFeedback.textContent = "";

    // Get form data
    const formData = new FormData(this.form);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      website: formData.get("website"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch(`${this.apiUrl}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      // Handle success response
      if (result.success || response.ok) {
        this.showSuccess(
          result.message ||
            "Entry submitted! It will appear after moderation. Thank you!",
        );
        this.form.reset();

        // If entry was auto-approved, reload entries
        if (result.status === "approved") {
          setTimeout(() => this.loadEntries(1), 1000);
        }
      } else {
        this.showFormError(result.error || result.message || "Failed to submit entry");
      }
    } catch (error) {
      console.error("Error submitting entry:", error);
      this.showFormError(
        "Network error. Please check your connection and try again.",
      );
    } finally {
      // Re-enable submit button
      this.submitBtn.disabled = false;
      this.submitBtn.querySelector(".button-text").textContent = "[ SUBMIT ]";
    }
  }

  /**
   * Show loading state
   */
  showLoading() {
    this.entriesLoading.style.display = "block";
    this.entriesError.style.display = "none";
    this.entriesList.style.display = "none";
    this.pagination.style.display = "none";
  }

  /**
   * Show error state
   */
  showError() {
    this.entriesLoading.style.display = "none";
    this.entriesError.style.display = "block";
    this.entriesList.style.display = "none";
    this.pagination.style.display = "none";
  }

  /**
   * Show form success message
   */
  showSuccess(message) {
    this.formFeedback.className = "form-feedback success";
    this.formFeedback.textContent = `SUCCESS: ${message}`;

    // Auto-hide after 10 seconds
    setTimeout(() => {
      this.formFeedback.className = "form-feedback";
    }, 10000);
  }

  /**
   * Show form error message
   */
  showFormError(message) {
    this.formFeedback.className = "form-feedback error";
    this.formFeedback.textContent = `ERROR: ${message}`;

    // Auto-hide after 8 seconds
    setTimeout(() => {
      this.formFeedback.className = "form-feedback";
    }, 8000);
  }

  /**
   * Format date to readable format
   */
  formatDate(dateString) {
    if (!dateString) return "Unknown date";

    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Unknown date";
    }

    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
  }

  /**
   * Format website URL for display (remove protocol)
   */
  formatWebsiteUrl(url) {
    if (!url) return "";

    try {
      const urlObj = new URL(url);
      // Return hostname + pathname, removing trailing slash
      let display = urlObj.hostname + urlObj.pathname;
      return this.escapeHtml(display.replace(/\/$/, ""));
    } catch (e) {
      // If URL parsing fails, just remove common protocols
      return this.escapeHtml(
        url.replace(/^https?:\/\//, "").replace(/\/$/, "")
      );
    }
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

// Initialize guestbook when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new GuestbookManager();
  });
} else {
  new GuestbookManager();
}

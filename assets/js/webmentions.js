/**
 * Webmention utilities for ritual.sh
 * Fetches and formats webmentions from the API
 */

class WebmentionUtils {
  constructor() {
    this.apiUrl = "https://api.ritual.sh";
  }

  /**
   * Fetch webmentions for a given target URL
   * @param {string} targetUrl - The page URL to get webmentions for
   * @param {number} limit - Maximum number of webmentions to fetch (default: 100)
   * @returns {Promise<Array>} Array of webmention objects
   */
  async fetch(targetUrl, limit = 100) {
    try {
      const params = new URLSearchParams({
        target: targetUrl,
        limit: limit.toString(),
      });

      const response = await fetch(`${this.apiUrl}/webmentions?${params}`);

      if (!response.ok) {
        console.error(`Webmention API error: ${response.status}`);
        return [];
      }

      const data = await response.json();
      return data.mentions || [];
    } catch (error) {
      console.error("Error fetching webmentions:", error);
      return [];
    }
  }

  /**
   * Format webmentions as a comma-separated list of links
   * @param {Array} mentions - Array of webmention objects
   * @returns {string} HTML string of comma-separated links
   */
  asCommaSeparatedList(mentions) {
    if (!mentions || mentions.length === 0) {
      return "";
    }

    return mentions
      .map((mention) => {
        const url = mention.author_url || mention.source;
        const domain = this.formatDomain(url);
        const escapedUrl = this.escapeHtml(url);
        const escapedDomain = this.escapeHtml(domain);
        return `<a href="${escapedUrl}" target="_blank">${escapedDomain}</a>`;
      })
      .join(", ");
  }

  /**
   * Format a URL to display just the domain (no protocol, www, or path)
   * @param {string} url - The URL to format
   * @returns {string} Clean domain name
   */
  formatDomain(url) {
    if (!url) return "";

    try {
      const urlObj = new URL(url);
      let domain = urlObj.hostname;
      // Remove www. prefix if present
      if (domain.startsWith("www.")) {
        domain = domain.substring(4);
      }
      return domain;
    } catch (e) {
      // Fallback: strip protocol and www manually
      return url
        .replace(/^https?:\/\//, "")
        .replace(/^www\./, "")
        .split("/")[0];
    }
  }

  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped HTML string
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Auto-initialize all webmention elements
   */
  async autoInit() {
    // Group elements by target URL to avoid duplicate API calls
    const targetGroups = new Map();

    const selectors = [
      "[data-webmention-list]",
      "[data-webmention-show]",
      "[data-webmention-hide]",
      "[data-webmention-text]",
    ];

    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        const targetUrl = this.getTargetUrl(element) || window.location.href;
        if (!targetGroups.has(targetUrl)) {
          targetGroups.set(targetUrl, []);
        }
        targetGroups.get(targetUrl).push(element);
      });
    });

    // Fetch and process each target URL
    for (const [targetUrl, elements] of targetGroups) {
      const mentions = await this.fetch(targetUrl);
      const hasMentions = mentions.length > 0;

      elements.forEach((element) => {
        this.processElement(element, mentions, hasMentions);
      });
    }
  }

  /**
   * Get the target URL from an element's data attributes or parent container
   */
  getTargetUrl(element) {
    // First check the element's own attributes for a non-empty value
    const ownUrl =
      element.dataset.webmentionList ||
      element.dataset.webmentionShow ||
      element.dataset.webmentionHide ||
      element.dataset.webmentionText ||
      "";

    if (ownUrl) {
      return ownUrl;
    }

    // Check for parent container with data-webmention-target
    const container = element.closest("[data-webmention-target]");
    if (container) {
      return container.dataset.webmentionTarget;
    }

    return "";
  }

  /**
   * Process a single element based on its data attributes
   */
  processElement(element, mentions, hasMentions) {
    // Handle data-webmention-list
    if (element.hasAttribute("data-webmention-list")) {
      element.innerHTML = this.asCommaSeparatedList(mentions);
    }

    // Handle data-webmention-show (visible only if mentions exist)
    if (element.hasAttribute("data-webmention-show")) {
      element.style.display = hasMentions ? "" : "none";
    }

    // Handle data-webmention-hide (hidden if mentions exist)
    if (element.hasAttribute("data-webmention-hide")) {
      element.style.display = hasMentions ? "none" : "";
    }

    // Handle data-webmention-text (different text based on count)
    if (element.hasAttribute("data-webmention-text")) {
      const textConfig = element.dataset.webmentionText;
      // Format: "none text|single text|plural text" or just check for pipe
      if (textConfig.includes("|")) {
        const parts = textConfig.split("|");
        if (mentions.length === 0) {
          element.textContent = parts[0] || "";
        } else if (mentions.length === 1) {
          element.textContent = parts[1] || parts[0] || "";
        } else {
          element.textContent = parts[2] || parts[1] || parts[0] || "";
        }
      }
    }
  }
}

// Create global instance
window.WebmentionUtils = new WebmentionUtils();

// Auto-initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.WebmentionUtils.autoInit();
  });
} else {
  window.WebmentionUtils.autoInit();
}

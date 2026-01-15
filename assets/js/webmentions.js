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
   * Auto-initialize elements with data-webmention-list attribute
   */
  autoInit() {
    const elements = document.querySelectorAll("[data-webmention-list]");

    elements.forEach(async (element) => {
      const targetUrl =
        element.dataset.webmentionList || window.location.href;
      const mentions = await this.fetch(targetUrl);
      element.innerHTML = this.asCommaSeparatedList(mentions);
    });
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

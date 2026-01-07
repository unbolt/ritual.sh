// Last.fm Stats Interactive Module
(function () {
  "use strict";

  const LASTFM_API_URL = "https://ws.audioscrobbler.com/2.0/";
  const LASTFM_API_KEY = "3a4fef48fecc593d25e0f9a40df1fefe";

  // Store current stats for export
  let currentStats = {
    artists: [],
    totalTracks: 0,
    period: "",
    username: "",
  };

  // Calculate timestamps based on period
  function getTimestamps(period) {
    const now = Math.floor(Date.now() / 1000);
    let from;

    if (period === "7day") {
      from = now - 7 * 24 * 60 * 60; // 7 days
    } else if (period === "1month") {
      from = now - 30 * 24 * 60 * 60; // 30 days
    }

    return { from, to: now };
  }

  // Fetch top artists for the specified period
  async function fetchTopArtists(username, period) {
    const url = `${LASTFM_API_URL}?method=user.gettopartists&user=${username}&api_key=${LASTFM_API_KEY}&format=json&period=${period}&limit=5`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch top artists: ${response.statusText}`);
    }

    const data = await response.json();

    // Check for Last.fm API errors
    if (data.error) {
      throw new Error(data.message || "Last.fm API error");
    }

    return data.topartists?.artist || [];
  }

  // Fetch recent tracks to count total scrobbles in period
  async function fetchTrackCount(username, period) {
    const { from, to } = getTimestamps(period);
    const url = `${LASTFM_API_URL}?method=user.getrecenttracks&user=${username}&api_key=${LASTFM_API_KEY}&format=json&from=${from}&to=${to}&limit=1`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch track count: ${response.statusText}`);
    }

    const data = await response.json();

    // Check for Last.fm API errors
    if (data.error) {
      throw new Error(data.message || "Last.fm API error");
    }

    return data.recenttracks?.["@attr"]?.total || 0;
  }

  // Generate markdown format
  function generateMarkdown() {
    const periodText =
      currentStats.period === "7day" ? "Past Week" : "Past Month";
    let markdown = `## Last.fm Stats - ${periodText}\n\n`;
    markdown += `**Total Tracks:** ${currentStats.totalTracks}\n\n`;
    markdown += `**Top 5 Artists:**\n\n`;

    currentStats.artists.forEach((artist) => {
      markdown += `- [${artist.name}](${artist.url}) - ${artist.playcount} plays\n`;
    });

    return markdown;
  }

  // Generate plain text format
  function generatePlainText() {
    const periodText =
      currentStats.period === "7day" ? "Past Week" : "Past Month";
    let text = `Last.fm Stats - ${periodText}\n\n`;
    text += `Total Tracks: ${currentStats.totalTracks}\n\n`;
    text += `Top 5 Artists:\n\n`;

    currentStats.artists.forEach((artist) => {
      text += `- ${artist.name} - ${artist.playcount} plays\n`;
    });

    return text;
  }

  // Copy to clipboard
  async function copyToClipboard(text, button) {
    try {
      await navigator.clipboard.writeText(text);
      const originalText = button.textContent;
      button.textContent = "Copied!";
      button.classList.add("copied");

      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove("copied");
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Failed to copy to clipboard");
    }
  }

  // Display the stats
  function displayStats(artists, totalTracks, period, username) {
    const artistsList = document.getElementById("top-artists");
    const totalTracksEl = document.getElementById("total-tracks");

    // Store current stats for export
    currentStats = { artists, totalTracks, period, username };

    // Update total tracks
    totalTracksEl.textContent = totalTracks;

    // Clear and populate artists list
    artistsList.innerHTML = "";

    if (artists.length === 0) {
      artistsList.innerHTML = "<li>No artists found for this period</li>";
      return;
    }

    artists.forEach((artist) => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="${artist.url}" target="_blank">${artist.name}</a> - ${artist.playcount} plays`;
      artistsList.appendChild(li);
    });

    // Show export buttons
    const exportButtons = document.getElementById("export-buttons");
    if (exportButtons) {
      exportButtons.style.display = "flex";
    }
  }

  // Show/hide UI elements
  function setLoadingState(isLoading) {
    const loading = document.getElementById("stats-loading");
    const content = document.getElementById("stats-content");
    const error = document.getElementById("stats-error");
    const results = document.getElementById("stats-results");

    results.style.display = "block";

    if (isLoading) {
      loading.style.display = "block";
      content.style.display = "none";
      error.style.display = "none";
    } else {
      loading.style.display = "none";
    }
  }

  function showError(message) {
    const error = document.getElementById("stats-error");
    const errorMessage = document.getElementById("error-message");
    const content = document.getElementById("stats-content");

    error.style.display = "block";
    content.style.display = "none";
    errorMessage.textContent = message;
  }

  function showContent() {
    const error = document.getElementById("stats-error");
    const content = document.getElementById("stats-content");

    error.style.display = "none";
    content.style.display = "block";
  }

  // Main fetch function
  async function fetchStats() {
    const username = document.getElementById("lastfm-username").value.trim();
    const period = document.getElementById("time-period").value;

    if (!username) {
      showError("Please enter a Last.fm username");
      return;
    }

    setLoadingState(true);

    try {
      // Fetch both stats in parallel
      const [artists, totalTracks] = await Promise.all([
        fetchTopArtists(username, period),
        fetchTrackCount(username, period),
      ]);

      displayStats(artists, totalTracks, period, username);
      showContent();
    } catch (error) {
      console.error("Error fetching Last.fm stats:", error);
      showError(
        error.message ||
          "Failed to fetch stats. Please check the username and try again.",
      );
    } finally {
      setLoadingState(false);
    }
  }

  // Initialize when DOM is ready
  function init() {
    const fetchButton = document.getElementById("fetch-stats");
    const usernameInput = document.getElementById("lastfm-username");
    const copyMarkdownBtn = document.getElementById("copy-markdown");
    const copyPlainTextBtn = document.getElementById("copy-plaintext");

    if (!fetchButton || !usernameInput) {
      return; // Not on the stats page
    }

    // Fetch stats on button click
    fetchButton.addEventListener("click", fetchStats);

    // Also fetch on Enter key in username input
    usernameInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        fetchStats();
      }
    });

    // Copy buttons
    if (copyMarkdownBtn) {
      copyMarkdownBtn.addEventListener("click", () => {
        const markdown = generateMarkdown();
        copyToClipboard(markdown, copyMarkdownBtn);
      });
    }

    if (copyPlainTextBtn) {
      copyPlainTextBtn.addEventListener("click", () => {
        const plainText = generatePlainText();
        copyToClipboard(plainText, copyPlainTextBtn);
      });
    }
  }

  // Run init when DOM is loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

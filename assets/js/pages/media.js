// Matrix Rain Background Effect
function initMatrixRain() {
  const canvas = document.getElementById("matrix-bg");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  // Set canvas size to window size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Characters to use in the matrix effect
  const chars = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ01";
  const charArray = chars.split("");

  const fontSize = 14;
  const columns = Math.floor(canvas.width / fontSize);

  // Array to track y position of each column
  const drops = Array(columns).fill(1);

  // Array to store random max heights for each column (within top 50%)
  const maxHeights = Array(columns)
    .fill(0)
    .map(() => Math.random() * (canvas.height * 0.5));

  // Color options - muted pink and blue
  const colors = [
    "rgba(255, 0, 255, 0.15)", // Muted magenta/pink
    "rgba(0, 255, 255, 0.15)", // Muted cyan/blue
  ];

  function draw() {
    // Semi-transparent black to create fade effect
    ctx.fillStyle = "rgba(13, 13, 13, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = fontSize + "px monospace";

    // Draw characters
    for (let i = 0; i < drops.length; i++) {
      // Only draw if the drop hasn't reached its max height
      if (drops[i] * fontSize < maxHeights[i]) {
        // Randomly choose between pink and blue
        const color = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillStyle = color;

        // Random character
        const char = charArray[Math.floor(Math.random() * charArray.length)];

        // Draw character
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        // Move drop down
        drops[i]++;
      } else {
        // Reset drop randomly to start a new stream
        if (Math.random() > 0.99) {
          drops[i] = 0;
          // Assign new random max height within top 50%
          maxHeights[i] = Math.random() * (canvas.height * 0.5);
        }
      }
    }
  }

  // Start animation
  setInterval(draw, 50);

  // Handle window resize
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const newColumns = Math.floor(canvas.width / fontSize);
    drops.length = newColumns;
    drops.fill(1);
    // Regenerate max heights for new canvas size
    maxHeights.length = newColumns;
    for (let i = 0; i < newColumns; i++) {
      maxHeights[i] = Math.random() * (canvas.height * 0.5);
    }
  });
}

// Last.fm API configuration
const LASTFM_API_URL = "https://ws.audioscrobbler.com/2.0/";
const LASTFM_USER = "ritualplays";
const LASTFM_API_KEY = "3a4fef48fecc593d25e0f9a40df1fefe";
const TRACK_LIMIT = 10;

// Format time difference
function getTimeAgo(timestamp) {
  const now = Date.now() / 1000;
  const diff = now - timestamp;

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return `${Math.floor(diff / 604800)}w ago`;
}

// Fetch recent tracks from Last.fm
async function fetchRecentTracks() {
  const url = `${LASTFM_API_URL}?method=user.getrecenttracks&user=${LASTFM_USER}&api_key=${LASTFM_API_KEY}&format=json&limit=${TRACK_LIMIT}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch tracks");

    const data = await response.json();
    return data.recenttracks.track;
  } catch (error) {
    console.error("Error fetching Last.fm data:", error);
    return null;
  }
}

// Render tracks to the DOM
function renderTracks(tracks) {
  const container = document.getElementById("lastfm-tracks");
  if (!container) return;

  if (!tracks || tracks.length === 0) {
    container.innerHTML =
      '<div class="lastfm-loading">No recent tracks found</div>';
    return;
  }

  container.innerHTML = "";

  tracks.forEach((track) => {
    const isNowPlaying = track["@attr"] && track["@attr"].nowplaying;
    const trackElement = document.createElement("a");
    trackElement.href = track.url;
    trackElement.target = "_blank";
    trackElement.rel = "noopener noreferrer";
    trackElement.className = `lastfm-track ${isNowPlaying ? "now-playing" : ""}`;

    // Get album art (use largest available)
    const albumArt = track.image[3]["#text"];
    const hasArt = albumArt && albumArt.trim() !== "";

    // Get timestamp
    const timestamp = track.date ? track.date.uts : null;
    const timeAgo = timestamp ? getTimeAgo(timestamp) : "";

    trackElement.innerHTML = `
      <div class="track-art ${!hasArt ? "no-art" : ""}">
        ${hasArt ? `<img src="${albumArt}" alt="${track.name}" loading="lazy">` : ""}
      </div>
      <div class="track-info">
        <div class="track-name">${track.name}</div>
        <div class="track-artist">${track.artist["#text"]}</div>
        ${!isNowPlaying && timeAgo ? `<div class="track-date">${timeAgo}</div>` : ""}
      </div>
    `;

    container.appendChild(trackElement);
  });
}

// Initialize Last.fm feed
async function initLastFmFeed() {
  const tracks = await fetchRecentTracks();
  renderTracks(tracks);

  // Update every 30 seconds
  setInterval(async () => {
    const updatedTracks = await fetchRecentTracks();
    renderTracks(updatedTracks);
  }, 30000);
}

// Initialize everything when DOM is ready
function init() {
  initMatrixRain();
  initLastFmFeed();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

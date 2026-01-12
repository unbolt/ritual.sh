if (document.getElementById("starfield")) {
  let starfield = document.getElementById("starfield");
  let numStars = parseInt(starfield.dataset.stars) || 200;

  // Create static twinkling stars
  for (let i = 0; i < numStars; i++) {
    const star = document.createElement("div");
    star.className = "star";
    // Random size
    const sizeClass =
      Math.random() < 0.7 ? "small" : Math.random() < 0.9 ? "medium" : "large";
    star.classList.add(sizeClass);
    // Random position
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    // Random animation duration (2-6 seconds) and delay
    star.style.animationDuration = 2 + Math.random() * 4 + "s";
    star.style.animationDelay = Math.random() * 5 + "s";
    starfield.appendChild(star);
  }
}

(function () {
  const container = document.querySelector(".record-shelf-container");

  // Exit if the record shelf doesn't exist on this page
  if (!container) {
    return;
  }

  const recordSlots = container.querySelectorAll(".record-slot");
  const albumContents = container.querySelectorAll(".album-content");

  // Exit if we don't have the necessary elements
  if (!recordSlots.length || !albumContents.length) {
    return;
  }

  // Set first album as active by default
  const firstSlot = recordSlots[0];
  if (firstSlot) {
    const firstSleeve = firstSlot.querySelector(".record-sleeve");
    if (firstSleeve) {
      firstSleeve.classList.add("active");
    }
  }

  recordSlots.forEach((slot) => {
    slot.addEventListener("click", function (e) {
      e.preventDefault();
      const index = this.getAttribute("data-album-index");

      // Hide all content
      albumContents.forEach((content) => (content.style.display = "none"));

      // Show selected content
      const selectedContent = container.querySelector(
        `[data-content-index="${index}"]`,
      );
      if (selectedContent) {
        selectedContent.style.display = "block";
      }

      // Remove active class from all sleeves
      recordSlots.forEach((s) => {
        const sleeve = s.querySelector(".record-sleeve");
        if (sleeve) {
          sleeve.classList.remove("active");
        }
      });

      // Add active class to clicked sleeve
      const clickedSleeve = this.querySelector(".record-sleeve");
      if (clickedSleeve) {
        clickedSleeve.classList.add("active");
      }
    });
  });
})();

// Audio page Last.fm integration (separate from media page)
(function() {
  const container = document.getElementById("recent-tracks");
  if (!container) return;

  const AUDIO_TRACK_LIMIT = 6; // Fetch 6 to have enough after filtering

  // Render recent tracks for audio page (horizontal layout)
  function renderRecentTracks(tracks) {
    if (!tracks || tracks.length === 0) {
      container.innerHTML =
        '<div class="track-loading">No recent tracks found</div>';
      return;
    }

    container.innerHTML = "";

    // Filter and limit tracks to 5 (excluding duplicates)
    const tracksToShow = LastFmUtils.filterAndLimitTracks(tracks, 5);

    tracksToShow.forEach((track) => {
      const isNowPlaying = track["@attr"] && track["@attr"].nowplaying;
      const trackElement = document.createElement("a");
      trackElement.href = track.url;
      trackElement.target = "_blank";
      trackElement.rel = "noopener noreferrer";
      trackElement.className = `recent-track ${isNowPlaying ? "now-playing" : ""}`;

      // Get album art (use largest available)
      const albumArt = track.image[3]["#text"];
      const hasArt = albumArt && albumArt.trim() !== "";

      trackElement.innerHTML = `
        <div class="track-cover ${!hasArt ? "no-art" : ""}">
          ${hasArt ? `<img src="${albumArt}" alt="${track.name}" loading="lazy">` : '<div class="cover-placeholder">♪</div>'}
        </div>
        <div class="track-details">
          <div class="track-title">${track.name}</div>
          <div class="track-artist">${track.artist["#text"]}</div>
        </div>
      `;

      container.appendChild(trackElement);
    });
  }

  // Initialize Last.fm feed for audio page
  async function initAudioRecentTracks() {
    const tracks = await LastFmUtils.fetchRecentTracks(AUDIO_TRACK_LIMIT);
    renderRecentTracks(tracks);

    // Update every 30 seconds
    setInterval(async () => {
      const updatedTracks = await LastFmUtils.fetchRecentTracks(AUDIO_TRACK_LIMIT);
      renderRecentTracks(updatedTracks);
    }, 30000);
  }

  // Initialize recent tracks when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAudioRecentTracks);
  } else {
    initAudioRecentTracks();
  }
})();

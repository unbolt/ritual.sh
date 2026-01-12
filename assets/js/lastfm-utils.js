// Shared Last.fm utilities - using global namespace pattern
(function(window) {
  'use strict';

  // Create global LastFmUtils namespace
  window.LastFmUtils = {
    // Last.fm API configuration
    LASTFM_API_URL: "https://ws.audioscrobbler.com/2.0/",
    LASTFM_USER: "ritualplays",
    LASTFM_API_KEY: "3a4fef48fecc593d25e0f9a40df1fefe",

    // Format time difference
    getTimeAgo: function(timestamp) {
      const now = Date.now() / 1000;
      const diff = now - timestamp;

      if (diff < 60) return "Just now";
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
      return `${Math.floor(diff / 604800)}w ago`;
    },

    // Fetch recent tracks from Last.fm
    fetchRecentTracks: async function(limit = 10) {
      const url = `${this.LASTFM_API_URL}?method=user.getrecenttracks&user=${this.LASTFM_USER}&api_key=${this.LASTFM_API_KEY}&format=json&limit=${limit}`;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch tracks");

        const data = await response.json();
        return data.recenttracks.track;
      } catch (error) {
        console.error("Error fetching Last.fm data:", error);
        return null;
      }
    },

    // Filter tracks to remove duplicates of now playing track
    // Returns a limited number of unique tracks
    filterAndLimitTracks: function(tracks, maxTracks = 5) {
      if (!tracks || tracks.length === 0) {
        return [];
      }

      // Check if first track is now playing
      const hasNowPlaying = tracks[0] && tracks[0]["@attr"] && tracks[0]["@attr"].nowplaying;

      if (hasNowPlaying) {
        // Show now playing + (maxTracks - 1) latest (excluding duplicates of now playing)
        const nowPlayingTrack = tracks[0];
        const nowPlayingId = `${nowPlayingTrack.name}-${nowPlayingTrack.artist["#text"]}`;

        // Get remaining tracks, excluding duplicates of now playing
        const remainingTracks = tracks.slice(1).filter(track => {
          const trackId = `${track.name}-${track.artist["#text"]}`;
          return trackId !== nowPlayingId;
        });

        return [nowPlayingTrack, ...remainingTracks.slice(0, maxTracks - 1)];
      } else {
        // No now playing, show maxTracks latest
        return tracks.slice(0, maxTracks);
      }
    }
  };
})(window);

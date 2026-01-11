// CRT Log Screen with Analytics
// This script updates the CRT screen with a mix of fake logs and real visitor stats

function initCRTLogs() {
  const crtScreen = document.getElementById('crt-logs');

  if (!crtScreen) {
    return;
  }

  const fakeLogs = [
    '[WARN] High load detected - time for coffee break',
    '[ERROR] 404: Motivation not found',
    '[WARN] Firewall detected actual fire.',
    '[ERROR] Keyboard not found. Press F1 to continue.',
  ];

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  function updateCRTScreen(stats) {
    const logs = [];

    // Add initial command
    logs.push('> tail -f /var/log');

    // Mix fake logs with real stats
    const totalLogs = 10;
    const statsPositions = [3, 6, 9]; // Insert stats at these positions

    let fakeLogIndex = 0;

    for (let i = 0; i < totalLogs; i++) {
      if (statsPositions.includes(i) && stats) {
        // Insert real stats
        if (i === 3) {
          logs.push(`[STATS] Total visitors: ${stats.totalHits.toLocaleString()}`);
        } else if (i === 6) {
          logs.push(`[STATS] Unique visitors: ${stats.uniqueVisitors.toLocaleString()}`);
        } else if (i === 9 && stats.lastUpdated) {
          logs.push(`[STATS] Last updated: ${formatDate(stats.lastUpdated)}`);
        }
      } else {
        // Insert fake log
        logs.push(fakeLogs[fakeLogIndex % fakeLogs.length]);
        fakeLogIndex++;
      }
    }

    // Animate logs appearing one by one
    crtScreen.innerHTML = '> tail -f /var/log<br>\n<span class="cursor-blink">_</span>';

    let currentIndex = 0;
    const lineDelay = 150; // milliseconds between each line

    function addNextLine() {
      if (currentIndex < logs.length - 1) { // -1 to skip the initial command we already added
        const displayedLogs = logs.slice(1, currentIndex + 2); // Skip initial command, add lines progressively
        crtScreen.innerHTML = logs[0] + '<br>\n' + displayedLogs.join('<br>\n') + '<br>\n<span class="cursor-blink">_</span>';
        currentIndex++;
        setTimeout(addNextLine, lineDelay);
      } else {
        // Final update with cursor
        crtScreen.innerHTML = logs.join('<br>\n') + '<br>\n<span class="cursor-blink">_</span>';
      }
    }

    setTimeout(addNextLine, lineDelay);
  }

  function fetchAnalyticsStats() {
    fetch('https://api.ritual.sh/analytics/stats')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        return response.json();
      })
      .then(stats => {
        updateCRTScreen(stats);
      })
      .catch(err => {
        // Silently fail and show fake logs only
        console.debug('Failed to load analytics stats:', err);
        updateCRTScreen(null);
      });
  }

  // Initial load
  fetchAnalyticsStats();

  // Refresh stats every 30 seconds
  setInterval(fetchAnalyticsStats, 30000);
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCRTLogs);
} else {
  // DOM already loaded
  initCRTLogs();
}

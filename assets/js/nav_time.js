// Time display with glitch effect
(function () {
  const timeDisplay = document.querySelector(".time-display");
  if (!timeDisplay) return;

  const lcdText = timeDisplay.querySelector(".lcd-text");
  if (!lcdText) return;

  let isHovered = false;
  let timeInterval;

  // Format time as hh:mm:ss
  function getFormattedTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }

  // Update time display
  function updateTime() {
    if (!isHovered) {
      lcdText.textContent = getFormattedTime();
    }
  }

  // Glitch characters for effect
  const glitchChars = [
    "█",
    "▓",
    "▒",
    "░",
    "▀",
    "▄",
    "▌",
    "▐",
    "■",
    "□",
    "▪",
    "▫",
    "_",
    "-",
    "|",
  ];

  // Create glitch effect
  function glitchEffect(callback) {
    let glitchCount = 0;
    const maxGlitches = 5;

    const glitchInterval = setInterval(() => {
      // Generate random glitchy text
      const glitchText = Array(8)
        .fill(0)
        .map(() => glitchChars[Math.floor(Math.random() * glitchChars.length)])
        .join("");

      lcdText.textContent = glitchText;
      glitchCount++;

      if (glitchCount >= maxGlitches) {
        clearInterval(glitchInterval);
        lcdText.textContent = "_N:OW:__";
        if (callback) callback();
      }
    }, 50);
  }

  // Mouse over handler
  timeDisplay.addEventListener("mouseenter", () => {
    isHovered = true;
    glitchEffect();
  });

  // Mouse out handler
  timeDisplay.addEventListener("mouseleave", () => {
    isHovered = false;
    updateTime();
  });

  // Start time updates
  updateTime();
  timeInterval = setInterval(updateTime, 1000);
})();

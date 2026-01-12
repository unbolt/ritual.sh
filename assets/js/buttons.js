// Randomize button positions on the laptop lid
function initializeButtons() {
  const buttons = document.querySelectorAll(".button-sticker");
  const laptopLid = document.getElementById("laptop-lid");

  if (!laptopLid) return;

  // Account for CSS padding (20px) and bezel border (15px)
  const lidPadding = 20;
  const bezelBorder = 15;
  const totalInset = lidPadding + bezelBorder;
  const displayAreaWidth = laptopLid.offsetWidth - totalInset * 2;
  const displayAreaHeight = laptopLid.offsetHeight - totalInset * 2;

  buttons.forEach((button) => {
    // Get button dimensions - use data attributes as fallback
    const buttonWidth = button.offsetWidth || 88;
    const buttonHeight = button.offsetHeight || 31;

    // Generate random position within display area bounds
    const maxX = Math.max(0, displayAreaWidth - buttonWidth);
    const maxY = Math.max(0, displayAreaHeight - buttonHeight);

    const randomX = Math.random() * maxX + totalInset;
    const randomY = Math.random() * maxY + totalInset;
    const randomRotation = (Math.random() - 0.5) * 40;

    // Set CSS custom properties for positioning and rotation
    button.style.setProperty("--x", randomX + "px");
    button.style.setProperty("--y", randomY + "px");
    button.style.setProperty("--rotation", randomRotation + "deg");
  });
}

// Initialize on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeButtons);
} else {
  // DOM already loaded
  initializeButtons();
}

// Re-randomize on window resize
window.addEventListener("resize", () => {
  // Add small delay to ensure measurements are accurate
  setTimeout(() => {
    initializeButtons();
  }, 100);
});

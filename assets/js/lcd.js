function fitTextToContainer() {
  // Find all LCD containers
  const lcdContainers = document.querySelectorAll(".lcd-container");

  lcdContainers.forEach((container) => {
    container.style.opacity = 0;

    const lcdText = container.querySelector(".lcd-text");
    const lcdScreen = container.querySelector(".lcd-screen");

    if (!lcdText || !lcdScreen) return;

    // Get the computed style to access padding
    const screenStyle = window.getComputedStyle(lcdScreen);
    const paddingLeft = parseFloat(screenStyle.paddingLeft);
    const paddingRight = parseFloat(screenStyle.paddingRight);

    // Calculate available width
    const availableWidth = lcdScreen.clientWidth - paddingLeft - paddingRight;

    lcdText.style.fontSize = "";
    let fontSize = parseFloat(window.getComputedStyle(lcdText).fontSize);
    const maxFontSize = fontSize;
    const minFontSize = 10;

    // Reduce font size until it fits
    while (lcdText.scrollWidth > availableWidth && fontSize > minFontSize) {
      fontSize -= 0.5;
      lcdText.style.fontSize = `${fontSize}px`;
    }

    container.style.opacity = 1;
  });
}

function applyRandomRotation() {
  if (!document.querySelector(".random-rotation")) return;

  console.log("Adding rotation...");

  const containers = document.querySelectorAll(
    ".random-rotation .lcd-container",
  );
  containers.forEach((container) => {
    const rotation = (Math.random() - 0.5) * 2;
    container.style.transform = `rotate(${rotation}deg)`;
  });
}

window.addEventListener("load", fitTextToContainer);
window.addEventListener("resize", fitTextToContainer);
window.addEventListener("load", applyRandomRotation);

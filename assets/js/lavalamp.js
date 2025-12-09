(function () {
  const blobsContainer = document.querySelector(".blobs-container"); // Changed from lavaLamp
  const lavaLamp = document.getElementById("lavaLamp");
  let blobs = [];
  let baseSpeed = 0.8;

  function createBlob() {
    const blob = document.createElement("div");
    blob.className = "blob";

    // Get container dimensions from lavaLamp
    const containerWidth = lavaLamp.offsetWidth;
    const containerHeight = lavaLamp.offsetHeight;

    // Size relative to container width (25-50% of width)
    const size = (Math.random() * 0.15 + 0.25) * containerWidth;

    const duration = (Math.random() * 8 + 12) / baseSpeed;

    // Max X position accounting for blob size
    const maxX = containerWidth - size;
    const startX = Math.random() * maxX;

    blob.style.width = `${size}px`;
    blob.style.height = `${size}px`;
    blob.style.left = `${startX}px`;
    blob.style.bottom = "10px";
    blob.style.position = "absolute";

    blob.style.setProperty("--duration", `${duration}s`);

    // Start position (bottom of lamp)
    blob.style.setProperty("--start-x", "0px");
    blob.style.setProperty("--start-y", "0px");

    // Movement waypoints (moving upward - negative Y values)
    blob.style.setProperty(
      "--mid1-x",
      `${(Math.random() * 0.3 - 0.15) * containerWidth}px`,
    );
    blob.style.setProperty(
      "--mid1-y",
      `${-(Math.random() * 0.15 + 0.25) * containerHeight}px`,
    );

    blob.style.setProperty(
      "--mid2-x",
      `${(Math.random() * 0.4 - 0.2) * containerWidth}px`,
    );
    blob.style.setProperty(
      "--mid2-y",
      `${-(Math.random() * 0.2 + 0.5) * containerHeight}px`,
    );

    blob.style.setProperty(
      "--mid3-x",
      `${(Math.random() * 0.3 - 0.15) * containerWidth}px`,
    );
    blob.style.setProperty(
      "--mid3-y",
      `${-(Math.random() * 0.15 + 0.8) * containerHeight}px`,
    );

    // Scale variations
    blob.style.setProperty("--scale1", (Math.random() * 0.3 + 1.0).toFixed(2));
    blob.style.setProperty("--scale2", (Math.random() * 0.3 + 0.85).toFixed(2));
    blob.style.setProperty("--scale3", (Math.random() * 0.3 + 0.95).toFixed(2));

    // Random delay to stagger animations
    blob.style.animationDelay = `${Math.random() * -20}s`;

    return blob;
  }

  function updateLampBackground() {
    const bg1 = "#F8E45C";
    const bg2 = "#FF7800";
    lavaLamp.style.background = `linear-gradient(180deg, ${bg1} 0%, ${bg2} 100%)`;
  }

  function updateBlobCount() {
    const count = parseInt(6);
    while (blobs.length > count) {
      const blob = blobs.pop();
      blobsContainer.removeChild(blob); // Changed
    }
    while (blobs.length < count) {
      const blob = createBlob();
      blobs.push(blob);
      blobsContainer.appendChild(blob); // Changed
    }
  }

  function init() {
    if (document.getElementById("lavaLamp")) {
      updateBlobCount();
      updateLampBackground();
    }
  }

  init();
})();

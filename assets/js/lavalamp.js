(function () {
  const lavaLamp = document.getElementById("lavaLamp");
  let blobs = [];
  let baseSpeed = 0.8;

  function createBlob() {
    const blob = document.createElement("div");
    blob.className = "blob";
    const size = Math.random() * 30 + 20; // Smaller blobs (20-50px)
    const startY = Math.random() * 100; // Within ~150px height
    const duration = (Math.random() * 8 + 12) / baseSpeed;
    const maxX = 60 - size; // Adjusted for narrower tube (80px wide)
    const startX = Math.random() * maxX;

    blob.style.width = `${size}px`;
    blob.style.height = `${size}px`;
    blob.style.left = `${startX}px`;
    blob.style.setProperty("--duration", `${duration}s`);
    blob.style.setProperty("--start-x", "0px");
    blob.style.setProperty("--start-y", `${startY}px`);
    blob.style.setProperty("--mid1-x", `${Math.random() * 15 - 15}px`);
    blob.style.setProperty("--mid1-y", `${Math.random() * -40 - 40}px`);
    blob.style.setProperty("--mid2-x", `${Math.random() * 20 - 20}px`);
    blob.style.setProperty("--mid2-y", `${Math.random() * -80 - 40}px`);
    blob.style.setProperty("--mid3-x", `${Math.random() * 15 - 15}px`);
    blob.style.setProperty("--mid3-y", `${Math.random() * -60 - 10}px`);
    blob.style.setProperty("--scale1", (Math.random() * 0.3 + 1.0).toFixed(2));
    blob.style.setProperty("--scale2", (Math.random() * 0.3 + 0.85).toFixed(2));
    blob.style.setProperty("--scale3", (Math.random() * 0.3 + 0.95).toFixed(2));
    blob.style.animationDelay = `${Math.random() * -20}s`;

    return blob;
  }

  function updateBlobColors() {
    const color1 = "#FF7800";
    const color2 = "#E01B24";
    const gradient = `radial-gradient(circle at 30% 30%, ${color1}, ${color2})`;
    blobs.forEach((blob) => {
      blob.style.background = gradient;
    });
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
      lavaLamp.removeChild(blob);
    }
    while (blobs.length < count) {
      const blob = createBlob();
      blobs.push(blob);
      lavaLamp.appendChild(blob);
      updateBlobColors();
    }
  }

  function init() {
    updateBlobCount();
    updateLampBackground();
  }

  init();
})();

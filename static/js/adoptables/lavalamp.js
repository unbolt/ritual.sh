(function () {
  "use strict";

  const currentScript = document.currentScript;
  if (!currentScript) {
    console.error("Lava Lamp: Could not find current script tag");
    return;
  }

  // Read configuration from data attributes with defaults
  const config = {
    bgColor1: currentScript.dataset["bgColor-1"] || "#F8E45C",
    bgColor2: currentScript.dataset["bgColor-2"] || "#FF7800",
    blobColor1: currentScript.dataset["blobColor-1"] || "#FF4500",
    blobColor2: currentScript.dataset["blobColor-2"] || "#FF6347",
    caseColor: currentScript.dataset.caseColor || "#333333",
    blobCount: parseInt(currentScript.dataset.blobCount) || 6,
    speed: parseFloat(currentScript.dataset.speed) || 1.0,
    blobSize: parseFloat(currentScript.dataset.blobSize) || 1.0,
    pixelate: currentScript.dataset.pixelate === "true" || false,
    pixelSize: parseInt(currentScript.dataset.pixelSize) || 4,
  };

  // Helper function to adjust color brightness
  function adjustBrightness(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  }

  // Create a host element with shadow DOM for isolation
  const host = document.createElement("div");
  host.style.width = "100%";
  host.style.height = "100%";
  host.style.display = "block";

  if (config.pixelate) {
    host.style.overflow = "hidden";
  }

  // Attach shadow DOM
  const shadowRoot = host.attachShadow({ mode: "open" });

  currentScript.parentNode.insertBefore(host, currentScript.nextSibling);

  const gooFilterId = "goo-filter";

  // Inject CSS into shadow DOM
  const style = document.createElement("style");
  style.textContent = `
    .lavalamp-container {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      ${config.pixelate ? "filter: url(#pixelate-filter);" : ""}
    }

    .lamp-cap {
      width: 60%;
      height: 8%;
      flex-shrink: 0;
      border-radius: 50% 50% 0 0;
      box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.3);
      position: relative;
      z-index: 10;
    }

    .lamp-body {
      position: relative;
      width: 100%;
      flex: 1;
      clip-path: polygon(20% 0, 80% 0, 100% 101%, 0% 101%);
      overflow: hidden;
    }

    .lamp-body::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.15) 20%,
        rgba(255, 255, 255, 0.05) 40%,
        transparent 60%
      );
      pointer-events: none;
    }

    .blobs-container {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      filter: url(#${gooFilterId});
      pointer-events: none;
      z-index: 2;
    }

    .blob {
      position: absolute;
      border-radius: 50%;
      animation: lavalamp-float var(--duration) ease-in-out infinite;
      opacity: 0.95;
      mix-blend-mode: normal;
      z-index: 3;
    }

    .lamp-base {
      width: 100%;
      height: 15%;
      flex-shrink: 0;
      border-radius: 0 0 50% 50%;
      box-shadow:
        inset 0 2px 5px rgba(255, 255, 255, 0.2),
        inset 0 -2px 5px rgba(0, 0, 0, 0.5);
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    @keyframes lavalamp-float {
      0%, 100% {
        transform: translate(var(--start-x), var(--start-y)) scale(1);
      }
      25% {
        transform: translate(var(--mid1-x), var(--mid1-y)) scale(var(--scale1, 1.1));
      }
      50% {
        transform: translate(var(--mid2-x), var(--mid2-y)) scale(var(--scale2, 0.9));
      }
      75% {
        transform: translate(var(--mid3-x), var(--mid3-y)) scale(var(--scale3, 1.05));
      }
    }
  `;
  shadowRoot.appendChild(style);

  // Create the HTML structure
  const container = document.createElement("div");
  container.className = "lavalamp-container";

  // SVG filters for goo effect and pixelation
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.style.position = "absolute";
  svg.style.width = "0";
  svg.style.height = "0";
  svg.innerHTML = `
    <defs>
      <filter id="${gooFilterId}">
        <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
        <feColorMatrix
          in="blur"
          mode="matrix"
          values="
            1 0 0 0 0
            0 1 0 0 0
            0 0 1 0 0
            0 0 0 18 -7"
          result="goo"
        />
        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
      </filter>
      ${
        config.pixelate
          ? `
      <filter id="pixelate-filter" x="0%" y="0%" width="100%" height="100%">
        <feFlood x="0" y="0" height="1" width="1"/>
        <feComposite width="${config.pixelSize}" height="${config.pixelSize}"/>
        <feTile result="a"/>
        <feComposite in="SourceGraphic" in2="a" operator="in"/>
        <feMorphology operator="dilate" radius="${Math.floor(config.pixelSize / 2)}"/>
      </filter>
      `
          : ""
      }
    </defs>
  `;

  const lampCap = document.createElement("div");
  lampCap.className = "lamp-cap";
  lampCap.style.background = `linear-gradient(180deg, ${adjustBrightness(config.caseColor, 40)} 0%, ${config.caseColor} 50%, ${adjustBrightness(config.caseColor, -20)} 100%)`;

  const lampBody = document.createElement("div");
  lampBody.className = "lamp-body";
  lampBody.style.background = `linear-gradient(180deg, ${config.bgColor1} 0%, ${config.bgColor2} 100%)`;

  const blobsContainer = document.createElement("div");
  blobsContainer.className = "blobs-container";

  const lampBase = document.createElement("div");
  lampBase.className = "lamp-base";
  lampBase.style.background = `linear-gradient(180deg, ${config.caseColor} 0%, ${adjustBrightness(config.caseColor, -20)} 40%, ${adjustBrightness(config.caseColor, -40)} 100%)`;
  lampBase.style.borderTop = `1px solid ${adjustBrightness(config.bgColor2, -30)}`;

  // Assemble the structure
  lampBody.appendChild(blobsContainer);
  container.appendChild(svg);
  container.appendChild(lampCap);
  container.appendChild(lampBody);
  container.appendChild(lampBase);

  // Append to shadow DOM
  shadowRoot.appendChild(container);

  // Blob creation and animation
  let blobs = [];

  function createBlob() {
    const blob = document.createElement("div");
    blob.className = "blob";

    // Get container dimensions
    const containerWidth = lampBody.offsetWidth;
    const containerHeight = lampBody.offsetHeight;

    // Size relative to container width (25-40% of width)
    const size =
      (Math.random() * 0.15 + 0.25) * containerWidth * config.blobSize;
    const duration = (Math.random() * 8 + 12) / config.speed;

    // Max X position accounting for blob size and container margins
    const maxX = Math.max(0, containerWidth - size);
    const startX = maxX > 0 ? Math.random() * maxX : 0;

    // Create gradient for blob
    const blobGradient = `radial-gradient(circle at 30% 30%, ${config.blobColor1}, ${config.blobColor2})`;

    blob.style.width = `${size}px`;
    blob.style.height = `${size}px`;
    blob.style.left = `${startX}px`;
    blob.style.bottom = "10px";
    blob.style.position = "absolute";
    blob.style.background = blobGradient;
    blob.style.setProperty("--duration", `${duration}s`);
    blob.style.setProperty("--start-x", "0px");
    blob.style.setProperty("--start-y", "0px");

    // Movement waypoints
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

  function updateBlobCount() {
    while (blobs.length > config.blobCount) {
      const blob = blobs.pop();
      blobsContainer.removeChild(blob);
    }
    while (blobs.length < config.blobCount) {
      const blob = createBlob();
      blobs.push(blob);
      blobsContainer.appendChild(blob);
    }
  }

  // Initialize
  function init() {
    // Wait for container to have dimensions
    // Not sure  if this is a great idea, what if  this never happens for some reason
    // This is as good as  I can come up with  right now
    if (lampBody.offsetWidth === 0 || lampBody.offsetHeight === 0) {
      setTimeout(init, 100);
      return;
    }

    // Scale goo filter blur based on container width
    const containerWidth = lampBody.offsetWidth;

    // Apply scaled goo filter
    let blurAmount, alphaMultiplier, alphaBias;

    if (containerWidth < 80) {
      blurAmount = 3;
      alphaMultiplier = 12;
      alphaBias = -5;
    } else {
      blurAmount = Math.max(4, Math.min(7, containerWidth / 20));
      alphaMultiplier = 18;
      alphaBias = -7;
    }

    const gooFilter = svg.querySelector(`#${gooFilterId} feGaussianBlur`);
    if (gooFilter) {
      gooFilter.setAttribute("stdDeviation", blurAmount);
    }

    const colorMatrix = svg.querySelector(`#${gooFilterId} feColorMatrix`);
    if (colorMatrix) {
      colorMatrix.setAttribute(
        "values",
        `
          1 0 0 0 0
          0 1 0 0 0
          0 0 1 0 0
          0 0 0 ${alphaMultiplier} ${alphaBias}
        `,
      );
    }

    updateBlobCount();
  }

  // Start when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

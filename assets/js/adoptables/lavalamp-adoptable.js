(function () {
  "use strict";

  const previewContainers = {
    flex: document.getElementById("lavalamp-preview-flex"),
    small: document.getElementById("lavalamp-preview-100"),
    large: document.getElementById("lavalamp-preview-200"),
  };
  const bgColor1Input = document.getElementById("bg-color-1");
  const bgColor2Input = document.getElementById("bg-color-2");
  const blobColor1Input = document.getElementById("blob-color-1");
  const blobColor2Input = document.getElementById("blob-color-2");
  const caseColorInput = document.getElementById("case-color");
  const blobCountInput = document.getElementById("blob-count");
  const speedInput = document.getElementById("speed");
  const blobSizeInput = document.getElementById("blob-size");
  const pixelateInput = document.getElementById("pixelate");
  const pixelSizeInput = document.getElementById("pixel-size");
  const pixelSizeGroup = document.getElementById("pixel-size-group");
  const blobCountValue = document.getElementById("blob-count-value");
  const speedValue = document.getElementById("speed-value");
  const blobSizeValue = document.getElementById("blob-size-value");
  const pixelSizeValue = document.getElementById("pixel-size-value");
  const getCodeBtn = document.getElementById("get-code-btn");
  const embedCodeSection = document.getElementById("embed-code-section");
  const embedCodeDisplay = document.getElementById("embed-code-display");
  const copyCodeBtn = document.getElementById("copy-code-btn");
  const copyStatus = document.getElementById("copy-status");

  let lampInstances = {
    flex: { lampElements: {}, blobs: [] },
    small: { lampElements: {}, blobs: [] },
    large: { lampElements: {}, blobs: [] },
  };

  // Initialize the preview lamps
  function initPreview() {
    Object.keys(previewContainers).forEach((key, index) => {
      const previewContainer = previewContainers[key];
      const gooFilterId = `goo-preview-${key}`;

      // Create SVG filters
      const svg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
      );
      svg.style.position = "absolute";
      svg.style.width = "0";
      svg.style.height = "0";
      const pixelateFilterId = `pixelate-preview-${key}`;
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
          <filter id="${pixelateFilterId}" x="0%" y="0%" width="100%" height="100%">
            <feFlood x="0" y="0" height="1" width="1"/>
            <feComposite width="4" height="4" class="pixelate-composite"/>
            <feTile result="a"/>
            <feComposite in="SourceGraphic" in2="a" operator="in"/>
            <feMorphology operator="dilate" radius="2" class="pixelate-morphology"/>
          </filter>
        </defs>
      `;

      const container = document.createElement("div");
      container.className = "lavalamp-adoptable";
      container.style.width = "100%";
      container.style.height = "100%";

      const lampCap = document.createElement("div");
      lampCap.className = "lamp-cap";

      const lampBody = document.createElement("div");
      lampBody.className = "lamp-body";

      const blobsContainer = document.createElement("div");
      blobsContainer.className = "blobs-container";
      // Initially set the goo filter, will be adjusted after layout
      blobsContainer.style.filter = `url(#${gooFilterId})`;

      const lampBase = document.createElement("div");
      lampBase.className = "lamp-base";

      lampBody.appendChild(blobsContainer);
      container.appendChild(svg);
      container.appendChild(lampCap);
      container.appendChild(lampBody);
      container.appendChild(lampBase);
      previewContainer.appendChild(container);

      lampInstances[key].lampElements = {
        container,
        lampCap,
        lampBody,
        lampBase,
        blobsContainer,
        svg,
        pixelateFilterId,
      };
    });

    // Apply initial styles
    updatePreview();

    // Adjust goo filter for small lamps after layout
    adjustGooFilters();
  }

  // Adjust goo filters based on container width (matches embedded script logic)
  function adjustGooFilters() {
    Object.keys(lampInstances).forEach((key) => {
      const instance = lampInstances[key];
      const { lampElements } = instance;

      if (!lampElements.lampBody) return;

      const containerWidth = lampElements.lampBody.offsetWidth;
    });
  }

  // Create a blob element for a specific instance
  function createBlob(lampBody, lampHeight) {
    const blob = document.createElement("div");
    blob.className = "blob";

    const containerWidth = lampBody.offsetWidth;
    const containerHeight = lampHeight || lampBody.offsetHeight;

    const blobSizeMultiplier = parseFloat(blobSizeInput.value);
    const size =
      (Math.random() * 0.15 + 0.25) * containerWidth * blobSizeMultiplier;
    const duration = (Math.random() * 8 + 12) / parseFloat(speedInput.value);

    const maxX = containerWidth - size;
    const startX = Math.random() * maxX;

    blob.style.width = `${size}px`;
    blob.style.height = `${size}px`;
    blob.style.left = `${startX}px`;
    blob.style.bottom = "10px";
    blob.style.position = "absolute";

    blob.style.setProperty("--duration", `${duration}s`);
    blob.style.setProperty("--start-x", "0px");
    blob.style.setProperty("--start-y", "0px");
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
    blob.style.setProperty(
      "--scale1",
      (Math.random() * 0.3 + 1.0).toFixed(2),
    );
    blob.style.setProperty(
      "--scale2",
      (Math.random() * 0.3 + 0.85).toFixed(2),
    );
    blob.style.setProperty(
      "--scale3",
      (Math.random() * 0.3 + 0.95).toFixed(2),
    );
    blob.style.animationDelay = `${Math.random() * -20}s`;

    return blob;
  }

  // Update blob count for all instances
  function updateBlobCount() {
    const count = parseInt(blobCountInput.value);

    Object.keys(lampInstances).forEach((key) => {
      const instance = lampInstances[key];
      const { lampElements, blobs } = instance;

      if (!lampElements.blobsContainer) return;

      while (blobs.length > count) {
        const blob = blobs.pop();
        lampElements.blobsContainer.removeChild(blob);
      }
      while (blobs.length < count) {
        const blob = createBlob(lampElements.lampBody);
        updateBlobColors(blob);
        blobs.push(blob);
        lampElements.blobsContainer.appendChild(blob);
      }
    });
  }

  // Update blob colors
  function updateBlobColors(blob) {
    const color1 = blobColor1Input.value;
    const color2 = blobColor2Input.value;
    blob.style.background = `radial-gradient(circle at 30% 30%, ${color1}, ${color2})`;
  }

  // Adjust brightness helper
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

  // Update the preview for all instances
  function updatePreview() {
    Object.keys(lampInstances).forEach((key) => {
      const instance = lampInstances[key];
      const { lampElements, blobs } = instance;

      if (!lampElements.lampBody) return;

      // Update background gradient
      lampElements.lampBody.style.background = `linear-gradient(180deg, ${bgColor1Input.value} 0%, ${bgColor2Input.value} 100%)`;

      // Update cap and base color
      const baseColor = caseColorInput.value;
      lampElements.lampCap.style.background = `linear-gradient(180deg, ${adjustBrightness(baseColor, 40)} 0%, ${baseColor} 50%, ${adjustBrightness(baseColor, -20)} 100%)`;
      lampElements.lampBase.style.background = `linear-gradient(180deg, ${baseColor} 0%, ${adjustBrightness(baseColor, -20)} 40%, ${adjustBrightness(baseColor, -40)} 100%)`;
      lampElements.lampBase.style.borderTop = `1px solid ${adjustBrightness(bgColor2Input.value, -30)}`;

      // Update all blob colors
      blobs.forEach((blob) => updateBlobColors(blob));
    });

    // Update blob count
    updateBlobCount();
  }

  // Update pixelation filters for all instances
  function updatePixelation() {
    const isPixelated = pixelateInput.checked;
    const pixelSize = parseInt(pixelSizeInput.value);

    Object.keys(lampInstances).forEach((key) => {
      const instance = lampInstances[key];
      const { lampElements } = instance;

      if (isPixelated) {
        // Update the filter in the SVG
        const filter = lampElements.svg.querySelector(
          `#${lampElements.pixelateFilterId}`,
        );
        const composite = filter.querySelector("feComposite[width]");
        const morphology = filter.querySelector("feMorphology");

        composite.setAttribute("width", pixelSize);
        composite.setAttribute("height", pixelSize);
        morphology.setAttribute("radius", Math.floor(pixelSize / 2));

        // Apply filter to container
        lampElements.container.style.filter = `url(#${lampElements.pixelateFilterId})`;
      } else {
        // Remove filter
        lampElements.container.style.filter = "";
      }
    });
  }

  // Generate embed code
  function generateEmbedCode() {
    const siteUrl = window.location.origin;
    let pixelateAttrs = "";
    if (pixelateInput.checked) {
      pixelateAttrs = '\n        data-pixelate="true"';
      if (parseInt(pixelSizeInput.value) !== 4) {
        pixelateAttrs += `\n        data-pixel-size="${pixelSizeInput.value}"`;
      }
    }
    return `<script src="${siteUrl}/js/adoptables/lavalamp.js"
        data-bg-color-1="${bgColor1Input.value}"
        data-bg-color-2="${bgColor2Input.value}"
        data-blob-color-1="${blobColor1Input.value}"
        data-blob-color-2="${blobColor2Input.value}"
        data-case-color="${caseColorInput.value}"
        data-blob-count="${blobCountInput.value}"
        data-speed="${speedInput.value}"
        data-blob-size="${blobSizeInput.value}"${pixelateAttrs}><\/script>`;
  }

  // Event listeners
  bgColor1Input.addEventListener("input", updatePreview);
  bgColor2Input.addEventListener("input", updatePreview);
  blobColor1Input.addEventListener("input", updatePreview);
  blobColor2Input.addEventListener("input", updatePreview);
  caseColorInput.addEventListener("input", updatePreview);

  blobCountInput.addEventListener("input", function () {
    blobCountValue.textContent = this.value;
    updatePreview();
  });

  speedInput.addEventListener("input", function () {
    speedValue.textContent = parseFloat(this.value).toFixed(1);
    // Speed changes require recreating blobs for all instances
    Object.keys(lampInstances).forEach((key) => {
      const instance = lampInstances[key];
      instance.blobs.forEach((blob) =>
        instance.lampElements.blobsContainer.removeChild(blob),
      );
      instance.blobs = [];
    });
    updatePreview();
  });

  blobSizeInput.addEventListener("input", function () {
    blobSizeValue.textContent = parseFloat(this.value).toFixed(1);
    // Size changes require recreating blobs for all instances
    Object.keys(lampInstances).forEach((key) => {
      const instance = lampInstances[key];
      instance.blobs.forEach((blob) =>
        instance.lampElements.blobsContainer.removeChild(blob),
      );
      instance.blobs = [];
    });
    updatePreview();
  });

  pixelateInput.addEventListener("change", function () {
    // Show/hide pixel size slider
    if (this.checked) {
      pixelSizeGroup.style.display = "block";
    } else {
      pixelSizeGroup.style.display = "none";
    }
    updatePixelation();
  });

  pixelSizeInput.addEventListener("input", function () {
    pixelSizeValue.textContent = this.value;
    updatePixelation();
  });

  getCodeBtn.addEventListener("click", function () {
    embedCodeDisplay.textContent = generateEmbedCode();
    embedCodeSection.style.display = "block";
    embedCodeSection.scrollIntoView({ behavior: "smooth" });
  });

  // Initialize
  initPreview();
})();

(function () {
  const canvas = document.getElementById("button-canvas");
  const ctx = canvas.getContext("2d");

  // Preload all web fonts for canvas rendering
  const fonts = [
    "Lato",
    "Roboto",
    "Open Sans",
    "Montserrat",
    "Oswald",
    "Bebas Neue",
    "Roboto Mono",
    "VT323",
    "Press Start 2P",
    "DSEG7-Classic",
  ];

  // Load fonts using CSS Font Loading API
  const fontPromises = fonts.flatMap((font) => [
    document.fonts.load(`400 12px "${font}"`),
    document.fonts.load(`700 12px "${font}"`),
    document.fonts.load(`italic 400 12px "${font}"`),
  ]);

  Promise.all(fontPromises).then(() => {
    console.log("All fonts loaded for canvas");
    drawButton();
  });

  // Collapsible sections functionality
  document.querySelectorAll(".control-group-header").forEach((header) => {
    header.addEventListener("click", () => {
      const controlGroup = header.closest(".control-group");
      controlGroup.classList.toggle("collapsed");
    });
  });

  // Get all controls
  const controls = {
    text: document.getElementById("button-text"),
    textEnabled: document.getElementById("text-enabled"),
    fontSize: document.getElementById("font-size"),
    textX: document.getElementById("text-x"),
    textY: document.getElementById("text-y"),
    textColorType: document.getElementById("text-color-type"),
    textColor: document.getElementById("text-color"),
    textGradientColor1: document.getElementById("text-gradient-color1"),
    textGradientColor2: document.getElementById("text-gradient-color2"),
    textGradientAngle: document.getElementById("text-gradient-angle"),
    textOutline: document.getElementById("text-outline"),
    outlineColor: document.getElementById("outline-color"),
    fontFamily: document.getElementById("font-family"),
    fontBold: document.getElementById("font-bold"),
    fontItalic: document.getElementById("font-italic"),
    text2: document.getElementById("button-text2"),
    text2Enabled: document.getElementById("text2-enabled"),
    fontSize2: document.getElementById("font-size2"),
    text2X: document.getElementById("text2-x"),
    text2Y: document.getElementById("text2-y"),
    text2ColorType: document.getElementById("text2-color-type"),
    text2Color: document.getElementById("text2-color"),
    text2GradientColor1: document.getElementById("text2-gradient-color1"),
    text2GradientColor2: document.getElementById("text2-gradient-color2"),
    text2GradientAngle: document.getElementById("text2-gradient-angle"),
    text2Outline: document.getElementById("text2-outline"),
    outline2Color: document.getElementById("outline2-color"),
    fontFamily2: document.getElementById("font-family2"),
    fontBold2: document.getElementById("font-bold2"),
    fontItalic2: document.getElementById("font-italic2"),
    bgType: document.getElementById("bg-type"),
    bgColor: document.getElementById("bg-color"),
    gradientColor1: document.getElementById("gradient-color1"),
    gradientColor2: document.getElementById("gradient-color2"),
    gradientAngle: document.getElementById("gradient-angle"),
    textureType: document.getElementById("texture-type"),
    textureColor1: document.getElementById("texture-color1"),
    textureColor2: document.getElementById("texture-color2"),
    textureScale: document.getElementById("texture-scale"),
    borderWidth: document.getElementById("border-width"),
    borderColor: document.getElementById("border-color"),
    borderStyle: document.getElementById("border-style"),
  };

  // Update value displays
  const updateValueDisplay = (id, value) => {
    const display = document.getElementById(id + "-value");
    if (display) display.textContent = value;
  };

  // Show/hide controls based on background type
  controls.bgType.addEventListener("change", () => {
    const solidControls = document.getElementById("solid-controls");
    const gradientControls = document.getElementById("gradient-controls");
    const textureControls = document.getElementById("texture-controls");

    solidControls.style.display = "none";
    gradientControls.style.display = "none";
    textureControls.style.display = "none";

    if (controls.bgType.value === "solid") {
      solidControls.style.display = "block";
    } else if (controls.bgType.value === "gradient") {
      gradientControls.style.display = "block";
    } else if (controls.bgType.value === "texture") {
      textureControls.style.display = "block";
    }

    drawButton();
  });

  // Show/hide text color controls
  controls.textColorType.addEventListener("change", () => {
    const textSolidColor = document.getElementById("text-solid-color");
    const textGradientColor = document.getElementById("text-gradient-color");

    if (controls.textColorType.value === "solid") {
      textSolidColor.style.display = "block";
      textGradientColor.style.display = "none";
    } else {
      textSolidColor.style.display = "none";
      textGradientColor.style.display = "block";
    }
    drawButton();
  });

  controls.text2ColorType.addEventListener("change", () => {
    const text2SolidColor = document.getElementById("text2-solid-color");
    const text2GradientColor = document.getElementById("text2-gradient-color");

    if (controls.text2ColorType.value === "solid") {
      text2SolidColor.style.display = "block";
      text2GradientColor.style.display = "none";
    } else {
      text2SolidColor.style.display = "none";
      text2GradientColor.style.display = "block";
    }
    drawButton();
  });

  // Show/hide outline color
  controls.textOutline.addEventListener("change", () => {
    controls.outlineColor.style.display = controls.textOutline.checked
      ? "block"
      : "none";
    drawButton();
  });

  controls.text2Outline.addEventListener("change", () => {
    controls.outline2Color.style.display = controls.text2Outline.checked
      ? "block"
      : "none";
    drawButton();
  });

  // Draw texture patterns
  function drawTexture(type, color1, color2, scale) {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = 88;
    tempCanvas.height = 31;
    const tempCtx = tempCanvas.getContext("2d");

    tempCtx.fillStyle = color1;
    tempCtx.fillRect(0, 0, 88, 31);

    tempCtx.fillStyle = color2;
    const size = Math.max(2, Math.floor(scale / 10));

    switch (type) {
      case "dots":
        for (let y = 0; y < 31; y += size * 2) {
          for (let x = 0; x < 88; x += size * 2) {
            tempCtx.beginPath();
            tempCtx.arc(x, y, size / 2, 0, Math.PI * 2);
            tempCtx.fill();
          }
        }
        break;
      case "grid":
        for (let x = 0; x < 88; x += size) {
          tempCtx.fillRect(x, 0, 1, 31);
        }
        for (let y = 0; y < 31; y += size) {
          tempCtx.fillRect(0, y, 88, 1);
        }
        break;
      case "diagonal":
        for (let i = -31; i < 88; i += size) {
          tempCtx.fillRect(i, 0, 2, 31);
          tempCtx.save();
          tempCtx.translate(i + 1, 0);
          tempCtx.rotate(Math.PI / 4);
          tempCtx.fillRect(0, 0, 2, 100);
          tempCtx.restore();
        }
        break;
      case "checkerboard":
        for (let y = 0; y < 31; y += size) {
          for (let x = 0; x < 88; x += size) {
            if ((x / size + y / size) % 2 === 0) {
              tempCtx.fillRect(x, y, size, size);
            }
          }
        }
        break;
      case "noise":
        for (let y = 0; y < 31; y++) {
          for (let x = 0; x < 88; x++) {
            if (Math.random() > 0.5) {
              tempCtx.fillRect(x, y, 1, 1);
            }
          }
        }
        break;
      case "stars":
        for (let i = 0; i < scale; i++) {
          const x = Math.floor(Math.random() * 88);
          const y = Math.floor(Math.random() * 31);
          tempCtx.fillRect(x, y, 1, 1);
          tempCtx.fillRect(x - 1, y, 1, 1);
          tempCtx.fillRect(x + 1, y, 1, 1);
          tempCtx.fillRect(x, y - 1, 1, 1);
          tempCtx.fillRect(x, y + 1, 1, 1);
        }
        break;
    }

    return tempCanvas;
  }

  // Helper function to draw to a single context
  function drawToContext(context) {
    context.clearRect(0, 0, 88, 31);

    // Draw background
    if (controls.bgType.value === "solid") {
      context.fillStyle = controls.bgColor.value;
      context.fillRect(0, 0, 88, 31);
    } else if (controls.bgType.value === "gradient") {
      const angle = parseFloat(controls.gradientAngle.value) * (Math.PI / 180);
      const x1 = 44 + Math.cos(angle) * 44;
      const y1 = 15.5 + Math.sin(angle) * 15.5;
      const x2 = 44 - Math.cos(angle) * 44;
      const y2 = 15.5 - Math.sin(angle) * 15.5;

      const gradient = context.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, controls.gradientColor1.value);
      gradient.addColorStop(1, controls.gradientColor2.value);
      context.fillStyle = gradient;
      context.fillRect(0, 0, 88, 31);
    } else if (controls.bgType.value === "texture") {
      const texture = drawTexture(
        controls.textureType.value,
        controls.textureColor1.value,
        controls.textureColor2.value,
        parseFloat(controls.textureScale.value),
      );
      context.drawImage(texture, 0, 0);
    }

    // Draw border
    const borderWidth = parseFloat(controls.borderWidth.value);
    if (borderWidth > 0) {
      const style = controls.borderStyle.value;

      if (style === "solid") {
        context.strokeStyle = controls.borderColor.value;
        context.lineWidth = borderWidth;
        context.strokeRect(
          borderWidth / 2,
          borderWidth / 2,
          88 - borderWidth,
          31 - borderWidth,
        );
      } else if (style === "inset" || style === "outset") {
        const light = style === "outset";
        context.strokeStyle = light ? "#ffffff" : "#000000";
        context.lineWidth = borderWidth;
        context.beginPath();
        context.moveTo(0, 31);
        context.lineTo(0, 0);
        context.lineTo(88, 0);
        context.stroke();

        context.strokeStyle = light ? "#000000" : "#ffffff";
        context.beginPath();
        context.moveTo(88, 0);
        context.lineTo(88, 31);
        context.lineTo(0, 31);
        context.stroke();
      } else if (style === "ridge") {
        context.strokeStyle = "#ffffff";
        context.lineWidth = borderWidth / 2;
        context.strokeRect(
          borderWidth / 4,
          borderWidth / 4,
          88 - borderWidth / 2,
          31 - borderWidth / 2,
        );

        context.strokeStyle = "#000000";
        context.strokeRect(
          (borderWidth * 3) / 4,
          (borderWidth * 3) / 4,
          88 - borderWidth * 1.5,
          31 - borderWidth * 1.5,
        );
      }
    }

    // Draw text line 1
    const text = controls.text.value;
    if (text && controls.textEnabled.checked) {
      const fontSize = parseFloat(controls.fontSize.value);
      const fontWeight = controls.fontBold.checked ? "bold" : "normal";
      const fontStyle = controls.fontItalic.checked ? "italic" : "normal";
      const fontFamily = controls.fontFamily.value;

      context.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}"`;
      context.textAlign = "center";
      context.textBaseline = "middle";

      const x = (parseFloat(controls.textX.value) / 100) * 88;
      const y = (parseFloat(controls.textY.value) / 100) * 31;

      if (controls.textOutline.checked) {
        context.strokeStyle = controls.outlineColor.value;
        context.lineWidth = 2;
        context.strokeText(text, x, y);
      }

      // Apply text color or gradient
      if (controls.textColorType.value === "solid") {
        context.fillStyle = controls.textColor.value;
      } else {
        const angle =
          parseFloat(controls.textGradientAngle.value) * (Math.PI / 180);
        const textWidth = context.measureText(text).width;
        const x1 = x - textWidth / 2 + (Math.cos(angle) * textWidth) / 2;
        const y1 = y - fontSize / 2 + (Math.sin(angle) * fontSize) / 2;
        const x2 = x + textWidth / 2 - (Math.cos(angle) * textWidth) / 2;
        const y2 = y + fontSize / 2 - (Math.sin(angle) * fontSize) / 2;

        const textGradient = context.createLinearGradient(x1, y1, x2, y2);
        textGradient.addColorStop(0, controls.textGradientColor1.value);
        textGradient.addColorStop(1, controls.textGradientColor2.value);
        context.fillStyle = textGradient;
      }

      context.fillText(text, x, y);
    }

    // Draw text line 2
    const text2 = controls.text2.value;
    if (text2 && controls.text2Enabled.checked) {
      const fontSize2 = parseFloat(controls.fontSize2.value);
      const fontWeight2 = controls.fontBold2.checked ? "bold" : "normal";
      const fontStyle2 = controls.fontItalic2.checked ? "italic" : "normal";
      const fontFamily2 = controls.fontFamily2.value;

      context.font = `${fontStyle2} ${fontWeight2} ${fontSize2}px "${fontFamily2}"`;
      context.textAlign = "center";
      context.textBaseline = "middle";

      const x2 = (parseFloat(controls.text2X.value) / 100) * 88;
      const y2 = (parseFloat(controls.text2Y.value) / 100) * 31;

      if (controls.text2Outline.checked) {
        context.strokeStyle = controls.outline2Color.value;
        context.lineWidth = 2;
        context.strokeText(text2, x2, y2);
      }

      // Apply text color or gradient
      if (controls.text2ColorType.value === "solid") {
        context.fillStyle = controls.text2Color.value;
      } else {
        const angle2 =
          parseFloat(controls.text2GradientAngle.value) * (Math.PI / 180);
        const text2Width = context.measureText(text2).width;
        const x1_2 = x2 - text2Width / 2 + (Math.cos(angle2) * text2Width) / 2;
        const y1_2 = y2 - fontSize2 / 2 + (Math.sin(angle2) * fontSize2) / 2;
        const x2_2 = x2 + text2Width / 2 - (Math.cos(angle2) * text2Width) / 2;
        const y2_2 = y2 + fontSize2 / 2 - (Math.sin(angle2) * fontSize2) / 2;

        const text2Gradient = context.createLinearGradient(
          x1_2,
          y1_2,
          x2_2,
          y2_2,
        );
        text2Gradient.addColorStop(0, controls.text2GradientColor1.value);
        text2Gradient.addColorStop(1, controls.text2GradientColor2.value);
        context.fillStyle = text2Gradient;
      }

      context.fillText(text2, x2, y2);
    }
  }

  // Main draw function
  function drawButton() {
    drawToContext(ctx);
  }

  // Download function
  document.getElementById("download-button").addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "button-88x31.png";
    link.href = canvas.toDataURL();
    link.click();
  });

  // Preset buttons
  document.getElementById("preset-random").addEventListener("click", () => {
    const randomColor = () =>
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0");

    // Random background
    controls.bgType.value = ["solid", "gradient", "texture"][
      Math.floor(Math.random() * 3)
    ];
    controls.bgColor.value = randomColor();
    controls.gradientColor1.value = randomColor();
    controls.gradientColor2.value = randomColor();
    controls.gradientAngle.value = Math.floor(Math.random() * 360);
    controls.textureColor1.value = randomColor();
    controls.textureColor2.value = randomColor();
    controls.textureType.value = [
      "dots",
      "grid",
      "diagonal",
      "checkerboard",
      "noise",
      "stars",
    ][Math.floor(Math.random() * 6)];

    // Random text 1 color (50% chance of gradient)
    controls.textColorType.value = Math.random() > 0.5 ? "gradient" : "solid";
    controls.textColor.value = randomColor();
    controls.textGradientColor1.value = randomColor();
    controls.textGradientColor2.value = randomColor();
    controls.textGradientAngle.value = Math.floor(Math.random() * 360);

    // Random text 2 color (50% chance of gradient)
    controls.text2ColorType.value = Math.random() > 0.5 ? "gradient" : "solid";
    controls.text2Color.value = randomColor();
    controls.text2GradientColor1.value = randomColor();
    controls.text2GradientColor2.value = randomColor();
    controls.text2GradientAngle.value = Math.floor(Math.random() * 360);

    // Random border
    controls.borderColor.value = randomColor();
    controls.borderWidth.value = Math.floor(Math.random() * 6);
    controls.borderStyle.value = ["solid", "inset", "outset", "ridge"][
      Math.floor(Math.random() * 4)
    ];

    // Random text styles
    controls.fontBold.checked = Math.random() > 0.5;
    controls.fontItalic.checked = Math.random() > 0.5;
    controls.fontBold2.checked = Math.random() > 0.5;
    controls.fontItalic2.checked = Math.random() > 0.5;

    // Update displays
    updateValueDisplay("gradient-angle", controls.gradientAngle.value);
    updateValueDisplay("text-gradient-angle", controls.textGradientAngle.value);
    updateValueDisplay(
      "text2-gradient-angle",
      controls.text2GradientAngle.value,
    );
    updateValueDisplay("border-width", controls.borderWidth.value);

    controls.bgType.dispatchEvent(new Event("change"));
    controls.textColorType.dispatchEvent(new Event("change"));
    controls.text2ColorType.dispatchEvent(new Event("change"));
    drawButton();
  });

  document.getElementById("preset-classic").addEventListener("click", () => {
    // Classic 90s web button style
    controls.bgType.value = "gradient";
    controls.gradientColor1.value = "#0066cc";
    controls.gradientColor2.value = "#0099ff";
    controls.gradientAngle.value = 90;

    controls.textColorType.value = "solid";
    controls.textColor.value = "#ffffff";
    controls.text2ColorType.value = "solid";
    controls.text2Color.value = "#ffffff";

    controls.borderWidth.value = 2;
    controls.borderColor.value = "#000000";
    controls.borderStyle.value = "outset";

    controls.fontFamily.value = "Oswald";
    controls.fontFamily2.value = "Lato";
    controls.fontBold.checked = true;
    controls.fontBold2.checked = false;
    controls.fontItalic.checked = false;
    controls.fontItalic2.checked = false;

    controls.text.value = "RITUAL.SH";
    controls.text2.value = "FREE THE WEB";
    controls.textEnabled.checked = true;
    controls.text2Enabled.checked = true;
    controls.fontSize.value = 12;
    controls.fontSize2.value = 8;
    controls.textY.value = 35;
    controls.text2Y.value = 65;

    updateValueDisplay("font-size", 12);
    updateValueDisplay("font-size2", 8);
    updateValueDisplay("gradient-angle", 90);
    updateValueDisplay("text-y", 35);
    updateValueDisplay("text2-y", 65);

    controls.bgType.dispatchEvent(new Event("change"));
    controls.textColorType.dispatchEvent(new Event("change"));
    controls.text2ColorType.dispatchEvent(new Event("change"));
    drawButton();
  });

  document.getElementById("preset-modern").addEventListener("click", () => {
    // Modern cyberpunk style with gradient text
    controls.bgType.value = "gradient";
    controls.gradientColor1.value = "#0a0a0a";
    controls.gradientColor2.value = "#1a0a2e";
    controls.gradientAngle.value = 135;

    controls.textColorType.value = "gradient";
    controls.textGradientColor1.value = "#00ffaa";
    controls.textGradientColor2.value = "#00ffff";
    controls.textGradientAngle.value = 90;

    controls.text2ColorType.value = "gradient";
    controls.text2GradientColor1.value = "#ff00ff";
    controls.text2GradientColor2.value = "#ff6600";
    controls.text2GradientAngle.value = 0;

    controls.borderWidth.value = 1;
    controls.borderColor.value = "#00ffaa";
    controls.borderStyle.value = "solid";

    controls.fontFamily.value = "Roboto Mono";
    controls.fontFamily2.value = "Roboto Mono";
    controls.fontBold.checked = true;
    controls.fontBold2.checked = false;
    controls.fontItalic.checked = false;
    controls.fontItalic2.checked = false;

    controls.text.value = "RITUAL.SH";
    controls.text2.value = "EST. 2024";
    controls.textEnabled.checked = true;
    controls.text2Enabled.checked = true;
    controls.fontSize.value = 11;
    controls.fontSize2.value = 9;
    controls.textY.value = 35;
    controls.text2Y.value = 65;

    updateValueDisplay("font-size", 11);
    updateValueDisplay("font-size2", 9);
    updateValueDisplay("gradient-angle", 135);
    updateValueDisplay("text-gradient-angle", 90);
    updateValueDisplay("text2-gradient-angle", 0);
    updateValueDisplay("text-y", 35);
    updateValueDisplay("text2-y", 65);

    controls.textColorType.dispatchEvent(new Event("change"));
    controls.text2ColorType.dispatchEvent(new Event("change"));
    controls.bgType.dispatchEvent(new Event("change"));
    drawButton();
  });

  // Add event listeners to all controls
  Object.values(controls).forEach((control) => {
    if (control) {
      control.addEventListener("input", drawButton);
      control.addEventListener("change", drawButton);

      if (control.type === "range") {
        control.addEventListener("input", (e) => {
          updateValueDisplay(e.target.id, e.target.value);
        });
      }
    }
  });

  // Initial draw
  drawButton();
})();

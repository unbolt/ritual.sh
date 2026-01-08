(function () {
  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    setupCollapsible();
    setupButtonGenerator();
  }

  // Collapsible sections functionality
  function setupCollapsible() {
    const headers = document.querySelectorAll(".control-group-header");
    console.log("Found", headers.length, "collapsible headers");

    headers.forEach((header) => {
      header.addEventListener("click", () => {
        const controlGroup = header.closest(".control-group");
        if (controlGroup) {
          controlGroup.classList.toggle("collapsed");
          console.log("Toggled collapsed on", header.textContent.trim());
        }
      });
    });
  }

  function setupButtonGenerator() {
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

    // Animation configuration
    const ANIMATION_CONFIG = {
      fps: 20,
      duration: 2, // seconds
      get totalFrames() {
        return this.fps * this.duration;
      }, // 40 frames
    };

    // Animation state class - passed to drawToContext for frame-based rendering
    class AnimationState {
      constructor(frameNumber = 0, totalFrames = 40) {
        this.frame = frameNumber;
        this.totalFrames = totalFrames;
        this.progress = frameNumber / totalFrames; // 0 to 1
        this.time = (frameNumber / ANIMATION_CONFIG.fps) * 1000; // milliseconds
      }

      // Helper to get phase for periodic animations (0 to 2π)
      getPhase(speed = 1.0) {
        return this.progress * speed * Math.PI * 2;
      }
    }

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
      // Animation controls
      animateTextWave: document.getElementById("animate-text-wave"),
      waveAmplitude: document.getElementById("wave-amplitude"),
      waveSpeed: document.getElementById("wave-speed"),
      animateTextWave2: document.getElementById("animate-text-wave2"),
      waveAmplitude2: document.getElementById("wave-amplitude2"),
      waveSpeed2: document.getElementById("wave-speed2"),
      animateBgRainbow: document.getElementById("animate-bg-rainbow"),
      rainbowSpeed: document.getElementById("rainbow-speed"),
      animateBgRainbowGradient: document.getElementById(
        "animate-bg-rainbow-gradient",
      ),
      animateTextRainbow: document.getElementById("animate-text-rainbow"),
      textRainbowSpeed: document.getElementById("text-rainbow-speed"),
      animateTextRainbow2: document.getElementById("animate-text-rainbow2"),
      textRainbowSpeed2: document.getElementById("text-rainbow-speed2"),
      animateGlitch: document.getElementById("animate-glitch"),
      glitchIntensity: document.getElementById("glitch-intensity"),
      animatePulse: document.getElementById("animate-pulse"),
      pulseScale: document.getElementById("pulse-scale"),
      animateShimmer: document.getElementById("animate-shimmer"),
      animateScanline: document.getElementById("animate-scanline"),
      scanlineIntensity: document.getElementById("scanline-intensity"),
      scanlineSpeed: document.getElementById("scanline-speed"),
      animateRgbSplit: document.getElementById("animate-rgb-split"),
      rgbSplitIntensity: document.getElementById("rgb-split-intensity"),
      animateNoise: document.getElementById("animate-noise"),
      noiseIntensity: document.getElementById("noise-intensity"),
      animateRotate: document.getElementById("animate-rotate"),
      rotateAngle: document.getElementById("rotate-angle"),
      rotateSpeed: document.getElementById("rotate-speed"),
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
      const text2GradientColor = document.getElementById(
        "text2-gradient-color",
      );

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

    // Helper function to draw text line with optional wave animation
    function drawTextLine(context, lineNumber, animState) {
      const prefix = lineNumber === 1 ? "" : "2";
      const text = controls[`text${prefix}`].value;
      const enabled = controls[`text${prefix}Enabled`].checked;

      if (!text || !enabled) return;

      const fontSize = parseFloat(controls[`fontSize${prefix}`].value);
      const fontWeight = controls[`fontBold${prefix}`].checked
        ? "bold"
        : "normal";
      const fontStyle = controls[`fontItalic${prefix}`].checked
        ? "italic"
        : "normal";
      const fontFamily = controls[`fontFamily${prefix}`].value;

      context.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}"`;
      context.textAlign = "center";
      context.textBaseline = "middle";

      const baseX = (parseFloat(controls[`text${prefix}X`].value) / 100) * 88;
      const baseY = (parseFloat(controls[`text${prefix}Y`].value) / 100) * 31;

      // Check if wave animation is enabled
      const waveEnabled =
        animState && controls[`animateTextWave${prefix}`]?.checked;

      if (waveEnabled) {
        drawWaveText(
          context,
          text,
          baseX,
          baseY,
          fontSize,
          animState,
          lineNumber,
        );
      } else {
        drawStandardText(
          context,
          text,
          baseX,
          baseY,
          fontSize,
          animState,
          lineNumber,
        );
      }
    }

    // Draw standard (non-wave) text
    function drawStandardText(
      context,
      text,
      x,
      y,
      fontSize,
      animState,
      lineNumber,
    ) {
      const prefix = lineNumber === 1 ? "" : "2";

      // Get colors (with potential rainbow animation)
      const colors = getTextColors(
        lineNumber,
        animState,
        context,
        text,
        x,
        y,
        fontSize,
      );

      if (controls[`text${prefix}Outline`].checked) {
        context.strokeStyle = colors.strokeStyle;
        context.lineWidth = 2;
        context.strokeText(text, x, y);
      }

      context.fillStyle = colors.fillStyle;
      context.fillText(text, x, y);
    }

    // Draw wave-animated text (character by character)
    function drawWaveText(
      context,
      text,
      baseX,
      baseY,
      fontSize,
      animState,
      lineNumber,
    ) {
      const prefix = lineNumber === 1 ? "" : "2";
      const amplitude = parseFloat(controls[`waveAmplitude${prefix}`].value);
      const speed = parseFloat(controls[`waveSpeed${prefix}`].value);

      // Measure total width for centering
      const totalWidth = context.measureText(text).width;
      let currentX = baseX - totalWidth / 2;

      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const charWidth = context.measureText(char).width;

        // Calculate wave offset for this character
        const phase = animState.getPhase(speed);
        const charOffset = i / text.length; // 0 to 1
        const waveY = Math.sin(phase + charOffset * Math.PI * 2) * amplitude;

        const charX = currentX + charWidth / 2;
        const charY = baseY + waveY;

        // Get colors for this character
        const colors = getTextColors(
          lineNumber,
          animState,
          context,
          char,
          charX,
          charY,
          fontSize,
        );

        // Draw outline if enabled
        if (controls[`text${prefix}Outline`].checked) {
          context.strokeStyle = colors.strokeStyle;
          context.lineWidth = 2;
          context.strokeText(char, charX, charY);
        }

        // Draw character
        context.fillStyle = colors.fillStyle;
        context.fillText(char, charX, charY);

        currentX += charWidth;
      }
    }

    // Get text colors (solid, gradient, or rainbow)
    function getTextColors(
      lineNumber,
      animState,
      context,
      text,
      x,
      y,
      fontSize,
    ) {
      const prefix = lineNumber === 1 ? "" : "2";
      const colorType = controls[`text${prefix}ColorType`].value;

      let fillStyle, strokeStyle;

      // Rainbow text animation overrides other colors
      if (animState && controls[`animateTextRainbow${prefix}`]?.checked) {
        const hue =
          (animState.progress *
            parseFloat(controls[`textRainbowSpeed${prefix}`].value) *
            360) %
          360;
        fillStyle = `hsl(${hue}, 80%, 60%)`;
        strokeStyle = `hsl(${hue}, 80%, 30%)`;
      } else if (colorType === "solid") {
        fillStyle = controls[`text${prefix}Color`].value;
        strokeStyle = controls[`outline${prefix}Color`].value;
      } else {
        // Gradient
        const angle =
          parseFloat(controls[`text${prefix}GradientAngle`].value) *
          (Math.PI / 180);
        const textWidth = context.measureText(text).width;
        const x1 = x - textWidth / 2 + (Math.cos(angle) * textWidth) / 2;
        const y1 = y - fontSize / 2 + (Math.sin(angle) * fontSize) / 2;
        const x2 = x + textWidth / 2 - (Math.cos(angle) * textWidth) / 2;
        const y2 = y + fontSize / 2 - (Math.sin(angle) * fontSize) / 2;

        const textGradient = context.createLinearGradient(x1, y1, x2, y2);
        textGradient.addColorStop(
          0,
          controls[`text${prefix}GradientColor1`].value,
        );
        textGradient.addColorStop(
          1,
          controls[`text${prefix}GradientColor2`].value,
        );
        fillStyle = textGradient;
        strokeStyle = controls[`outline${prefix}Color`].value;
      }

      return { fillStyle, strokeStyle };
    }

    // Helper function to draw to a single context
    function drawToContext(context, animState = null) {
      context.clearRect(0, 0, 88, 31);

      // Apply rotate effect (must be before drawing)
      if (animState && controls.animateRotate?.checked) {
        const maxAngle = parseFloat(controls.rotateAngle.value);
        const speed = parseFloat(controls.rotateSpeed.value);
        const angle =
          Math.sin(animState.getPhase(speed)) * maxAngle * (Math.PI / 180);

        context.save();
        context.translate(44, 15.5);
        context.rotate(angle);
        context.translate(-44, -15.5);
      }

      // Draw background
      if (controls.bgType.value === "solid") {
        // Rainbow flash for solid colors
        if (animState && controls.animateBgRainbow?.checked) {
          const hue =
            (animState.progress *
              parseFloat(controls.rainbowSpeed.value) *
              360) %
            360;
          context.fillStyle = `hsl(${hue}, 70%, 50%)`;
        } else {
          context.fillStyle = controls.bgColor.value;
        }
        context.fillRect(0, 0, 88, 31);
      } else if (controls.bgType.value === "gradient") {
        const angle =
          parseFloat(controls.gradientAngle.value) * (Math.PI / 180);
        const x1 = 44 + Math.cos(angle) * 44;
        const y1 = 15.5 + Math.sin(angle) * 15.5;
        const x2 = 44 - Math.cos(angle) * 44;
        const y2 = 15.5 - Math.sin(angle) * 15.5;

        const gradient = context.createLinearGradient(x1, y1, x2, y2);

        // Rainbow flash for gradients
        if (animState && controls.animateBgRainbow?.checked) {
          const hue =
            (animState.progress *
              parseFloat(controls.rainbowSpeed.value) *
              360) %
            360;
          gradient.addColorStop(0, `hsl(${hue}, 70%, 50%)`);
          gradient.addColorStop(1, `hsl(${(hue + 60) % 360}, 70%, 60%)`);
        } else {
          gradient.addColorStop(0, controls.gradientColor1.value);
          gradient.addColorStop(1, controls.gradientColor2.value);
        }

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

      // Rainbow gradient overlay (travels across background)
      if (animState && controls.animateBgRainbowGradient?.checked) {
        // Map progress to position (-100 to 100)
        const position = animState.progress * 200 - 100;

        // Create a horizontal gradient that sweeps across
        const rainbowGradient = context.createLinearGradient(
          position - 50,
          0,
          position + 50,
          0,
        );

        // Create rainbow stops that also cycle through colors
        const hueOffset = animState.progress * 360;
        rainbowGradient.addColorStop(
          0,
          `hsla(${(hueOffset + 0) % 360}, 80%, 50%, 0)`,
        );
        rainbowGradient.addColorStop(
          0.2,
          `hsla(${(hueOffset + 60) % 360}, 80%, 50%, 0.6)`,
        );
        rainbowGradient.addColorStop(
          0.4,
          `hsla(${(hueOffset + 120) % 360}, 80%, 50%, 0.8)`,
        );
        rainbowGradient.addColorStop(
          0.6,
          `hsla(${(hueOffset + 180) % 360}, 80%, 50%, 0.8)`,
        );
        rainbowGradient.addColorStop(
          0.8,
          `hsla(${(hueOffset + 240) % 360}, 80%, 50%, 0.6)`,
        );
        rainbowGradient.addColorStop(
          1,
          `hsla(${(hueOffset + 300) % 360}, 80%, 50%, 0)`,
        );

        context.fillStyle = rainbowGradient;
        context.fillRect(0, 0, 88, 31);
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

      // Apply pulse effect (scale before drawing text)
      if (animState && controls.animatePulse?.checked) {
        const maxScale = parseFloat(controls.pulseScale.value);
        const minScale = 1.0;
        const scale =
          minScale +
          (maxScale - minScale) *
            (Math.sin(animState.getPhase(1.0)) * 0.5 + 0.5);

        context.save();
        context.translate(44, 15.5);
        context.scale(scale, scale);
        context.translate(-44, -15.5);
      }

      // Draw text line 1
      drawTextLine(context, 1, animState);

      // Draw text line 2
      drawTextLine(context, 2, animState);

      // Restore context if pulse was applied
      if (animState && controls.animatePulse?.checked) {
        context.restore();
      }

      // Apply shimmer effect
      if (animState && controls.animateShimmer?.checked) {
        const shimmerX = animState.progress * 120 - 20; // Sweep from -20 to 100

        const shimmerGradient = context.createLinearGradient(
          shimmerX - 15,
          0,
          shimmerX + 15,
          31,
        );
        shimmerGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
        shimmerGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.3)");
        shimmerGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        context.fillStyle = shimmerGradient;
        context.fillRect(0, 0, 88, 31);
      }

      // Apply glitch effect
      if (animState && controls.animateGlitch?.checked) {
        applyGlitchEffect(context, animState);
      }

      // Apply scanline effect
      if (animState && controls.animateScanline?.checked) {
        applyScanlineEffect(context, animState);
      }

      // Apply RGB split effect
      if (animState && controls.animateRgbSplit?.checked) {
        applyRgbSplitEffect(context, animState);
      }

      // Apply noise effect
      if (animState && controls.animateNoise?.checked) {
        applyNoiseEffect(context, animState);
      }

      // Restore context if rotate was applied
      if (animState && controls.animateRotate?.checked) {
        context.restore();
      }
    }

    // Apply glitch effect (scanline displacement)
    function applyGlitchEffect(context, animState) {
      const intensity = parseFloat(controls.glitchIntensity.value);
      const imageData = context.getImageData(0, 0, 88, 31);

      // Randomly glitch ~10% of scanlines per frame
      const glitchProbability = 0.1;
      const maxOffset = intensity;

      for (let y = 0; y < 31; y++) {
        if (Math.random() < glitchProbability) {
          const offset = Math.floor((Math.random() - 0.5) * maxOffset * 2);
          shiftScanline(imageData, y, offset);
        }
      }

      context.putImageData(imageData, 0, 0);
    }

    // Shift a horizontal scanline by offset pixels (with wrapping)
    function shiftScanline(imageData, y, offset) {
      const width = imageData.width;
      const rowStart = y * width * 4;
      const rowData = new Uint8ClampedArray(width * 4);

      // Copy row
      for (let i = 0; i < width * 4; i++) {
        rowData[i] = imageData.data[rowStart + i];
      }

      // Shift and wrap
      for (let x = 0; x < width; x++) {
        let sourceX = (x - offset + width) % width;
        let destIdx = rowStart + x * 4;
        let srcIdx = sourceX * 4;

        imageData.data[destIdx] = rowData[srcIdx];
        imageData.data[destIdx + 1] = rowData[srcIdx + 1];
        imageData.data[destIdx + 2] = rowData[srcIdx + 2];
        imageData.data[destIdx + 3] = rowData[srcIdx + 3];
      }
    }

    // Apply scanline effect (CRT-style horizontal lines)
    function applyScanlineEffect(context, animState) {
      const intensity = parseFloat(controls.scanlineIntensity.value);
      const speed = parseFloat(controls.scanlineSpeed.value);

      // Create overlay with scanlines
      context.globalCompositeOperation = "multiply";
      context.fillStyle = "rgba(0, 0, 0, " + intensity + ")";

      // Animate scanline position
      const offset = (animState.progress * speed * 31) % 2;

      for (let y = offset; y < 31; y += 2) {
        context.fillRect(0, Math.floor(y), 88, 1);
      }

      context.globalCompositeOperation = "source-over";
    }

    // Apply RGB split/chromatic aberration effect
    function applyRgbSplitEffect(context, animState) {
      const intensity = parseFloat(controls.rgbSplitIntensity.value);
      const imageData = context.getImageData(0, 0, 88, 31);
      const result = context.createImageData(88, 31);

      // Oscillating offset
      const phase = Math.sin(animState.getPhase(1.0));
      const offsetX = Math.round(phase * intensity);

      for (let y = 0; y < 31; y++) {
        for (let x = 0; x < 88; x++) {
          const idx = (y * 88 + x) * 4;

          // Red channel - shift left
          const redX = Math.max(0, Math.min(87, x - offsetX));
          const redIdx = (y * 88 + redX) * 4;
          result.data[idx] = imageData.data[redIdx];

          // Green channel - no shift
          result.data[idx + 1] = imageData.data[idx + 1];

          // Blue channel - shift right
          const blueX = Math.max(0, Math.min(87, x + offsetX));
          const blueIdx = (y * 88 + blueX) * 4;
          result.data[idx + 2] = imageData.data[blueIdx + 2];

          // Alpha channel
          result.data[idx + 3] = imageData.data[idx + 3];
        }
      }

      context.putImageData(result, 0, 0);
    }

    // Apply noise/static effect
    function applyNoiseEffect(context, animState) {
      const intensity = parseFloat(controls.noiseIntensity.value);
      const imageData = context.getImageData(0, 0, 88, 31);

      for (let i = 0; i < imageData.data.length; i += 4) {
        // Random noise value
        const noise = (Math.random() - 0.5) * 255 * intensity;

        imageData.data[i] = Math.max(
          0,
          Math.min(255, imageData.data[i] + noise),
        );
        imageData.data[i + 1] = Math.max(
          0,
          Math.min(255, imageData.data[i + 1] + noise),
        );
        imageData.data[i + 2] = Math.max(
          0,
          Math.min(255, imageData.data[i + 2] + noise),
        );
        // Alpha unchanged
      }

      context.putImageData(imageData, 0, 0);
    }

    // Animated preview state
    let previewAnimationId = null;

    // Update preview (static or animated based on settings)
    function updatePreview() {
      if (hasAnimationsEnabled()) {
        startAnimatedPreview();
      } else {
        stopAnimatedPreview();
        drawToContext(ctx);
      }
      updateDownloadButtonLabel();
    }

    // Start animated preview loop
    function startAnimatedPreview() {
      stopAnimatedPreview(); // Clear any existing

      let frameNum = 0;
      let lastFrameTime = performance.now();
      const frameDelay = 1000 / ANIMATION_CONFIG.fps; // ms per frame

      const animate = (currentTime) => {
        const elapsed = currentTime - lastFrameTime;

        // Only advance frame if enough time has passed
        if (elapsed >= frameDelay) {
          const animState = new AnimationState(
            frameNum,
            ANIMATION_CONFIG.totalFrames,
          );
          drawToContext(ctx, animState);

          frameNum = (frameNum + 1) % ANIMATION_CONFIG.totalFrames;
          lastFrameTime = currentTime - (elapsed % frameDelay); // Carry over extra time
        }

        previewAnimationId = requestAnimationFrame(animate);
      };

      previewAnimationId = requestAnimationFrame(animate);
    }

    // Stop animated preview
    function stopAnimatedPreview() {
      if (previewAnimationId) {
        cancelAnimationFrame(previewAnimationId);
        previewAnimationId = null;
      }
    }

    // Main draw function
    function drawButton() {
      updatePreview();
    }

    // Check if any animations are enabled
    function hasAnimationsEnabled() {
      return !!(
        controls.animateTextWave?.checked ||
        controls.animateTextWave2?.checked ||
        controls.animateBgRainbow?.checked ||
        controls.animateBgRainbowGradient?.checked ||
        controls.animateTextRainbow?.checked ||
        controls.animateTextRainbow2?.checked ||
        controls.animateGlitch?.checked ||
        controls.animatePulse?.checked ||
        controls.animateShimmer?.checked ||
        controls.animateScanline?.checked ||
        controls.animateRgbSplit?.checked ||
        controls.animateNoise?.checked ||
        controls.animateRotate?.checked
      );
    }

    // Update download button label
    function updateDownloadButtonLabel() {
      const btn = document.getElementById("download-button");
      btn.textContent = "Download GIF";
    }

    // Export as animated GIF
    async function exportAsGif() {
      const downloadBtn = document.getElementById("download-button");
      const originalText = downloadBtn.textContent;
      downloadBtn.disabled = true;
      downloadBtn.textContent = "Generating GIF...";

      try {
        // Create temporary canvas for frame generation
        const frameCanvas = document.createElement("canvas");
        frameCanvas.width = 88;
        frameCanvas.height = 31;
        const frameCtx = frameCanvas.getContext("2d");

        // Initialize gif.js
        const gif = new GIF({
          workers: 2,
          quality: 10,
          workerScript: "/js/gif.worker.js",
          width: 88,
          height: 31,
        });

        // Generate frames
        const totalFrames = ANIMATION_CONFIG.totalFrames;
        for (let i = 0; i < totalFrames; i++) {
          const animState = new AnimationState(i, totalFrames);
          drawToContext(frameCtx, animState);

          // Add frame to GIF (delay in ms)
          gif.addFrame(frameCtx, {
            delay: 1000 / ANIMATION_CONFIG.fps,
            copy: true,
          });

          // Update progress
          const progress = Math.round((i / totalFrames) * 100);
          downloadBtn.textContent = `Generating: ${progress}%`;

          // Yield to browser to keep UI responsive
          if (i % 5 === 0) {
            await new Promise((resolve) => setTimeout(resolve, 0));
          }
        }

        // Render GIF
        gif.on("finished", (blob) => {
          // Download
          const link = document.createElement("a");
          link.download = "button-88x31.gif";
          link.href = URL.createObjectURL(blob);
          link.click();

          // Cleanup
          URL.revokeObjectURL(link.href);
          downloadBtn.disabled = false;
          downloadBtn.textContent = originalText;
        });

        gif.on("progress", (progress) => {
          const percent = Math.round(progress * 100);
          downloadBtn.textContent = `Encoding: ${percent}%`;
        });

        gif.render();
      } catch (error) {
        console.error("Error generating GIF:", error);
        downloadBtn.disabled = false;
        downloadBtn.textContent = originalText;
        alert("Error generating GIF. Please try again.");
      }
    }

    // Download function
    document
      .getElementById("download-button")
      .addEventListener("click", async () => {
        await exportAsGif();
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
      controls.text2ColorType.value =
        Math.random() > 0.5 ? "gradient" : "solid";
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
      updateValueDisplay(
        "text-gradient-angle",
        controls.textGradientAngle.value,
      );
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
      controls.gradientColor1.value = "#6e6e6eff";
      controls.gradientColor2.value = "#979797";
      controls.gradientAngle.value = 90;

      controls.textColorType.value = "solid";
      controls.textColor.value = "#000000";
      controls.text2ColorType.value = "solid";
      controls.text2Color.value = "#000";

      controls.borderWidth.value = 2;
      controls.borderColor.value = "#000000";
      controls.borderStyle.value = "outset";

      controls.fontFamily.value = "VT323";
      controls.fontFamily2.value = "VT323";
      controls.fontBold.checked = false;
      controls.fontBold2.checked = false;
      controls.fontItalic.checked = false;
      controls.fontItalic2.checked = false;

      //controls.text.value = "RITUAL.SH";
      //controls.text2.value = "FREE THE WEB";
      controls.textEnabled.checked = true;
      controls.text2Enabled.checked = true;
      controls.fontSize.value = 12;
      controls.fontSize2.value = 8;
      controls.textY.value = 50;
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

      //controls.text.value = "RITUAL.SH";
      //controls.text2.value = "EST. 2024";
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

    // Animation control show/hide listeners
    if (controls.animateTextWave) {
      controls.animateTextWave.addEventListener("change", () => {
        document.getElementById("wave-controls").style.display = controls
          .animateTextWave.checked
          ? "block"
          : "none";
      });
    }

    if (controls.animateTextWave2) {
      controls.animateTextWave2.addEventListener("change", () => {
        document.getElementById("wave-controls2").style.display = controls
          .animateTextWave2.checked
          ? "block"
          : "none";
      });
    }

    if (controls.animateBgRainbow) {
      controls.animateBgRainbow.addEventListener("change", () => {
        document.getElementById("rainbow-bg-controls").style.display = controls
          .animateBgRainbow.checked
          ? "block"
          : "none";
      });
    }

    if (controls.animateTextRainbow) {
      controls.animateTextRainbow.addEventListener("change", () => {
        document.getElementById("rainbow-text-controls").style.display =
          controls.animateTextRainbow.checked ? "block" : "none";
      });
    }

    if (controls.animateTextRainbow2) {
      controls.animateTextRainbow2.addEventListener("change", () => {
        document.getElementById("rainbow-text2-controls").style.display =
          controls.animateTextRainbow2.checked ? "block" : "none";
      });
    }

    if (controls.animateGlitch) {
      controls.animateGlitch.addEventListener("change", () => {
        document.getElementById("glitch-controls").style.display = controls
          .animateGlitch.checked
          ? "block"
          : "none";
      });
    }

    if (controls.animatePulse) {
      controls.animatePulse.addEventListener("change", () => {
        document.getElementById("pulse-controls").style.display = controls
          .animatePulse.checked
          ? "block"
          : "none";
      });
    }

    if (controls.animateScanline) {
      controls.animateScanline.addEventListener("change", () => {
        document.getElementById("scanline-controls").style.display = controls
          .animateScanline.checked
          ? "block"
          : "none";
      });
    }

    if (controls.animateRgbSplit) {
      controls.animateRgbSplit.addEventListener("change", () => {
        document.getElementById("rgb-split-controls").style.display = controls
          .animateRgbSplit.checked
          ? "block"
          : "none";
      });
    }

    if (controls.animateNoise) {
      controls.animateNoise.addEventListener("change", () => {
        document.getElementById("noise-controls").style.display = controls
          .animateNoise.checked
          ? "block"
          : "none";
      });
    }

    if (controls.animateRotate) {
      controls.animateRotate.addEventListener("change", () => {
        document.getElementById("rotate-controls").style.display = controls
          .animateRotate.checked
          ? "block"
          : "none";
      });
    }

    // Initial draw
    drawButton();
  } // end setupButtonGenerator
})();

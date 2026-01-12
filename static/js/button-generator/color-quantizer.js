/**
 * Color Quantizer - Custom color reduction with median cut algorithm
 * Reduces canvas colors with optional dithering for retro aesthetic
 */

export class ColorQuantizer {
  /**
   * Reduce colors in a canvas using median cut algorithm
   * @param {HTMLCanvasElement} canvas - Canvas to quantize
   * @param {number} colorCount - Target number of colors (2-256)
   * @param {string|boolean} dither - Dithering algorithm ('floyd-steinberg', false)
   * @returns {ImageData} Quantized image data
   */
  static quantize(canvas, colorCount = 256, dither = false) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    if (colorCount >= 256) {
      return imageData; // No quantization needed
    }

    // Build palette using median cut
    const palette = this.buildPalette(pixels, colorCount);

    // Apply palette to image
    if (dither === 'floyd-steinberg') {
      this.applyPaletteWithDithering(pixels, palette, canvas.width, canvas.height);
    } else {
      this.applyPalette(pixels, palette);
    }

    return imageData;
  }

  /**
   * Build color palette using median cut algorithm
   */
  static buildPalette(pixels, colorCount) {
    // Collect unique colors
    const colorMap = new Map();
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const a = pixels[i + 3];

      if (a === 0) continue; // Skip transparent pixels

      const key = (r << 16) | (g << 8) | b;
      colorMap.set(key, (colorMap.get(key) || 0) + 1);
    }

    // Convert to array of color objects with counts
    const colors = Array.from(colorMap.entries()).map(([key, count]) => ({
      r: (key >> 16) & 0xFF,
      g: (key >> 8) & 0xFF,
      b: key & 0xFF,
      count: count
    }));

    // If we have fewer colors than target, return as-is
    if (colors.length <= colorCount) {
      return colors.map(c => [c.r, c.g, c.b]);
    }

    // Start with all colors in one bucket
    let buckets = [colors];

    // Split buckets until we have desired number
    while (buckets.length < colorCount) {
      // Find bucket with largest range
      let maxRange = -1;
      let maxBucketIdx = 0;
      let maxChannel = 'r';

      buckets.forEach((bucket, idx) => {
        if (bucket.length <= 1) return;

        const ranges = this.getColorRanges(bucket);
        const range = Math.max(ranges.r, ranges.g, ranges.b);

        if (range > maxRange) {
          maxRange = range;
          maxBucketIdx = idx;
          if (ranges.r >= ranges.g && ranges.r >= ranges.b) maxChannel = 'r';
          else if (ranges.g >= ranges.b) maxChannel = 'g';
          else maxChannel = 'b';
        }
      });

      if (maxRange === -1) break; // Can't split further

      // Split the bucket
      const bucket = buckets[maxBucketIdx];
      bucket.sort((a, b) => a[maxChannel] - b[maxChannel]);

      const mid = Math.floor(bucket.length / 2);
      const bucket1 = bucket.slice(0, mid);
      const bucket2 = bucket.slice(mid);

      buckets.splice(maxBucketIdx, 1, bucket1, bucket2);
    }

    // Average colors in each bucket to create palette
    return buckets.map(bucket => {
      let totalWeight = 0;
      let sumR = 0, sumG = 0, sumB = 0;

      bucket.forEach(color => {
        const weight = color.count;
        totalWeight += weight;
        sumR += color.r * weight;
        sumG += color.g * weight;
        sumB += color.b * weight;
      });

      return [
        Math.round(sumR / totalWeight),
        Math.round(sumG / totalWeight),
        Math.round(sumB / totalWeight)
      ];
    });
  }

  /**
   * Get color ranges in a bucket
   */
  static getColorRanges(bucket) {
    let minR = 255, maxR = 0;
    let minG = 255, maxG = 0;
    let minB = 255, maxB = 0;

    bucket.forEach(color => {
      minR = Math.min(minR, color.r);
      maxR = Math.max(maxR, color.r);
      minG = Math.min(minG, color.g);
      maxG = Math.max(maxG, color.g);
      minB = Math.min(minB, color.b);
      maxB = Math.max(maxB, color.b);
    });

    return {
      r: maxR - minR,
      g: maxG - minG,
      b: maxB - minB
    };
  }

  /**
   * Find nearest color in palette
   */
  static findNearestColor(r, g, b, palette) {
    let minDist = Infinity;
    let nearest = palette[0];

    for (const color of palette) {
      const dr = r - color[0];
      const dg = g - color[1];
      const db = b - color[2];
      const dist = dr * dr + dg * dg + db * db;

      if (dist < minDist) {
        minDist = dist;
        nearest = color;
      }
    }

    return nearest;
  }

  /**
   * Apply palette without dithering
   */
  static applyPalette(pixels, palette) {
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const a = pixels[i + 3];

      if (a === 0) continue;

      const nearest = this.findNearestColor(r, g, b, palette);
      pixels[i] = nearest[0];
      pixels[i + 1] = nearest[1];
      pixels[i + 2] = nearest[2];
    }
  }

  /**
   * Apply palette with Floyd-Steinberg dithering
   */
  static applyPaletteWithDithering(pixels, palette, width, height) {
    // Create error buffer
    const errors = new Float32Array(width * height * 3);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const errIdx = (y * width + x) * 3;

        const r = pixels[idx];
        const g = pixels[idx + 1];
        const b = pixels[idx + 2];
        const a = pixels[idx + 3];

        if (a === 0) continue;

        // Add accumulated error
        const newR = Math.max(0, Math.min(255, r + errors[errIdx]));
        const newG = Math.max(0, Math.min(255, g + errors[errIdx + 1]));
        const newB = Math.max(0, Math.min(255, b + errors[errIdx + 2]));

        // Find nearest palette color
        const nearest = this.findNearestColor(newR, newG, newB, palette);

        // Set pixel to nearest color
        pixels[idx] = nearest[0];
        pixels[idx + 1] = nearest[1];
        pixels[idx + 2] = nearest[2];

        // Calculate error
        const errR = newR - nearest[0];
        const errG = newG - nearest[1];
        const errB = newB - nearest[2];

        // Distribute error to neighboring pixels (Floyd-Steinberg)
        // Right pixel (x+1, y): 7/16
        if (x + 1 < width) {
          const rightIdx = (y * width + (x + 1)) * 3;
          errors[rightIdx] += errR * 7 / 16;
          errors[rightIdx + 1] += errG * 7 / 16;
          errors[rightIdx + 2] += errB * 7 / 16;
        }

        // Bottom-left pixel (x-1, y+1): 3/16
        if (y + 1 < height && x > 0) {
          const blIdx = ((y + 1) * width + (x - 1)) * 3;
          errors[blIdx] += errR * 3 / 16;
          errors[blIdx + 1] += errG * 3 / 16;
          errors[blIdx + 2] += errB * 3 / 16;
        }

        // Bottom pixel (x, y+1): 5/16
        if (y + 1 < height) {
          const bottomIdx = ((y + 1) * width + x) * 3;
          errors[bottomIdx] += errR * 5 / 16;
          errors[bottomIdx + 1] += errG * 5 / 16;
          errors[bottomIdx + 2] += errB * 5 / 16;
        }

        // Bottom-right pixel (x+1, y+1): 1/16
        if (y + 1 < height && x + 1 < width) {
          const brIdx = ((y + 1) * width + (x + 1)) * 3;
          errors[brIdx] += errR * 1 / 16;
          errors[brIdx + 1] += errG * 1 / 16;
          errors[brIdx + 2] += errB * 1 / 16;
        }
      }
    }
  }
}

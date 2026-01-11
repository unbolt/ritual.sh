---
title: "Adoptables"
date: 2026-01-10
description: "Customisable widgets and animations for your website"
icon: "adoptables"
draft: false
---

Welcome to my adoptables collection! These are customisable widgets you can embed on your own website. Each adoptable comes with a live preview and customisation options. Just configure it how you like, grab the code, and paste it into your site.

All adoptables are:

- **Free to use** - No attribution required (but appreciated!)
- **Probably customisable** - Tweak your own colors and settings if applicable
- **Self-contained** - Single script tag, no dependencies
- **Responsive** - Scales to fit your layout

---

## Lava Lamp

My brother had a blue and yellow lava lamp when I was younger and I was obsessed with it, so making one for my website was an obvious choice... and now I'd like to share it with everyone!

Using the pixelation effect with very high contrast colours is going to result in an aura on the blobs due to the way the SVG filter works, I am trying to find a solution for this.

{{< lavalamp-adoptable >}}

---

## Usage Instructions

1. **Customise** - Use the controls to adjust colors, animation speed, and other settings
2. **Get Code** - Click "Get Embed Code" to generate your custom script tag
3. **Embed** - Copy the code and paste it anywhere in your HTML
4. **Style** - Wrap it in a div and set width/height to control the lamp size

### Example Container

The lava lamp will scale to fit its container. You can control the size like this:

```html
<div style="width: 200px; height: 350px;">
  <script
    src="https://ritual.sh/js/adoptables/lavalamp.js"
    data-bg-color-1="#F8E45C"
    data-bg-color-2="#FF7800"
    data-blob-color-1="#FF4500"
    data-blob-color-2="#FF6347"
    data-case-color="#333333"
    data-blob-count="6"
    data-speed="1.0"
    data-blob-size="1.0"
  ></script>
</div>
```

### Customisation Options

- `data-bg-color-1` & `data-bg-color-2`: Background gradient colors
- `data-blob-color-1` & `data-blob-color-2`: Blob gradient colors
- `data-case-color`: Color for the top cap and bottom base
- `data-blob-count`: Number of blobs (3-12)
- `data-speed`: Animation speed multiplier (0.5-1.5x)
- `data-blob-size`: Blob size multiplier (0.5-2.0x)
- `data-pixelate`: Set to "true" for a retro pixelated effect
- `data-pixel-size`: Pixel size for pixelation effect (2-10, default 4)

---

## More Coming Soon

The companion cube is coming soon!

Got ideas for adoptables you'd like to see? Let me know!

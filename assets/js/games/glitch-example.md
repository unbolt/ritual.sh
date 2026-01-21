# Glitch Content Type - Usage Guide

The `glitch` content type creates an animated glitching text effect that makes text appear to corrupt and "infect" surrounding lines with random glitch characters.

## Basic Usage

```javascript
{
  type: "glitch",
  text: "SYSTEM CORRUPTED"
}
```

## Configuration Options

### Required
- **text** (string): The text to glitch

### Optional
- **intensity** (number, 0-1, default: 0.3): How much the text glitches. Higher = more characters replaced
- **spread** (number, default: 2): Number of "infection" lines to show above and below the main text
- **speed** (number, default: 50): Animation frame speed in milliseconds
- **duration** (number, default: 2000): How long the glitch effect lasts in milliseconds
- **className** (string, default: "glitch-text"): CSS class to apply to the container

## Examples

### Subtle Glitch
```javascript
{
  type: "glitch",
  text: "Connection unstable...",
  intensity: 0.2,
  spread: 1,
  duration: 1500
}
```

### Intense Corruption
```javascript
{
  type: "glitch",
  text: "ERROR: MEMORY FAULT",
  intensity: 0.7,
  spread: 4,
  speed: 30,
  duration: 3000,
  className: "error glitch-text"
}
```

### Quick Flicker
```javascript
{
  type: "glitch",
  text: "Reality fragmenting",
  intensity: 0.4,
  spread: 2,
  speed: 25,
  duration: 1000
}
```

### In Scene Content
```javascript
content: [
  "The terminal screen begins to distort...",
  { type: "delay", ms: 500 },
  {
    type: "glitch",
    text: "CASCADE.EXE EXECUTING",
    intensity: 0.6,
    spread: 3,
    duration: 2500
  },
  { type: "delay", ms: 500 },
  "Something is very wrong."
]
```

## Visual Effect Description

The glitch effect:
1. Replaces characters in the text with random glitch symbols (unicode blocks, special chars, etc.)
2. Creates random "infection" lines above and below the main text
3. Animates over time with a sine wave intensity (ramps up, then down)
4. Ends with the text showing minimal corruption

The infection lines are offset randomly and contain random glitch characters, making it look like the corruption is spreading to surrounding content.

## Character Pool

The glitch uses a pool of:
- Block drawing characters (▓▒░█)
- Box drawing characters (║╬╣╠╔╗╚╝)
- Mathematical symbols (Ω∑∏∫√∂∆∇)
- Accented characters (É È Ê Ë Á À)
- Special symbols (¡¿‽※§¶†‡∞≈≠±)
- Combining diacritics (creates zalgo-like text)
- Standard symbols (!@#$%^&*)

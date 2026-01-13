# 🌟 Pocket Critters

A modular virtual pet app built with vanilla JavaScript ES modules.

## Project Structure

```
meta-pets/
├── index.html              # Main HTML entry point
├── js/
│   ├── app.js              # Main application class
│   ├── config.js           # Game configuration constants
│   ├── pets/
│   │   └── registry.js     # Pet type definitions (add new pets here!)
│   ├── features/
│   │   ├── stats.js        # Stats system (hunger, etc.)
│   │   └── actions.js      # Action system (feed, etc.)
│   └── utils/
│       ├── events.js       # Event bus for decoupled communication
│       └── storage.js      # localStorage persistence
└── styles/
    ├── main.css            # Core layout and variables
    ├── components/
    │   ├── selection.css   # Pet selection screen
    │   ├── naming.css      # Naming screen
    │   ├── habitat.css     # Pet habitat display
    │   ├── stats.css       # Stats panel
    │   ├── actions.css     # Action buttons
    │   └── modal.css       # Modal dialogs
    └── pets/
        ├── _shared.css     # Shared pet animations
        ├── dog.css         # Dog appearance
        └── cat.css         # Cat appearance
```

## Adding New Content

### Adding a New Pet Type

1. **Create CSS file**: `styles/pets/newpet.css`
2. **Add to registry**: Edit `js/pets/registry.js`:

```javascript
export const PET_TYPES = {
    // ... existing pets ...
    newpet: {
        name: 'New Pet',
        traits: {
            hungerDecayMultiplier: 1.0,
            happinessDecayMultiplier: 1.0,
            favoriteFood: '🍎'
        },
        template: `<div class="newpet">...</div>`
    }
};
```

3. **Link CSS**: Add to `index.html`:
```html
<link rel="stylesheet" href="styles/pets/newpet.css">
```

### Adding a New Stat

Edit `js/features/stats.js`:

```javascript
export const STATS = {
    // ... existing stats ...
    happiness: {
        id: 'happiness',
        name: 'Happiness',
        icon: '😊',
        baseDecayRate: 1.5,
        traitMultiplier: 'happinessDecayMultiplier',
        startValue: 100,
        min: 0,
        max: 100
    }
};
```

### Adding a New Action

Edit `js/features/actions.js`:

```javascript
export const ACTIONS = {
    // ... existing actions ...
    play: {
        id: 'play',
        name: 'Play',
        icon: '🎾',
        buttonClass: 'secondary',
        effects: [
            { statId: 'happiness', amount: 20 },
            { statId: 'energy', amount: -10 }
        ],
        animation: 'pet-playing',
        animationDuration: 1200,
        cooldown: 3000,
        canPerform: (statsManager) => statsManager.getValue('energy') >= 10
    }
};
```

## Event System

The app uses an event bus for decoupled communication. Subscribe to events:

```javascript
import { events, EVENTS } from './utils/events.js';

events.on(EVENTS.STAT_CHANGED, ({ statId, newValue }) => {
    console.log(`${statId} changed to ${newValue}`);
});

events.on(EVENTS.ACTION_PERFORMED, ({ actionId }) => {
    console.log(`Action performed: ${actionId}`);
});
```

### Available Events

- `pet:selected` - Pet type selected
- `pet:named` - Pet named
- `pet:changed` - Pet reset/changed
- `stat:changed` - Any stat value changed
- `stat:critical` - Stat dropped below warning threshold
- `action:performed` - Action was performed
- `screen:changed` - Screen navigation
- `modal:opened` / `modal:closed` - Modal state

## Configuration

Edit `js/config.js` to tune game balance:

```javascript
export const CONFIG = {
    STAT_DECAY_INTERVAL: 5000,    // How often stats decay (ms)
    FEED_ANIMATION_DURATION: 900,  // Animation length (ms)
    MOOD_THRESHOLDS: {
        happy: 70,
        neutral: 40,
        worried: 20
    },
    SAVE_KEY: 'pocketCritter'
};
```

## Development

This project uses vanilla JavaScript ES modules. No build step required!

### Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the dev server with hot reload:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

The dev server watches for file changes and automatically refreshes the browser.

The modular architecture makes it easy for multiple contributors to work in parallel:

- **Pet artists**: Work in `styles/pets/` and `js/pets/registry.js`
- **Feature developers**: Work in `js/features/`
- **UI developers**: Work in `styles/components/`
- **Core developers**: Work in `js/app.js` and `js/utils/`

Each domain is isolated, minimizing merge conflicts!

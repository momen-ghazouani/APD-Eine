## Visual Tests For Your Brand

APD Eine is a set of small, open-source labs for pressure-testing a logo before it ships: how it sits inside an iOS home screen, how its favicon reads in a Google result, and how it looks as a profile avatar on X or LinkedIn. Pick a surface below and drop in an image to see it in place.

## Live demo
The link will be provided soon.

## Project structure
```
apd-eine/
├── index.html          # Markup only
├── css/
│   └── style.css       # All styling
├── js/
│   ├── app-lab.js      # iOS home-screen icon lab
│   ├── search-lab.js   # Google search-result favicon lab
│   ├── social-lab.js   # X / LinkedIn profile avatar lab
│   └── main.js         # Overlay open/close + init wiring
└── README.md
```

## Notes
- Data entered in each lab (names, logos, bios) is stored locally in the browser via `localStorage` — nothing is sent to a server.
- The interface mockups for X and LinkedIn are simulated visual references for design testing and are not affiliated with X Corp. or LinkedIn Corp.

Licensed under the Setaleur Non-Commercial Share-Alike License v1.0

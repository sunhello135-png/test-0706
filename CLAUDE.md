# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # Launch the Electron app
```

No build step, linter, or test suite is configured.

## Architecture

This is a frameless Electron desktop app (400×500px) implementing the Pomodoro technique.

**Process model:**
- `main.js` — Electron main process. Creates the `BrowserWindow` with `contextIsolation: true` and `nodeIntegration: false`.
- `preload.js` — Bridges main↔renderer via `contextBridge`, exposing `window.electronAPI.sendNotification(title, body)` which fires the Web Notifications API directly (no IPC to main process needed).
- `renderer.js` — All timer logic runs here in the renderer process. No framework; plain DOM manipulation.
- `index.html` / `styles.css` — UI shell. The progress ring is an SVG circle animated via `strokeDashoffset`.

**Timer state machine in `renderer.js`:**
- States: `工作` (25 min) → `短休息` (5 min) or `长休息` (15 min, every 4th pomodoro) → back to `工作`
- `transitionState()` handles automatic switching after a timer expires
- `pomodoroCount % 4 === 0` triggers a long break
- Progress ring uses `CIRCUMFERENCE = 2π×90` with `strokeDashoffset` proportional to elapsed fraction

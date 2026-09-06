# Ghosts of Tabor – Tactical Operations Terminal

Unofficial fan-made companion for **Ghosts of Tabor** (Combat Waffle Studios).

**Design:** Dark tactical command terminal — Prepare. Deploy. Survive. Extract.

## Features

### Core (no login required)
- Cinematic landing page
- **Random Kit Generator** (filters: budget, map, playstyle, boss gear, DLC, trader level)
- Lock slots + reroll
- Item / Ammo / Map databases
- Intel feed (Wipe 10 / 0.14.0)

### Account system (login required for save / matchmaking)
- **Register / Login** (client-side accounts in browser localStorage)
- **Save kits** to your account (load / delete later)
- **Group Finder**: Go live → appear for other operators looking for a squad
- Leave matchmaking
- Session lasts 72 hours

### Auto-update
- Checks `data/manifest.json` on load and hourly
- Notifies when new game data / app version is deployed

> **Demo note:** Auth and presence use `localStorage`. Same browser/device only.
> Production path: replace `js/auth.js` with Supabase / Firebase / custom backend.

## How to run

Open `index.html` or deploy on Vercel (static).

## Legal

Unofficial fan project. Not affiliated with Combat Waffle Studios.
Always verify critical game data in-game. Do not reuse real passwords in this demo.

---

Prepare. Deploy. Survive. Extract.

# STUDY SURVIVOR — Handheld Pixel Visual Update v2

This version replaces the previous abstract/generic monster art with classic Pokémon game sprite loading and a portable-monster-RPG-inspired route/battle HUD. It keeps the existing playable survival/learning systems.

## Feature set
- 151 Kanto species, team of three, three stages, real-time auto-technique battle, type-colored techniques, XP, upgrades, evolution, bosses.
- 5 correct quiz answers earn a five-monster pack. CSV and JSON question import, review history, collection/deck, localStorage save.
- Portable RPG-like route tiles, flowered grass, pathways, trees, rocks, custom battle effects, retro menu/panel design.
- Battle sprites and Pokédex artwork are loaded as 80px classical pixel sprite PNGs via the PokeAPI sprites community archive at `https://github.com/PokeAPI/sprites` (GitHub raw content). If external URLs fail, procedural in-game placeholders appear, so battles remain playable. Sprite assets aren't bundled with this archive. Replace with licensed/local art under a custom source adapter as needed.

## Attribution and rights
Fan-made educational prototype, unaffiliated with The Pokémon Company, Nintendo, Creatures, or Game Freak. Pokémon species, sprite images, and names are owned by their respective rights holders. Do not assume these assets are available for commercial use. Terrain/UI/effect code is original and not copied from specific game tiles. This project does not package or redistribute the external sprites.

## Deployment
Host directory under GitHub Pages (root), or run a local HTTP server (`python -m http.server 8000`). Opening the index directly via file protocol will block fetching the JSON data. Existing save key `studySurvivor.v1` is unchanged.
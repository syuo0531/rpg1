# STUDY SURVIVOR — Handheld Pixel Visual Update v2

This version replaces the previous abstract/generic monster art with classic Pokémon game sprite loading and a portable-monster-RPG-inspired route/battle HUD. It keeps the existing playable survival/learning systems.

## Feature set
- 151 Kanto species, team of three, three stages, real-time auto-technique battle, type-colored techniques, XP, upgrades, evolution, bosses.
- 5 correct quiz answers earn a single-monster gacha. CSV and JSON question import, review history, collection/deck, localStorage save.
- Portable RPG-like route tiles, flowered grass, pathways, trees, rocks, custom battle effects, retro menu/panel design.
- Battle sprites and Pokédex artwork are loaded as 80px classical pixel sprite PNGs via the PokeAPI sprites community archive at `https://github.com/PokeAPI/sprites` (GitHub raw content). If external URLs fail, procedural in-game placeholders appear, so battles remain playable. Sprite assets aren't bundled with this archive. Replace with licensed/local art under a custom source adapter as needed.

## Attribution and rights
Fan-made educational prototype, unaffiliated with The Pokémon Company, Nintendo, Creatures, or Game Freak. Pokémon species, sprite images, and names are owned by their respective rights holders. Do not assume these assets are available for commercial use. Terrain/UI/effect code is original and not copied from specific game tiles. This project does not package or redistribute the external sprites.

## Deployment
Host directory under GitHub Pages (root), or run a local HTTP server (`python -m http.server 8000`). Opening the index directly via file protocol will block fetching the JSON data. Existing save key `studySurvivor.v1` is unchanged.


## v3 修正 (2026-10-13)
- 戦闘描画を30fpsに制限。地形タイルを再利用し、Safari・モバイル負荷を削減。
- window blur による意図しない停止を解消。ページ非表示時のみ一時停止し、復帰時に自動再開。手動ポーズとレベルアップ選択は保持。
- アニメーション処理の例外を捕捉し、無言の永久停止を回避。
- 学習5問正解でガチャ券1枚。ガチャ1回につき151匹から1匹のみ獲得。既存のレア率と累積救済を継続。
- データ保存キーを維持し、所持・進化・編成・勉強履歴・ガチャ券を継承。
# STUDY SURVIVOR — Shiny / Eight Dungeons / Eight Gyms v8

2026-10-13. GitHub Pages browser game.

## New in v8

- **Shiny Pokémon**: one shiny roll per acquired Pokémon. Gacha rate **1/256**; successful post-battle wild capture rate **1/384**. A shiny acquisition counts as exactly one Pokémon in `owned`, plus a separate `shinyOwned` count and acquisition source in `shinySources`. The player can select the shiny appearance from the Pokémon detail panel (toggle, saved in `shinyEquipped`). Shiny Pokémon are not more powerful; they are rare collectibles. Current recoloring uses a hue-shift variant, not species-authentic official shiny palettes.
- **Dungeons**: 5 new areas after the existing 3, for **8 total**. New enemy pools, difficulty scaling and boss per area. Clear each area to unlock the next.
- **Gym Challenge**: 8 Kanto gyms in order: Pewter/Brock, Cerulean/Misty, Vermilion/Lt. Surge, Celadon/Erika, Fuchsia/Koga, Saffron/Sabrina, Cinnabar/Blaine, Viridian/Giovanni. Japanese leader names appear in the UI. The first gym unlocks after the first dungeon; later gyms unlock through earning the previous badge. Each gym has its own encounter pool, ace, boss timing, rising enemy toughness/speed, and boss bullet pattern. Gym 8 has a major final boss HP increase. Winning awards a permanent badge, materials, gacha tickets, and balls. Trainer-owned gym Pokémon are not captureable.
- **UI**: mode switch between Dungeon and Gym on Battle screen; badge display, shiny Pokedex filter, shiny inventory counter, shiny sparkle in gacha and capture results.
- **Data / save**: existing localStorage key `studySurvivor.v1` is unchanged and data is merged with the new fields (`gymBadges`, `shinyOwned`, `shinySources`, `shinyEquipped`). Old gacha, captured Pokémon, study history, technical machines and balls persist.

## Testing

`node --check script.js`

Browser tests in `test_v8.py` / `test_extra.py` verified mobile and desktop startup, 8 dungeons, eight gym screens, locks, gym badge rewards and sequential unlocks, gym 8 boss HP, shiny gacha, wild shiny capture, appearance toggling, old-save migration, and survival battle updates.

## Usage

Host the project root (`index.html`, `script.js`, `style.css`, `data/`) on GitHub Pages. Learning remains 5 correct answers per gacha ticket; gacha gives 1 Pokémon and a chance for a bonus technical machine. Dungeon clear also supplies capture balls, and wild capture remains strictly post-battle.

Fan-created educational prototype; not affiliated with Nintendo, Game Freak or The Pokémon Company. Pokémon sprites are fetched from an external open source collection, with procedural fallback.
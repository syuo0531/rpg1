# STUDY SURVIVOR — v6 / Capture and Summon Balls

- Existing localStorage game state `studySurvivor.v1` remains valid and unchanged; migrated bag and provenance counters added.
- Gacha: one Pokémon per ticket, rarity N/U/R/SR/LG selects a **summon ball** skin. Owned immediately and safely, animation 1.75s can be skipped by navigating away. Gacha is not affected by capture ball inventory.
- Battle: catch wild Pokémon via monster/great/ultra/master capture balls. Choose wild target by tapping the enemy or throw at nearest enemy within 275 game units. Bosses cannot be caught. Capture odds increase for low HP; master succeeds on wild targets. Capturing gives the Pokémon but not kill XP.
- Battle rewards: clearing stages earns normal balls, harder stages grant higher tier balls with low master chance; losing after 12+ kills grants one ball. Player starts with 5 normal balls.
- Capture and gacha origins stored in separate `sources.gacha` and `sources.wild` counters, old ownership preserved.
- All existing study, TM, type, battle and team mechanics retained.
- `?debug=1` exposes `SURVIVOR_DEBUG` for tests.
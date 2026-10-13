# STUDY SURVIVOR — v7 Post-Battle Capture (2026-10-13)

GitHub Pages ready: open `index.html` through a static HTTP server / GitHub Pages. Local saves use the existing `studySurvivor.v1` localStorage key.

## Changed

- Removed wild Pokémon targeting and capture buttons from the live survivor battlefield. Combat now focuses on movement, type matchups, learned techniques, and switching among 3 party members.
- After the battle: **Stage Clear** offers 3 distinct capture candidates, **Game Over** offers up to 2 if any wild Pokémon were defeated, and **Retreat** offers none. Candidates are taken only from wild species defeated during that run; bosses never appear.
- Select **one** wild Pokémon and **one** capture ball to attempt a capture. The chosen ball is consumed on the attempt whether it succeeds or fails. Only one attempt is allowed per battle. Capture percentages vary with ball tier, Pokémon rarity, and performance. Master Ball always succeeds.
- Capture animations use 18×18 sharp pixel ball icons for ordinary, Great, Ultra, Master, and the five separate summon rarity balls. Post-battle animation flies in, absorbs the selected monster, shakes three times, and reveals success or escape. Skip is available.
- Capture ball rewards are granted after each battle (based on stage and result) and are separate from the study gacha. Gacha still gives exactly one Pokémon, without guaranteed rarity; optional TM bonus remains.
- Preserves existing 151-species data, Pokémon ownership sources (gacha vs wild), technical machines, type advantage, party switching, study questions and JSON/CSV import.

## Testing

`python test_v7.py` runs Chromium UI tests on mobile and desktop viewport sizes, covering start/battle, reward options, pixel balls, Master Ball capture, failed ordinary ball capture, one-attempt limit, and ordinary gacha behavior.
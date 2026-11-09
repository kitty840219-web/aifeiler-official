# Game feedback and QA

All 22 game pages share GameFeedback, the local sound preference, the large result dialog, and the replay event. No external sound files or paid APIs are required. Audio starts only after a user gesture. Closing or muting the sound does not block visual feedback.

- Success: positive cue and a large green confirmation; awarded points are shown when appropriate.
- Error: a different cue and a large red explanation, including remaining health where applicable.
- Miss: amber notice; non-penalized misses explicitly say so.
- Information: explains valid waiting states (flight, rolling, cooldown, or landing).
- Finish: score/statistics, actual reward, and replay or return-to-garden action. Tall dialogs initially focus the score rather than scrolling to the replay button.

Mobile-first controls and instructions preserve pointer, drag and keyboard alternatives. Game-board controls occupy their own layer above an overlapping social link; the social rail itself keeps its original position. Header and bottom navigation retain priority outside the game interaction region.

Verified in Chromium using a 390 by 844 touch viewport and browser-level touch events:
- Snake apple feedback, sound generation, mute persistence, collision score and replay.
- Memory matching and mismatch, all six pairs, reward and visible card art; mines safe first reveal, terminal score and replay; tic-tac-toe win and draw.
- Tiles full clear (360 points), tray overflow loss; moon nine-card finish; snack orders invalid flavor and all 15 valid orders.
- Ocean correct sequence and wrong sequence; solitaire illegal placement, draw, undo and manual settlement; garden insufficient balance, planting result and daily lock; stars touch positioning, reward calculation and settlement.
- Baseball/cricket missed balls and exhausted chances; gnome three flights; pony/popcorn timed or exhausted result; halloween wrong direction and terminal result; breakout dropped balls and terminal result.
- Maze pathfinding, star pickup, ghost collision and exhausted hearts; platform pickup, level progress, spike errors and exhausted hearts; petanque complete match through 13 points (130 score); island all three medals and a 155-point victory.

Pure engine checks cover hit/miss/error notices, wall-safe maze paths, destination stopping, manual override, jump controls, score effects and reduced motion. Build and lint run in the GitHub Pages workflow.

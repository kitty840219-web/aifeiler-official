# Aifeiler game scenes and touch controls

All 22 games use original character illustrations and original scene artwork generated for this site. Two background atlases have 3 columns and 4 rows each. The final two cells provide the hub and celebration scenes. Artwork contains no text. The atlas metadata lives in lib/games/backgrounds.ts. CSS backgrounds, SVG and canvas use the same cell ordering.

Movement controls:
- Snake: tap relative to the head to choose a direction; swipe, D-pad and keyboard remain. Immediate reverse turns remain prohibited.
- Maze: tap a destination for a breadth-first path through open corridors. Wall taps choose the closest reachable cell. Manual input cancels the path.
- Platform: tap a horizontal destination to walk; tap higher to jump. Obstacles may trigger a jump; normal collision, gravity and hazards remain.
- Stars, breakout and popcorn: tap a horizontal position; pony: tap a lane; island: tap a destination.
- Baseball/cricket: tap the field to hit. Gnome flight: tap to aim and launch. Petanque: tap a landing point to aim and throw.
- Halloween: tap a ghost to cast its direction, or tap a direction zone.
- Puzzle games retain direct card/cell/button taps. Two-player popcorn retains 1P button controls; field taps control 2P.

Animations include gentle character motion, swing/flight responses, score particles, touch sparkles, card entry and garden blooms. Paused canvas games freeze movement and effect time. Reduced-motion preference disables decorative motion and particles.

The generated PNG assets are uploaded in verified chunks to prevent truncation. Browser and CI checks verify complete image decoding, touch interaction, navigation, scoring and production export.

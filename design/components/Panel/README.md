# Panel

Glass panel that carries one topic: a title row, one main metric, an optional status chip and up to five rows.

Use `.rs-panel` for standard panels and `.rs-panel--compact` for single readouts. Nest secondary tiles in `.rs-well`. The consumer provides the title (sentence case, English), the icon (24-grid line icon) and real values from the simulation.

- Do: keep panels at the frame edges; one topic per panel; at most four panels per side in 16:9 and two in 9:16.
- Do: put an `rs-icon-btn--sm` with the arrow icon top right when the panel opens a detail view.
- Don't: place a panel over the centre of the scene, stack glass on glass more than one level deep, or add coloured side stripes.

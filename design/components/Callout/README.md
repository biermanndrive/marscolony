# Callout

Glass label pinned to an object in the scene (a building, a ship, a landing pad), with icon, label and value.

The consumer positions it in screen space from the object's projected position and may draw a dashed `hairline` leader line to the object. `.rs-callout__dot` appears for a few seconds after the value changed.

- Do: show at most three callouts at once; fade them with distance.
- Don't: cover the object itself; put more than one value in a callout.

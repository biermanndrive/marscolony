# TimelineDock

Dock at the bottom edge that shows a sequence: done steps with a check, the running step in live, upcoming steps empty.

Used for landing approaches (Entry, Belly flop, Powered descent, Landing burn, Touchdown), launches on Earth (Boarding, Fueling, Liftoff, Orbit) and the epoch track of the colony. The consumer provides the steps with name and T-minus time.

- Do: keep exactly one `--now` step; in 9:16 show only the current and the next step.
- Don't: add more than six steps.

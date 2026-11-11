# Metric

A measured value with its unit: label above, number in thin weight, unit smaller beside it.

`.rs-metric--xl` is reserved for the colonist counter and other hero numbers (one per view), plain `.rs-metric` for panel values, `.rs-metric--md` for corner readouts. `.rs-metric__rule` is the short rust line under the colonist counter.

- Do: always give a unit; animate changes by counting over `dur-count`; use English number formatting (1,284).
- Don't: bold the number or the unit; colour the number by status (use a chip next to it).

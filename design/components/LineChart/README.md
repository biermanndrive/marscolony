# LineChart

Thin line chart inside a panel: actual values as a solid `ink` line over a faint area, the plan dashed, milestone points in live and the newest value as a live endpoint.

The consumer provides the series, the axis labels (mono, `ink-faint`) and an English `aria-label` that states the trend.

- Do: label only two or three grid lines; end the x-axis on the current sol.
- Don't: use more than two series, fill under the plan, or draw axes as solid lines.

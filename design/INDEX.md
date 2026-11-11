# Designsprache der Benutzeroberfläche

Verbindliche Vorlage für alle Menüs, Statistiken, Panels und Steuerelemente in Mars-, Orbit- und Erdansicht. Dieselben Dateien bilden das Design-System-Artifact „Red Station One UI“ auf claude.ai.

| Datei | Inhalt |
|---|---|
| [`README.md`](README.md) | Grundsätze, Sprache im Bild, Farbe, Typografie, Bildaufbau für 9:16 und 16:9, die drei Szenen |
| `tokens.json` | alle Tokens (Farben je Szene-Theme `mars`, `orbit`, `earth`; Schrift, Abstände, Radien, Schatten, Blur, Dauern) |
| `tokens.css` | daraus erzeugte CSS-Variablen; Theme über `data-theme="orbit"` bzw. `"earth"` am Wurzelelement |
| `components/bundle.css` | Klassen der Bausteine (`rs-panel`, `rs-metric`, `rs-chip`, `rs-dock` …) |
| `components/<Name>/` | je Baustein eine Vorschau (`preview.html`) und Regeln (`README.md`) |
| `references/` | die Bildvorlagen, aus denen die Sprache abgeleitet ist; nur Stimmung, keine Inhalte übernehmen |

Einbau in den Prototyp: `tokens.css` und `components/bundle.css` laden, das HUD aus den `rs-*`-Klassen aufbauen und beim Szenenwechsel `data-theme` setzen. Schriften Outfit und JetBrains Mono kommen von Google Fonts.

## Bausteine

- [Callout](components/Callout/README.md): Beschriftung an einem Objekt der Szene
- [Controls](components/Controls/README.md): Schalter, Reiter und Regler
- [GuideReadout](components/GuideReadout/README.md): Hilfslinien mit Ablesungen
- [HudLayout](components/HudLayout/README.md): Bildaufbau für 9:16 und 16:9
- [IconButton](components/IconButton/README.md): runde Knöpfe und Navigationsgruppe
- [LineChart](components/LineChart/README.md): Liniendiagramm im Panel
- [Metric](components/Metric/README.md): Zahl mit Einheit
- [Panel](components/Panel/README.md): Glaspanel
- [RingGauge](components/RingGauge/README.md): Ringanzeige für Anteile
- [StatusChip](components/StatusChip/README.md): Zustand als Wort in einer Pille
- [TimelineDock](components/TimelineDock/README.md): Zeitleiste am unteren Rand
- [Toast](components/Toast/README.md): Einblendung bei Meilenstein oder Landung

Up: [README](../README.md)

Related: [Entscheidungen](../docs/entscheidungen.md), [Offene Punkte](../docs/offene-punkte.md)

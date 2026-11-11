# Designsprache der Benutzeroberfläche

Verbindliche Vorlage für alle Menüs, Statistiken, Panels und Steuerelemente in Mars-, Orbit- und Erdansicht. Dieselben Dateien bilden das Design-System-Artifact „Red Station One UI“ auf claude.ai.

| Datei | Inhalt |
|---|---|
| `README.md` | Grundsätze, Sprache im Bild, Farbe, Typografie, Bildaufbau für 9:16 und 16:9, die drei Szenen |
| `tokens.json` | alle Tokens (Farben je Szene-Theme `mars`, `orbit`, `earth`; Schrift, Abstände, Radien, Schatten, Blur, Dauern) |
| `tokens.css` | daraus erzeugte CSS-Variablen; Theme über `data-theme="orbit"` bzw. `"earth"` am Wurzelelement |
| `components/bundle.css` | Klassen der Bausteine (`rs-panel`, `rs-metric`, `rs-chip`, `rs-dock` …) |
| `components/<Name>/` | je Baustein eine Vorschau (`preview.html`) und Regeln (`README.md`) |
| `references/` | die Bildvorlagen, aus denen die Sprache abgeleitet ist; nur Stimmung, keine Inhalte übernehmen |

Einbau in den Prototyp: `tokens.css` und `components/bundle.css` laden, das HUD aus den `rs-*`-Klassen aufbauen und beim Szenenwechsel `data-theme` setzen. Schriften Outfit und JetBrains Mono kommen von Google Fonts.

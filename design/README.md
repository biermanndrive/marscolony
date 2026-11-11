Die Oberfläche von Red Station One schwebt als getöntes Glas über der lebenden 3D-Welt. Die Szene ist das Bild, die Bedienelemente sind Instrumente davor: dünne Schrift, große ruhige Zahlen, wenige Panels an den Rändern, ein einziges leuchtendes Element pro Ansicht. Dieselbe Sprache gilt für Mars, Orbit und Erde; nur die Tönung des Glases wechselt mit der Szene.

## Grundsätze

- **Die Szene bleibt frei.** Panels sitzen an den Rändern und in Spalten, die Mitte des Bildes gehört der Kolonie, dem Schiff oder dem Planeten. Im 9:16-Video bleiben mindestens die mittleren 60 % der Höhe frei, im 16:9-Video das mittlere Drittel der Breite.
- **Instrument, nicht Webseite.** Jede Zahl ist eine Messung mit Einheit (`colonists`, `km`, `m/s`, `kW`, `%`, `sol`). Keine Fülltexte, keine erfundenen Werte: angezeigt wird, was die Simulation wirklich rechnet.
- **Ein Licht pro Ansicht.** `live` markiert genau ein Element: den aktiven Navigationsknopf, den laufenden Schritt der Zeitleiste oder den nächsten Meilenstein. Zwei leuchtende Dinge nebeneinander heben sich gegenseitig auf.
- **Farbe bedeutet Zustand.** `ok`, `warn` und `risk` erscheinen nur zusammen mit einem Wort (`Stable`, `Watch`, `Critical`). Die Markenfarbe `rust` bleibt klein: Zählerlinie, Flammen, Schieberegler.
- **Szenen teilen alles außer der Tönung.** Themes `mars` (Standard), `orbit` und `earth` ändern `glass`, `scene-*` und den Ton der Neutralfarben. Signalfarben, Typografie, Abstände und Formen bleiben gleich.

## Sprache im Bild

Alle Texte, die im Video zu sehen sind, sind englisch; Bedienoberflächen außerhalb des Videos (Panel des Prototyps, Einstellungen) dürfen deutsch sein.

- Satzanfang groß, sonst klein: `Mission risk forecast`, `Next milestone`, `Landing burn`.
- Großbuchstaben nur im `eyebrow` und im `wordmark`: `EPOCH II`, `RED STATION ONE`.
- Zahlen im englischen Format: `1,284 colonists`, `96.8 %` wird als `96.8` plus Einheit `%` gesetzt.
- Kurz und messend: `Landing in 02h 14m`, `Greenhouse 3 at 52`, `+1 colonist`. Keine Ausrufezeichen, keine Emoji.
- Keine Herstellernamen oder Logos im Bild. Schiffe heißen `Starship` als Typbezeichnung und tragen eigene Kennungen (`SN-41`); der Kanalname steht im `wordmark`.

## Farbe

- Panels: `glass` mit `blur-glass` und 1px `glass-edge`, Schatten `shadow-panel`. Menüs und das Einstellungsblatt: `glass-strong` mit `blur-strong`.
- Verschachtelte Flächen im Panel (Kachel, gehobene Zeile, inaktiver Knopf): `glass-raised`.
- Text: `ink` für Werte und Titel, `ink-muted` für Beschriftungen und Einheiten, `ink-faint` nur für Achsen und Ticks.
- Hilfslinien über der Szene und Rasterlinien in Diagrammen: `hairline`, gestrichelt.
- Markenakzent `rust` (Kolonie, Flamme, Regler) gegen `cool` (Transfer, Orbitbahnen, Schiffe unterwegs).
- Fokus: 2px `focus-ring`, 2px Abstand, auf jedem bedienbaren Element.

## Typografie

- Eine Familie für alles: `sans` (Outfit) in den Gewichten 200 bis 500. Daten im Bild (Koordinaten, T-minus, Kennungen, Sol-Zähler) in `mono` (JetBrains Mono).
- Ansichtstitel in `display` (Gewicht 200), höchstens einer pro Bild.
- Der Kolonistenzähler und andere Hauptzahlen in `metric-xl`; Panelwerte in `metric-lg`, kleine Ablesungen in `metric-md`. Die Einheit steht in `metric-unit` direkt dahinter, nie fett.
- Ziffern immer tabellarisch (`font-variant-numeric: tabular-nums`), damit zählende Zahlen nicht springen.
- Paneltitel in `title`, Beschriftungen in `label`, Fließtext in Callouts in `body`.

## Formen und Abstände

- Panels `radius-lg`, kompakte Panels und Callouts `radius-md`, Kacheln im Panel `radius-sm`, Chips, Knöpfe und die Navigationsgruppe `radius-pill`.
- Innenabstand `space-4` (große Panels `space-5`), Abstand zwischen Panels `space-3`.
- Abstand des HUD vom Bildrand: `space-6` ab 1080p, `space-4` auf dem Telefon, jeweils plus Safe-Area.
- Hilfslinien laufen von einem Szenenobjekt zum Callout; der Callout trägt einen kleinen `live`-Punkt, wenn sein Wert gerade aktualisiert wurde.

## Aufbau des Bildes

Drei Formate, dieselben Zonen:

| Zone | 9:16 (Shorts, Reels, TikTok) | 16:9 (YouTube) |
|---|---|---|
| Marke und Ort | oben links: `wordmark`, darunter Ort in `mono` | oben links |
| Navigation | wird ausgeblendet | oben mittig als `NavCluster` |
| Hauptzahl | unten links: Kolonisten in `metric-xl`, Epoche als Chip, nächster Meilenstein | oben rechts als Ablesung |
| Panels | höchstens zwei, unten rechts gestapelt | Spalten links und rechts, je drei bis vier |
| Zeitleiste | unten, eine Zeile, nur aktueller und nächster Schritt | unten über die ganze Breite (`TimelineDock`) |
| Einblendungen | oberes Drittel, mittig (`Toast`) | oberes Drittel, mittig |

Für Aufnahmen blendet `H` alle Anzeigen aus; Panels erscheinen mit `dur-panel` und zählende Werte laufen über `dur-count`. Bei `prefers-reduced-motion` stehen alle Dauern auf 0.

## Die drei Szenen

- **Mars** (`mars`): rostbraunes Glas, warme Neutrale. Panels: Kolonisten, Epoche und nächster Meilenstein, Versorgung (Energie, Wasser, Sauerstoff, Nahrung als Prozent über Bedarf), Wetter (Staub, Wind, Sol-Zeit), Landeanflug mit Zeitleiste `Entry → Powered descent → Landing burn → Touchdown`.
- **Orbit/Transfer** (`orbit`): fast schwarzes, kühles Glas. Panels: Schiffe unterwegs mit Kennung und Ankunftszeit, Transferfenster, Flugbahn-Callouts an den Schiffen in `cool`.
- **Erde** (`earth`): blaugraues Glas über Himmel und Wald. Panels: Warteschlange und Tickets, Abflugtafel, Countdown bis 18:00 Uhr, Zeitleiste `Boarding → Fueling → Liftoff → Orbit`.

## Ikonografie

Linienicons, 1,5px Strich, runde Enden, ohne Füllung, auf 24er-Raster, in 16 bis 18px angezeigt. Ein eigenes Set liegt noch nicht vor; bis dahin gelten die Formen aus den Vorschauen dieses Systems (Gitter, Fahne, Stern, Teleskop, Rakete, Haus, Blitz, Tropfen). Ein Icon steht nie allein für einen Zustand.

## Was es nicht gibt

Keine Verläufe auf Panels, keine farbigen Randstreifen an Karten, keine Neonleuchten außer dem einen `live`-Element, keine vollflächig deckenden Panels über der Szenenmitte, keine Firmenlogos.

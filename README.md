# Red Station One

Arbeitsstand eines Social-Media-Projekts: eine Marskolonie, die mit jedem Follower wächst (1 Follower = 1 Kolonist). Der Kanalname ist noch offen, „Red Station One“ ist der Arbeitstitel.

Das Repository enthält den Browser-Prototyp, die Geländedaten, alle bisher gebauten 3D-Modelle samt den Skripten, aus denen sie entstehen, und eine Zusammenfassung der Planung.

## Inhalt

| Ordner | Inhalt |
|---|---|
| `prototype/` | Three.js-Prototyp (`index.html`, eine Datei) mit den drei Szenen Erde, Transfer und Mars. `history/` enthält die Vorversionen 1 bis 4. |
| `terrain/` | Umwandlungsskript für das HiRISE-Höhenmodell von Arcadia Planitia und die daraus erzeugte Höhenkarte. |
| `models/src/` | Bauskripte der 3D-Modelle (JavaScript für die Geometrie, Python für Export und Vorschau). |
| `models/glb/` | Fertige Modelle als GLB, sortiert nach Mars-Epoche 0–I, Mars-Epoche II, Erde und Orbit. |
| `models/previews/` | Übersichtsbilder der Modellpakete. |
| `docs/` | Entscheidungen, Modellstand und offene Punkte. |

## Prototyp starten

`prototype/index.html` im Browser öffnen. Die Seite lädt Three.js r128 von cdnjs und jsDelivr, braucht also eine Internetverbindung. Der Prototyp verwendet noch Platzhalterformen; die GLB-Modelle sind noch nicht eingebaut.

Tasten: `1` `2` `3` wechseln die Szene, `H` blendet die Anzeigen im Bild aus, `M` den Menü-Knopf. Kamera in der Mars-Szene mit Maus sowie `W` `A` `S` `D`, `Q`, `E`.

## Modelle neu erzeugen

Siehe `models/README.md`.

## Planungsdokument

Das vollständige Konzept (Epochen, Meilensteine, Modellliste mit Prompts, Monetarisierung, Szenen, Entscheidungen) liegt als Claude-Doc vor und ist hier nicht als Datei enthalten. `docs/` fasst den Stand zusammen.

## Hinweise

- Die Modelle sind per Code modelliert, nicht mit einem KI-3D-Generator. Sie sind für die Stadtansicht gedacht; aus der Nähe wirken vor allem Figuren und Gesichter vereinfacht.
- Raketen und Raumschiffe orientieren sich an realen Typen, tragen aber keine Logos oder Schriftzüge. Vor einer Veröffentlichung ist die Markenfrage zu prüfen (siehe `docs/offene-punkte.md`).
- Geländedaten: NASA/JPL/University of Arizona, HiRISE-Höhenmodell `DTEEC_060706_2195_060416_2195_A01`.

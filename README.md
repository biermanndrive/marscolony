# Red Station One

Arbeitsstand eines Social-Media-Projekts: eine Marskolonie, die mit jedem Follower wächst (1 Follower = 1 Kolonist). Der Kanalname ist noch offen, „Red Station One“ ist der Arbeitstitel.

Das Repository enthält den Browser-Prototyp, die Geländedaten, alle bisher gebauten 3D-Modelle samt den Skripten, aus denen sie entstehen, und eine Zusammenfassung der Planung.

## Inhalt

| Ordner | Inhalt |
|---|---|
| [`prototype/`](prototype/index.html) | Three.js-Prototyp (`index.html`, eine Datei) mit den drei Szenen Erde, Transfer und Mars. `history/` enthält die Vorversionen 1 bis 4. |
| `terrain/` | Umwandlungsskript für das HiRISE-Höhenmodell von Arcadia Planitia und die daraus erzeugte Höhenkarte. |
| [`models/src/`](models/README.md) | Bauskripte der 3D-Modelle (JavaScript für die Geometrie, Python für Export und Vorschau). |
| `models/glb/` | Fertige Modelle als GLB, sortiert nach Mars-Epoche 0–I, Mars-Epoche II, Erde und Orbit. |
| `models/web/` | Dieselben Modelle für den Browser zusammengefasst und verkleinert (aus `models/tools/optimize.mjs`). Der Prototyp lädt sie von hier. |
| `models/previews/` | Übersichtsbilder der Modellpakete. |
| [`design/`](design/INDEX.md) | Designsprache der Oberfläche: Tokens, Bausteine und Regeln für Mars, Orbit und Erde (siehe [design/INDEX.md](design/INDEX.md)). |
| [`docs/`](docs/INDEX.md) | Entscheidungen, Modellstand, offene Punkte und der Aufbau der Mars-Szene. |

## Prototyp starten

Der Prototyp lädt die Modelle aus `models/web/` und braucht deshalb einen lokalen Webserver; direkt als Datei geöffnet blockiert der Browser das Laden. Im Hauptordner des Repositorys:

```
python3 -m http.server 8000
```

Dann http://localhost:8000/prototype/ öffnen. Three.js r128 kommt von cdnjs und jsDelivr, es braucht also eine Internetverbindung.

Die Mars-Szene zeigt die Modelle der Epochen 0 bis II nach dem Meilenstein-Katalog und den Wachstumsformeln; Erdhafen und Transfer nutzen noch Platzhalter. Aufbau und Zeitpunkte stehen in [docs/mars-szene.md](docs/mars-szene.md).

Tasten: `1` `2` `3` wechseln die Szene, `H` blendet die Anzeigen im Bild aus, `M` den Menü-Knopf. Kamera in der Mars-Szene mit Maus sowie `W` `A` `S` `D`, `Q`, `E`. Für Aufnahmen: `?mars=80` in der Adresse setzt die Einwohnerzahl beim Start, in der Konsole `RSO.setMars(n)` und `RSO.land('crew')`.

## Modelle neu erzeugen

Siehe [models/README.md](models/README.md).

## Planungsdokument

Das vollständige Konzept (Epochen, Meilensteine, Modellliste mit Prompts, Monetarisierung, Szenen, Entscheidungen) liegt als Claude-Doc vor und ist hier nicht als Datei enthalten. `docs/` fasst den Stand zusammen.

## Hinweise

- Die Modelle sind per Code modelliert, nicht mit einem KI-3D-Generator. Sie sind für die Stadtansicht gedacht; aus der Nähe wirken vor allem Figuren und Gesichter vereinfacht.
- Raketen und Raumschiffe orientieren sich an realen Typen, tragen aber keine Logos oder Schriftzüge. Vor einer Veröffentlichung ist die Markenfrage zu prüfen (siehe [docs/offene-punkte.md](docs/offene-punkte.md)).
- Geländedaten: NASA/JPL/University of Arizona, HiRISE-Höhenmodell `DTEEC_060706_2195_060416_2195_A01`.

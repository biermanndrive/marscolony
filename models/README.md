# 3D-Modelle

Jedes Modell entsteht aus Code: Eine JavaScript-Datei baut die Geometrie mit Three.js r128, ein Python-Skript lädt sie in einen Browser ohne Fenster, exportiert sie als GLB, liest die Datei wieder ein und rendert daraus Vorschaubilder.

Einheiten sind Meter, Y zeigt nach oben. Bodenmodelle haben ihren Ursprung mittig am Boden, Orbitmodelle in ihrem Mittelpunkt.

## Voraussetzungen

- Node.js, dann im Ordner `models/`: `npm install` (lädt three 0.128.0)
- Python 3 mit `playwright` und `pillow`, dazu `playwright install chromium`

Liegt Three.js woanders, zeigt die Umgebungsvariable `THREE_DIR` auf den Paketordner.

## Bauen

Im Ordner `models/src/`:

```
python3 build8.py
python3 sheet.py ../build/out8 preview 4
```

Die Ergebnisse landen in `models/build/` (nicht versioniert). Die fertigen Dateien in `models/glb/` wurden von dort einsortiert.

## Dateien

| Skript | Quelle | Inhalt |
|---|---|---|
| `build.py` | `habitat.js` | W01, W02 Röhrenhabitate |
| `build2.py` | `kit.js`, `batch2.js` | W04, W05, E01, E03, E08, E09, E11, E12, E14, E16 |
| `build3.py` | zusätzlich `batch3.js` | Varianten zu Paket 2 |
| `build4.py` | `batch4.js` | I01, I03, R01, R03, Z01, P01–P04, P06 |
| `build5.py` | `batch5.js` | P07, P08, P11, V01, V02, V11, D01, D02 und die erste Fassung von C01, C02 |
| `build6.py` | `batch6.js` | C01, C02 Kolonist im Raumanzug (aktuelle Fassung) |
| `build7.py` | `batch7.js` | D03–D22 Dekoration der Epoche 0–I |
| `build8.py` | `habitat.js`, `batch8.js` | Epoche II: W03, W06, E02, E04, E10, E13, E17, A01, A02, A06 |
| `build9.py` | `batch9.js` | Epoche II: I02, I04, Z02, Z03, P05, P09, P15, V03, V12, V13 |
| `build10.py` | `batch10.js` | Epoche II: V15, V16, D14, D15, D20 und die erste Fassung von C03 |
| `build11.py` | `batch11.js` | C03 Kolonist innen (aktuelle Fassung) |
| `build12.py` | `batch4.js`, `batch12.js` | Erde und Orbit: EA01–EA05, OR01 |
| `build13.py` | `batch13.js` | Erde und Orbit: EA06–EA11, OR02–OR05 |

`kit.js` enthält die gemeinsamen Bausteine: Materialien, die verwitterte Hüllentextur mit Normal-Map und Hilfsfunktionen für Zylinder, Streben und Quader.

Die Nummern (W01, E03 …) entsprechen der Modellliste im Planungsdokument. Die Kürzel EA (Erde) und OR (Orbit) sind dort noch nicht eingetragen.

## Bekannte Schwächen

- `W01`/`W02` in `glb/` stammen aus einer früheren Fassung mit größeren Texturen (4 bis 7 MB je Datei). `build.py` erzeugt inzwischen kleinere.
- Die Luken der Kommandozentrale `Z01` liegen etwa 0,5 m tiefer als die der Röhrenhabitate.
- Die Endkappen von `W01`/`W02` sind glatt, die Hülle ist gerippt.
- Figuren haben kein Skelett und lassen sich noch nicht animieren.
- Viele Modelle bestehen aus über hundert Einzelteilen und sollten vor dem Einbau in den Prototyp zusammengefasst werden.

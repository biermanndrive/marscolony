# Mars-Szene

Stand 11.11.2026. Die Mars-Szene in `prototype/index.html` zeigt die gebauten Modelle der Epochen 0 bis II (0 bis 99 Einwohner). Ab 100 Einwohnern wechselt die Anzeige auf Epoche III, die Stadt wächst aber erst weiter, wenn deren Modelle fertig sind.

## Lageplan

Einheiten in Metern, Kern im Ursprung, +z zeigt nach Norden.

| Bereich | Lage | Inhalt |
|---|---|---|
| Kern | Ursprung | Kommandozentrale Z01, Tunnel zu den ersten Habitaten, Lebenserhaltung, Frachtkisten |
| Wohnen | Nordosten, Richtung Krater | Röhrenhabitate, ab Epoche II eingegrabene Habitate W06 in Reihen, Habitatblock für 25 |
| Agrar | Nordwesten | Bogengewächshäuser, Kuppelfarmen |
| Energie | Westen | Solarfelder (4 Reihen × 5 Spalten), Batteriebänke, Reaktor rund 200 m entfernt hinter eigenem Erdwall |
| Abbau und Treibstoff | Südwesten | Eisbohrstellen, Treibstoffanlage, Tanks, Wasseraufbereitung, Förderleitung |
| Industrie und Logistik | Südosten | Rovergarage, Werkstatt, Lagerhalle, Fahrzeuge |
| Raumhafen | Süden, rund 200 m | Landeplatz 1 mit Frachtschiff, Standplatz des zweiten Frachtschiffs, Landeplatz 2 |

Zwischen Kern und Raumhafen liegen zwei versetzte Regolith-Schutzwälle (Radius 150 m und 180 m, 7 m hoch). Die Piste läuft im Zickzack durch den Spalt, so dass kein gerader Weg für aufgewirbelten Regolith zum Kern bleibt. Landeplätze, Schiffsstandplatz und Reaktor stehen auf eingeebnetem Gelände.

## Meilensteine

Jeder Meilenstein aus dem Planungsdokument bekommt einmalig einen Zeitpunkt innerhalb seiner Einwohnerspanne. Der Wert wird aus dem Namen des Meilensteins berechnet und ist deshalb bei jedem Laden gleich; Voraussetzungen schieben ihn bei Bedarf nach hinten.

| Einwohner | Meilenstein | Modell | Lage x / z |
|---|---|---|---|
| 0 | Command hub | `Z01_command_hub` | 0 / 0 |
| 0 | Landing pad 1 | `R01_landing_pad_simple` | -45 / -196 |
| 0 | Rover | `V01_open_rover_orange` | -5 / -15 |
| 0 | Solar field 1 | `E01_solar_blanket_20m` | -47 / -24 |
| 0 | Supply crates | `D03_cargo_container_6m` | 13 / -15 |
| 1 | First habitat | `W01_dust1_clean` | 14 / 0 |
| 4 | Battery bank | `E03_battery_bank` | -32 / -26 |
| 4 | Gas and liquid tanks | `E08_sphere_tank_oxygen` | -24 / -44 |
| 7 | Ice drill | `E11_ice_drill_rig` | -60 / -55 |
| 8 | Fuel plant | `E12_fuel_plant_small` | -40 / -75 |
| 10 | Life support module | `E16_life_support_module` | 13 / 10 |
| 12 | Habitat for 5 | `W02_sideport` | 0 / 16 |
| 16 | Rover garage | `I01_rover_garage_1door` | 26 / -24 |
| 19 | Habitat cluster for 10 | `W04_node_4ports` | -8 / 16 |
| 20 | Second cargo ship lands | `R03_starship_landed_cargo` | 14 / -232 |
| 27 | Greenhouse | `A01_arched_greenhouse_10m` | -24 / 34 |
| 30 | Radar and comms station | `E17_communication_station` | -52 / -34 |
| 40 | Regolith excavator | `V03_regolith_excavator` | 22 / 7 |
| 40 | Workshop with 3D printer | `I02_workshop_3d_printer` | 58 / -28 |
| 50 | Reactor module 1 | `E04_fission_reactor_small` | -185 / 75 |
| 52 | Water treatment | `E13_water_treatment` | -74 / -84 |
| 55 | Greenhouses 2 and 3 | `A01_arched_greenhouse_14m` | -24 / 44 |
| 62 | Storage hall | `I04_arched_hall_3seg` | 40 / -56 |
| 65 | Canteen | `Z02_canteen` | -17 / -17 |
| 70 | Dome farm | `A06_greenhouse_dome_12m` | -74 / 58 |
| 76 | Medical station | `Z03_medical_station` | -17 / -36 |
| 89 | Habitat block for 25 | `W04_node_4ports` | 36 / 34 |
| 91 | Ice drill 2 with pipeline | `E11_ice_drill_rig_stage2` | -114 / -92 |
| 98 | Landing pad 2 | `R01_landing_pad_simple` | 60 / -196 |

Weitere Ereignisse: Mit 43 Einwohnern werden die ersten Habitate mit Regolith abgedeckt (W01/W02 wechseln zu W06). Mit 23 und 44 Einwohnern setzen die frühen Habitate sichtbar Staub an.

## Wachstumsformeln

| Bauwerk | Regel |
|---|---|
| Wohnen | Kapazität immer mindestens Einwohner plus 10 %. Fehlt Platz, kommt in Epoche I ein W02 (5 Plätze), in Epoche II ein W06 (6 Plätze). |
| Solarfelder | ein Feld je 5 Kolonisten; Epoche I ausgerollte Folien E01, Epoche II aufgeständerte Reihen E02 |
| Batteriebänke | eine je 2 Solarfelder |
| Tankgruppen | eine je 40 Kolonisten |
| Fahrzeuge | eins je 8 Kolonisten |
| Gewächshäuser | ab 25 Einwohnern eins, danach eins je 7 weitere Kolonisten |
| Figuren | ein Kolonist im Raumanzug je 10 Einwohner |
| Kleinteile | jeder Follower ohne eigenes Bauwerk bringt ein Detail: Kiste, Fass, Antenne, Mast, Kabeltrasse und Ähnliches |

## Landungen

Jedes ankommende Schiff aus der Simulation landet auf Landeplatz 2 (vor dessen Bau auf dem eingeebneten Platz). Bei geöffneter Mars-Szene sinkt es mit Triebwerksflamme ab, im Aufnahmemodus fliegt die Kamera mit. In der Kamera-Leiste springt „Landeplatz“ zum Raumhafen.

## Steuerung für Aufnahmen

- `index.html?mars=80` startet mit 80 Kolonisten auf dem Mars.
- In der Browser-Konsole: `RSO.setMars(60)` setzt die Einwohnerzahl, `RSO.land('crew')` oder `RSO.land('cargo')` löst eine Landung aus, `RSO.scene('earth')` wechselt die Szene.

Related: [Entscheidungen](entscheidungen.md), [Modellstand](modellstand.md), [3D-Modelle](../models/README.md)

# Open issues

## Offene Fragen

- Was sind die Optionen für "Mitgliedschaft ab dem.."? Geht jeder beliebige Tag? Oder Beispielsweise jeweils der erste und der 15. eines Monats?
- Wollen wir es wirklich ermöglichen online Mitgliedschaften für andere abzuschließen? Klingt für mich nach Missbrauchspotential
- Für BIC und IBAN könnte ich noch eine Formatsvalidierung einführen. Hier bin ich mir aber nicht sicher was gültige Formate sind, deswegen
  sollte man das bei Problemen im Nachgang über eMail/Telefon machen
- Für die Telefonnummer habe ich ebenfalls keine Validierung hinterlegt, hier gibt es zu viele Formate
- Soll die Bestätigungsseite angezeigt werden? Oder soll der Antrag jeweils direkt abgeschickt werden?

## Details zur Umsetzung

- nach dem ersten klick auf "Weiter" wird die live validierung aktiviert
- wenn auf "Weiter" geklickt wird und keine validierungsfehler vorhanden sind kommt eine seite zur Überprüfung
- eMail und Telefonnummer sind nur für das erste Mitglied notwendig
- Bei der Familienmitgliedschaft können Mitglieder hinzugefügt und entfernt werden (Mitglied 1 nicht!)
  - wenn ein neues Mitglied hinzugefügt wird werden Nachname und Adresse übernommen
- Was sind Pflichtfelder? Ich habe einen best gues implementiert und folgende Felder zu Pflichtfeldern gemacht:
  - Wer
  - Wann
  - Art
  - Abteilung (mindestes eine Wahl)
  - Mitglieder Daten
    - Anrede?
    - Vorname
    - Nachname
    - Geburtsdatum
    - Straße
    - Hausnummer
    - Telefonnummer (bei familienmitgliedschaft nur für erstes Mitglied!)
    - eMail (bei familienmitgliedschaft nur für erstes Mitglied!)
  - SEPA
  - Datenschutz
  - Publikationen

Validierung der Werte: (nicht nur "Gesetzt oder nicht gesetzt")

- Mitglieder Daten
  - eMail
  - Geburtsdatum (Plausibilitätscheck fehlt; Daten in der Zukunft und aus dem Mittelalter sind aktuell möglich)

# Adil's Bar – Cocktail-App

Web-App mit Cocktailrezepten, die Schritt für Schritt und freihändig durch die Zubereitung führt. Gedacht für die Bar zu Hause und die Gastronomie, später auch für Smart Glasses.

**App öffnen:** `index.html` leitet auf die aktuelle Version [`v7-amber.html`](v7-amber.html) weiter. Mit GitHub Pages: https://ad8083-afk.github.io/adilsbar/

## Funktionen (Version 7)
- 41 Drinks: Klassiker, Modern, Exotisch & Tiki, Highballs & Longdrinks, Alkoholfrei
- Geschmacks-Finder: Geschmack, Spirituose (Rum, Gin, Wodka, Tequila, Mezcal, Whiskey, Cognac & Brandy, Pisco, Cachaça, Likör, Bitter, Wermut, Prosecco), Alkoholgehalt und Stil wählen, die passendsten Drinks erscheinen mit Prozent-Passung
- Zufallsmodus im Tinder-Stil: wischen, Herz öffnet das Rezept
- Zubereitungsmodus mit Auto-Weiter, Vorlesen, Sprachbefehlen und Wach-Modus
- Bestellungen mit Gesamtdauer und Playlist, die alle Drinks nacheinander abspielt
- Alkoholgehalt pro Drink (Schätzung). Wer fährt, trinkt nicht.
- Installierbar als Web-App auf iPhone und Android, funktioniert offline

## Aufbau
- `v1-…` bis `v7-….html`: Design-Varianten, `v7-amber.html` ist der Favorit
- `daten/rezepte.js`: Rezepte, `daten/kern.js` und `daten/kern.css`: gemeinsamer Kern
- `bilder/`: Fotos
- Produktanforderungen und Entscheidungen: nicht im öffentlichen Repo, liegen bei Maik in Google Drive

Kein Build nötig, reines HTML, CSS und JavaScript. Lokal per Doppelklick oder mit `python -m http.server` starten.

## Quellen und Lizenzen
- Rezepte nach IBA-Spezifikationen, Daten über [rasmusab/iba-cocktails](https://github.com/rasmusab/iba-cocktails) (CC BY 4.0), auf Deutsch aufbereitet. Hausrezepte sind gekennzeichnet.
- Fotos von Wikimedia Commons unter freien Lizenzen (CC0, CC BY, CC BY-SA). Autor, Lizenz und Quelle stehen bei jedem Rezept in der App und in `daten/rezepte.js`.

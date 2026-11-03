#!/usr/bin/env node
/* Fügt neue Rezepte aus einer JSON-Datei (Array) in daten/rezepte.js ein, prüft sie und zählt VERSION in sw.js hoch.
   Aufruf im Projektordner: node werkzeuge/neue-rezepte.js neue.json
   Jedes Rezept landet hinter dem letzten Rezept seiner Kategorie. Fotos unter bilder/<id>.jpg werden in BILDER (sw.js) eingetragen. */
const fs = require("fs");
const path = require("path");

const wurzel = path.join(__dirname, "..");
const datei = (p) => path.join(wurzel, p);
const quelle = process.argv[2];
if (!quelle) { console.error("Aufruf: node werkzeuge/neue-rezepte.js neue.json"); process.exit(1); }

global.window = {};
require(datei("daten/rezepte.js"));
const { REZEPTE, KATEGORIEN } = window;
const neu = JSON.parse(fs.readFileSync(path.resolve(quelle), "utf8"));
if (!Array.isArray(neu) || !neu.length) { console.error("Die JSON-Datei muss ein nicht leeres Array von Rezepten enthalten."); process.exit(1); }

const kern = fs.readFileSync(datei("daten/kern.js"), "utf8");
const block = (name) => (kern.match(new RegExp("Bar\\." + name + " = \\[([\\s\\S]*?)\\];")) || [, ""])[1];
const ids = (name) => [...block(name).matchAll(/id: "([^"]+)"/g)].map((m) => m[1]);
const BASIS = ids("BASIS"), GESCHMACK = ids("GESCHMACK"), STIL = [...ids("STIL"), "alkoholfrei"];
const KAT = KATEGORIEN.map((k) => k.id);
const PFLICHT = ["id", "name", "kategorie", "glas", "technik", "staerke", "zeit", "geschmack", "beschreibung", "garnitur", "zutaten", "schritte", "quelle", "hinweis", "bild", "credit", "profil", "basis", "stil"];

const fehler = [];
const vorhanden = new Set(REZEPTE.map((r) => r.id));
const namen = new Set(REZEPTE.map((r) => r.name.toLowerCase()));
for (const r of neu) {
  const f = (t) => fehler.push(`${r.id || "?"}: ${t}`);
  for (const k of PFLICHT) if (!(k in r)) f(`Feld "${k}" fehlt`);
  if (!/^[a-z0-9-]+$/.test(r.id || "")) f("id nur aus a-z, 0-9 und Bindestrich");
  if (vorhanden.has(r.id)) f("id gibt es schon");
  if (namen.has((r.name || "").toLowerCase())) f("Name gibt es schon");
  vorhanden.add(r.id); namen.add((r.name || "").toLowerCase());
  if (!KAT.includes(r.kategorie)) f(`kategorie "${r.kategorie}" unbekannt (${KAT.join(", ")})`);
  if (!["Bauen", "Rühren", "Shaken", "Mixen"].includes(r.technik)) f(`technik "${r.technik}" unbekannt`);
  for (const z of r.zutaten || []) {
    if (typeof z.n !== "string" || typeof z.v !== "number") f(`Zutat ohne n oder v: ${JSON.stringify(z)}`);
    if (z.e !== "ml" && z.m != null && typeof z.ml !== "number") f(`Zutat "${z.n}" ohne ml-Angabe`);
  }
  for (const s of r.schritte || []) for (const i of s.z || []) if (!r.zutaten[i]) f(`Schritt "${s.t}" verweist auf Zutat ${i}, die es nicht gibt`);
  for (const [k, v] of Object.entries(r.profil || {})) if (!GESCHMACK.includes(k) || !(v >= 0 && v <= 3)) f(`profil "${k}: ${v}" ungültig`);
  for (const b of r.basis || []) if (!BASIS.includes(b)) f(`basis "${b}" fehlt in Bar.BASIS (daten/kern.js), dort zuerst ergänzen`);
  for (const s of r.stil || []) if (!STIL.includes(s)) f(`stil "${s}" unbekannt`);
  const alkoholfrei = (r.zutaten || []).every((z) => !z.v);
  if (r.kategorie === "alkoholfrei" && (!alkoholfrei || r.staerke !== 0 || (r.basis || []).length)) f("alkoholfrei: staerke 0, basis leer, alle Zutaten v: 0");
  if (r.quelle === "Hausrezept" && !r.hinweis) f("Hausrezept braucht einen hinweis");
  if (r.bild && !fs.existsSync(datei(r.bild))) f(`Foto ${r.bild} fehlt`);
  if (r.bild && !(r.credit && r.credit.autor && r.credit.lizenz && r.credit.quelle)) f("Foto ohne vollständigen credit (autor, lizenz, quelle)");
}
if (fehler.length) { console.error("Nicht eingefügt:\n- " + fehler.join("\n- ")); process.exit(1); }

for (const r of neu) {
  let pos = -1;
  REZEPTE.forEach((x, i) => { if (x.kategorie === r.kategorie) pos = i; });
  REZEPTE.splice(pos < 0 ? REZEPTE.length : pos + 1, 0, r);
}
const kopf = fs.readFileSync(datei("daten/rezepte.js"), "utf8").split("\n")[0];
fs.writeFileSync(datei("daten/rezepte.js"), `${kopf}\nwindow.KATEGORIEN = ${JSON.stringify(KATEGORIEN, null, 1)};\nwindow.REZEPTE = ${JSON.stringify(REZEPTE, null, 1)};\n`);

let sw = fs.readFileSync(datei("sw.js"), "utf8");
sw = sw.replace(/const VERSION = "adilsbar-(\d+)";/, (_, n) => `const VERSION = "adilsbar-${+n + 1}";`);
for (const r of neu) if (r.bild && !sw.includes(`'./${r.bild}'`)) sw = sw.replace("const BILDER = [", `const BILDER = [   './${r.bild}',`);
fs.writeFileSync(datei("sw.js"), sw);

console.log(`${neu.length} Rezepte eingefügt (${neu.map((r) => r.name).join(", ")}). Jetzt ${REZEPTE.length} Rezepte. ${sw.match(/const VERSION = "[^"]+"/)[0]}`);

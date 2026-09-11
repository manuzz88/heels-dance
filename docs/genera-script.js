#!/usr/bin/env node
/*
  Re-incorpora i testi di docs/copy.it.json, copy.en.json e copy.ru.json nel blocco I18N di script.js.
  Uso (dalla cartella del sito):   node docs/genera-script.js
  Non tocca CONFIG né la logica: sostituisce solo il blocco "const I18N = {...};".
  Nessuna dipendenza: serve solo Node.js (qualsiasi versione recente).
*/
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const target = path.join(root, 'script.js');
const dict = {};
for (const l of ['it', 'en', 'ru']) {
  const file = path.join(__dirname, `copy.${l}.json`);
  dict[l] = JSON.parse(fs.readFileSync(file, 'utf8'));
}

const src = fs.readFileSync(target, 'utf8');
const start = src.indexOf('const I18N = ');
if (start < 0) throw new Error('Blocco "const I18N = " non trovato in script.js');
const endMarker = '\n};\n';
const end = src.indexOf(endMarker, start);
if (end < 0) throw new Error('Fine del blocco I18N non trovata');

const block = 'const I18N = ' + JSON.stringify(dict, null, 2) + ';\n';
const out = src.slice(0, start) + block + src.slice(end + endMarker.length);

/* verifica: il blocco riscritto deve tornare identico ai JSON */
const check = JSON.parse(out.slice(out.indexOf('const I18N = ') + 'const I18N = '.length, out.indexOf(endMarker, out.indexOf('const I18N = ')) + 2));
for (const l of ['it', 'en', 'ru']) {
  if (JSON.stringify(check[l]) !== JSON.stringify(dict[l])) throw new Error('Dizionario ' + l + ' non identico dopo la scrittura');
}
fs.writeFileSync(target, out);
console.log('script.js aggiornato: dizionari it/en/ru incorporati (' + out.length + ' byte).');

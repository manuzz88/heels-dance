# Heels Dance Milano · sito vetrina di Kristina

Sito statico (HTML, CSS e JavaScript puri, nessun build step) per le lezioni di heels dance
di Kristina a Milano, zona Brera. Tre lingue: italiano (principale), inglese e russo, con switch
nell'header, nel menu mobile e nel footer. Prenotazioni via WhatsApp (link precompilato) e Instagram.

## Struttura

```
index.html          pagina unica (one-page): contenuto italiano completo nell'HTML
styles.css          stile (token del brief, @font-face dei font self-hosted, motion opt-in)
script.js           CONFIG (dati da personalizzare) · dizionari I18N it/en/ru · interazioni
favicon.svg         monogramma K-stiletto (+ favicon-512.png e apple-touch-icon.png)
og-image.png        anteprima 1200×630 per WhatsApp/Telegram/social (generata dal design dell'hero)
assets/
  fonts/            Bodoni Moda, Inter Tight, Playfair Display in .woff2 (licenza OFL, nessuna chiamata a Google)
  heel-*.svg        silhouette della scarpa (usate inline)
  img/              foto del sito (ritratto reale di Kristina + immagini di anteprima), vedi docs/FOTO_DA_FORNIRE.md
docs/
  BRIEF.md          brief di design vincolante
  RICERCA_E_CONCEPT.md   ricerca e concept di partenza
  copy.it.json · copy.en.json · copy.ru.json   testi sorgente (identici ai dizionari in script.js)
  FOTO_DA_FORNIRE.md   slot foto/video: nomi file, proporzioni, dimensioni, come sostituire i segnaposto
  genera-script.js     (facoltativo) re-incorpora i JSON in script.js dopo una modifica ai testi
```

## Richieste via Telegram (il ponte)

Kristina scrive al bot `@Kristina_sito_bot`, Gemini fa la modifica, i controlli automatici la
verificano e il sito si pubblica da solo. L'anteprima arriva a chi ha fatto la richiesta.
Manuel riceve un messaggio solo quando qualcosa non funziona.

Per tornare all'approvazione con un tocco (Manuel riceve screenshot e due pulsanti, e niente
viene pubblicato senza il suo assenso):

```
touch ~/.config/heels-bot/chiedi-approvazione   # attiva l'approvazione
rm ~/.config/heels-bot/chiedi-approvazione      # torna alla pubblicazione diretta
```

Come funziona un giro:

1. Arriva la richiesta, in qualsiasi lingua.
2. `gemini-3.8-flash` legge il progetto e propone la modifica in formato preciso.
3. La modifica viene applicata e **verificata**: JSON validi, JavaScript valido, nessun errore in
   pagina, nessuno sbordamento a 390, 768 e 1440 pixel, nelle tre lingue. Se qualcosa non regge,
   tutto viene annullato e Manuel riceve il motivo.
4. Se i controlli passano, parte il commit e il sito si aggiorna in un paio di minuti.
5. Chi ha scritto riceve l'anteprima e la conferma nella propria lingua, con il link al sito.

Comandi:

```
python3 tools/bot.py --registra     # da lanciare dopo aver scritto al bot: registra l'amministratore
python3 tools/bot.py --ciclo        # un giro completo (è quello che gira ogni 5 minuti)
python3 tools/bot.py --autorizza <chat_id> Kristina
python3 tools/bot.py --stato        # chi è autorizzato e cosa c'è in sospeso
python3 tools/bot.py --annulla      # scarta la proposta in sospeso
bash tools/attiva-bot.sh            # installa il controllo automatico ogni 5 minuti
```

Segreti, tutti fuori dal progetto in `~/.config/heels-bot/`: `token` (bot Telegram),
`gemini-key` (chiave dedicata, separata da quella di Renderium), `mio-chat-id`,
`autorizzati.json`. Il bot accetta ordini solo dalle persone autorizzate.

Costo indicativo: circa 75.000 gettoni per richiesta, qualche centesimo. Il modello si cambia
con la variabile d'ambiente `HEELS_MODELLO`.

## Per Kristina

Guida completa per scaricare il progetto, modificarlo e ripubblicarlo, senza saper programmare:

- Italiano: `docs/GUIDA-KRISTINA.md`
- Русский: `docs/GUIDA-KRISTINA-RU.md`

Domande ancora aperte: `docs/DA-CHIEDERE-A-KRISTINA.md`.

## Come personalizzare (5 minuti)

1. Apri `script.js`: il blocco `CONFIG` in cima è l'unico posto da modificare. Ogni campo è commentato:
   grafia del nome (`brand.firstName`, `brand.firstNameCyrillic`), numero WhatsApp (`contacts.whatsappNumber`,
   formato internazionale senza `+`), handle Instagram, email, nome/indirizzo dello spazio, query per
   Google Maps, orari (`schedule`), prezzi (`pricing`), P.IVA, testimonianze, lingua iniziale.
2. Finché `scheduleConfirmed` / `pricingConfirmed` restano `false`, orari e prezzi mostrano gli **esempi**
   dei dizionari con il badge «Esempio» e la nota. Quando sono definitivi: metti `true` e compila le righe.
3. I segnaposto `[TODO: …]` nei testi (bio, durata, politica di disdetta…) vivono nei dizionari:
   sostituiscili in `docs/copy.*.json` e lancia `node docs/genera-script.js`, oppure modifica direttamente `script.js`.
   Con `showTodos: true` (sviluppo) restano visibili ed evidenziati; con `showTodos: false` (produzione)
   vengono rimossi dal testo. Prima del lancio conviene comunque riscrivere le frasi che li contenevano.
4. La sezione «Voci» (testimonianze) resta nascosta finché `showTestimonials` è `false` o non ci sono
   recensioni vere in `testimonials`.
5. Foto e video: segui `docs/FOTO_DA_FORNIRE.md`.
6. Apri `index.html` in un browser per controllare: nessun server necessario. In console, `checkI18N()`
   segnala chiavi mancanti e `checkConfig()` elenca i campi ancora vuoti.

## Testi e lingue

- Fonte di verità: `docs/copy.it.json`, `copy.en.json`, `copy.ru.json`. In `script.js` sono incorporati
  integralmente nel blocco `I18N`. Dopo aver modificato i JSON, `node docs/genera-script.js` riscrive solo
  quel blocco in `script.js` (CONFIG e logica restano intatti); in alternativa si può modificare `I18N` a mano.
- Il nome «Kristina»/«Кристина» nei testi è sostituito a runtime con la grafia in `CONFIG.brand`
  (comprese le declinazioni russe): cambiando la grafia cambia ovunque.
- Lo switch salva la scelta in `localStorage` (`hd-lang`); l'URL `index.html#lang=en` forza una lingua.
  `window.setLang('ru')` è disponibile per test.
- Una sola URL: i motori di ricerca indicizzano l'italiano (contenuto statico dell'HTML). Se in futuro
  servirà posizionamento in EN/RU: pagine separate `/en/`, `/ru/` con `hreflang` (non in questa versione).

## Prossime date (workshop e lezioni singole)

La sezione «Prossime date» è quella da tenere aggiornata: si compila in `CONFIG.upcoming`,
una riga per data. Esempio:

```js
upcomingConfirmed: true,
upcoming: [
  { type: 'workshop', date: '2026-11-08', time: '16:00–19:00',
    title: 'Heels choreo · Rihanna', level: 'Open level',
    duration: '3 h', price: '35 €', status: 'open' }
]
```

Comportamento automatico:

- Le date passate spariscono da sole, non serve cancellarle.
- Con l'elenco vuoto la sezione mostra «scrivimi e ti avviso appena esce la prossima data».
- Finché `upcomingConfirmed` è `false` compaiono due date di esempio con il badge «Esempio»
  (solo in sviluppo, cioè con `showTodos: true`).
- Il giorno della settimana viene scritto da solo, tradotto nelle tre lingue.
- `showWeeklySchedule: false` toglie del tutto la sezione «Orari», se per ora si lavora
  solo con workshop e lezioni singole.

Domande aperte da porre a Kristina: `docs/DA-CHIEDERE-A-KRISTINA.md`.

## Immagini (stato attuale)

Tutte le immagini del sito sono **fotografie vere**: il ritratto nella sezione «Chi insegna»
(`kristina-ritratto-1600.*`) e quattro scatti in sala (`kristina-lezione`, `kristina-tacchi`,
`kristina-camminata`, `kristina-posa`). Le immagini generate al computer usate nella prima demo sono
state rimosse. Restano segnaposto di design due cornici: il video 9:16 e lo scatto orizzontale a Brera.
Dettagli e istruzioni per sostituirle: `docs/FOTO_DA_FORNIRE.md`.

## Prima del lancio

- `CONFIG.site.url` con il dominio definitivo (serve per `og:url`, `og:image` e JSON-LD) e, nell'`<head>`
  di `index.html`, i due `<meta>` `og:url` e `og:image` assoluti (i crawler non eseguono JavaScript).
- `CONFIG.showTodos = false`; nessun `[TODO]` visibile in pagina.
- Dati fiscali nel footer (`CONFIG.legal`).

## Pubblicazione (gratuita)

- **Cloudflare Pages** o **Netlify Drop** (trascina la cartella su https://app.netlify.com/drop): online in un minuto.
- GitHub Pages: solo con repository pubblico. Vercel Hobby: evitare (vietato per uso commerciale).
- Dominio personalizzato: si collega dal pannello dell'hosting scelto.

## Note

- Nessun cookie, nessun form, nessuna risorsa da terze parti: i font sono serviti da `assets/fonts/`,
  quindi non serve un cookie banner e la riga privacy del footer è vera. Le prenotazioni passano da
  WhatsApp e Instagram, secondo le rispettive informative.
- Accessibilità: skip link, un solo `h1`, landmark, accordion con `button`/`aria-expanded`, menu mobile con
  focus trap ed Esc, target ≥ 44 px, focus visibile, animazioni opt-in (disattivate con «riduci movimento»),
  controllo «Pausa» persistente per i nastri scorrevoli.
- Senza JavaScript la pagina resta completa in italiano: menu visibile, FAQ aperte, link alle sezioni.

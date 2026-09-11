# Foto e video da fornire

Il sito è progettato per funzionare **senza foto**: ogni immagine futura ha già la sua «cornice» con
proporzioni fisse, bordo e cartellino numerato. Quando arriva una foto entra nella cornice senza spostare
nulla (layout invariato, nessun salto di pagina). Questo documento dice cosa serve, come chiamare i file
e come sostituire i segnaposto in `index.html`.

Cartella di destinazione: `assets/img/` (da creare). Formato consigliato: JPEG qualità 80–85 (o WebP),
profilo sRGB, senza metadati. Il video in MP4 (H.264) con poster JPEG.

## Elenco degli slot

| Slot | File consigliato | Proporzioni | Dimensioni (px) | Orientamento | Soggetto suggerito | Dove compare |
|---|---|---|---|---|---|---|
| SLOT-01 | `01-hero-kristina.jpg` | 4:5 | 1600×2000 (min 1200×1500) | verticale | Kristina a figura intera sui tacchi, in movimento o in *bevel*, fondo neutro chiaro o muro di Brera; il soggetto nel terzo destro dell'inquadratura (a sinistra passa la linea-tacco disegnata) | Hero, «il quadro»: oggi è il quadrato rosso con cartellino n.01 |
| SLOT-02 | `02-kristina-ritratto.jpg` | 4:5 | 1200×1500 | verticale | Ritratto a mezza figura, sguardo in camera, luce laterale naturale, spazio sopra la testa | Sezione 04 «Kristina», cornice n.02 |
| SLOT-03 | `03-video-camminata.mp4` + `03-video-poster.jpg` | 9:16 | 1080×1920, 6–10 secondi in loop, muto | verticale | Camminata attraverso la sala, ripresa frontale, tacchi in primo piano | Sezione 07 «Dove», parete, cornice n.03 (oggi «Video in arrivo») |
| SLOT-04 | `04-dettaglio-tacco.jpg` | 4:5 | 1200×1500 | verticale | Dettaglio: scarpa col tacco sul parquet, bevel, caviglia | Parete, cornice n.04 |
| SLOT-05 | `05-la-classe.jpg` | 4:5 | 1200×1500 | verticale | La classe da dietro, in fila, durante la camminata | Parete, cornice n.05 |
| SLOT-06 | `06-mani-posa.jpg` | 1:1 | 1200×1200 | quadrato | Mani e posa, dettaglio di braccia, senza volto | Parete, cornice n.06 |
| SLOT-07 | `07-brera-cortile.jpg` | 3:2 | 1500×1000 | orizzontale | Esterno a Brera: cortile, ciottoli, un tacco in primo piano | Parete, cornice n.07 |
| SLOT-08 | `08-ingresso.jpg` (facoltativo) | 4:3 | 1600×1200 | orizzontale | Non è una foto: resta la pianta astratta. In futuro può ospitare una foto dell'ingresso dello spazio | Sezione 07 «Dove», cornice n.08 |
| SLOT-09 | `og-image.png` | 1.91:1 | 1200×630, PNG < 300 KB | orizzontale | Anteprima per WhatsApp/Telegram/Instagram: è già generata dal design dell'hero (titolo, quadrato rosso, linea-tacco); quando ci sarà la foto dell'hero si può rigenerare con la foto | `<meta property="og:image">` (vedi README, «Prima del lancio») |
| SLOT-10 | `favicon.svg`, `favicon-512.png`, `apple-touch-icon.png` | 1:1 | SVG + 512×512 + 180×180 | — | Monogramma K-stiletto su Avorio: già presenti nella cartella principale | Icona del sito |

## Linee guida per lo shooting

- Luce naturale o laterale; niente flash frontale, niente filtri Instagram.
- Fondi neutri: muro, parquet, cortile. Evitare specchi con riflessi e cavi a vista.
- Lasciare aria intorno al soggetto: le cornici tagliano ai bordi (`object-fit: cover`), quindi tenere il
  soggetto lontano dai margini, soprattutto nel formato 4:5 e nell'hero (soggetto nel terzo destro).
- Se gli scatti vengono da giornate diverse, si uniformano con la modalità duotono (`class="frame frame--duo"`):
  bianco e nero leggero con un velo rosso al 10%. Non si applica al video.
- Video: muto, in loop, senza testi in sovrimpressione; il poster è il primo fotogramma.

## Come sostituire un segnaposto

Ogni cornice in `index.html` è preceduta da un commento `<!-- SLOT-XX · … -->` con le istruzioni.
La struttura è sempre questa:

```html
<figure class="… frame-wrap" aria-hidden="true">      ← 1. togliere aria-hidden (la foto è contenuto)
  <div class="frame" data-slot="02" data-ratio="4/5">   ← 2. aggiungere class="frame has-media"
    <svg class="frame__art …">…opera segnaposto…</svg>  ← lasciare: resta sotto come fallback
    <!-- 3. inserire qui la foto -->
    <img class="frame__media" src="assets/img/02-kristina-ritratto.jpg"
         alt="Kristina in piedi sui tacchi in studio, a Brera" width="1200" height="1500"
         loading="lazy" decoding="async">
  </div>
  <figcaption class="cartellino"><span class="cartellino__n">n.02</span><span data-i18n="ui.photo_placeholder">Foto in arrivo</span></figcaption>
</figure>
```

4. Nel `figcaption` sostituire `<span data-i18n="ui.photo_placeholder">Foto in arrivo</span>` con una
   didascalia vera (es. `<span>Studio, Brera</span>`), oppure toglierlo lasciando solo il numero.
5. L'`alt` va scritto in italiano (la lingua statica della pagina); è descrittivo e breve.

### Hero (SLOT-01)

Nell'hero la cornice è `<figure class="hero__frame">` (il quadrato rosso). Aggiungere `class="hero__frame has-media"`
e inserire l'`<img class="frame__media" … decoding="async">` (senza `loading="lazy"`: è nella prima schermata)
prima del `figcaption`. Con la foto il quadrato diventa la foto, il bordo passa a 2 px rosso Minio e il
cartellino scende su una fascia Avorio in basso.

### Video (SLOT-03)

```html
<div class="frame has-media" data-slot="03" data-ratio="9/16">
  <svg class="frame__art …">…</svg>
  <video class="frame__media" src="assets/img/03-video-camminata.mp4" poster="assets/img/03-video-poster.jpg"
         muted playsinline loop preload="none" aria-label="Camminata sui tacchi attraverso la sala"></video>
</div>
```

Non aggiungere `autoplay` nel markup: per rispettare chi ha «riduci movimento» attivo, l'avvio automatico
va gestito da JavaScript solo quando `prefers-reduced-motion` non è impostato (in `script.js` basta aggiungere,
dentro `initHero()`, `if (!reduce) document.querySelectorAll('video.frame__media').forEach(v => v.play())`).
Il triangolo «play» (`<svg class="frame__play">`) va rimosso quando c'è il video vero.

### La parete (SLOT-03…07)

Il contenitore `<div class="wall" aria-hidden="true">` è nascosto ai lettori di schermo finché contiene solo
segnaposto: alla prima foto togliere `aria-hidden` dal `div.wall` e dalle singole `figure`.

## Dopo la sostituzione: controlli

- Aprire `index.html` e verificare che la cornice non sia cambiata di misura (le proporzioni sono dichiarate
  in `data-ratio`: se la foto ha proporzioni diverse viene ritagliata al centro, non deformata).
- Controllare a 390 px di larghezza (telefono) e a 1440 px.
- Pesare i file: ogni foto sotto i 400 KB, il video sotto i 3 MB.


## Stato attuale delle cornici (11 settembre 2026)

| Slot | Stato | File in `assets/img/` | Da fare prima del lancio |
|---|---|---|---|
| SLOT-01 hero | immagine GENERATA da una foto di Kristina (demo) | `kristina-hero.*` | sostituire con uno scatto vero a figura intera sui tacchi (4:5, min 1200×1500) |
| SLOT-02 ritratto | FOTO REALE di Kristina (fornita da Manuel) | `kristina-ritratto-1600.*` | opzionale: ritratto in studio con luce laterale |
| SLOT-03 video | segnaposto | — | video 9:16 di 6–10 s, muto |
| SLOT-04 dettaglio scarpe | immagine GENERATA (demo) | `kristina-scarpe.*` | scatto vero: scarpe sul parquet, bevel |
| SLOT-05 la classe | immagine GENERATA (demo) | `kristina-classe.*` | scatto vero della classe da dietro (con consenso delle persone) |
| SLOT-06 mani | immagine GENERATA (demo) | `kristina-mani.*` | scatto vero, dettaglio mani/braccia |
| SLOT-07 Brera | immagine GENERATA (demo) | `kristina-brera.*` | scatto vero in un cortile di Brera |

Le immagini generate servono solo a mostrare l'effetto finale del sito: Kristina deve approvarle prima di qualunque condivisione
pubblica, e vanno sostituite dagli scatti veri appena disponibili. Per sostituire un'immagine basta salvare i nuovi file con lo
stesso nome (`.jpg` e `.webp`, più la versione `-800`) oppure cambiare i percorsi nel `<picture>` dello slot in `index.html`.
Le didascalie e i testi alternativi delle foto stanno nei dizionari sotto la chiave `photos` (in `script.js` e in `docs/copy.*.json`).
